import { create } from 'zustand';
import {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
  MarkerType,
} from '@xyflow/react';
import {
  DiagramDocument,
  DiagramElement,
  DiagramConnection,
  ElementType,
  DiagramElementData,
} from '@/types/diagram';
import {
  getDiagramFromIDB,
  saveDiagramToIDB,
  createDefaultDiagram,
  generateDiagramId,
} from '@/lib/storage/idbStorage';

interface HistorySnapshot {
  nodes: Node[];
  edges: Edge[];
}

export type EditorTool = 'select' | 'shape' | 'arrow' | 'text' | 'tech' | 'group';

interface DiagramStoreState {
  currentDiagram: DiagramDocument | null;
  nodes: Node[];
  edges: Edge[];
  selectedNodes: Node[];
  selectedEdges: Edge[];
  saveStatus: 'saved' | 'saving' | 'failed';
  lastSavedAt: string | null;
  activeTool: EditorTool;

  // Modals & Drawers
  isDslOpen: boolean;
  isIconModalOpen: boolean;
  isExportModalOpen: boolean;
  isShareModalOpen: boolean;
  isRecentModalOpen: boolean;

  // History
  undoStack: HistorySnapshot[];
  redoStack: HistorySnapshot[];

  // Actions
  initDiagram: (diagramId?: string) => Promise<void>;
  setDiagramTitle: (title: string) => void;
  setActiveTool: (tool: EditorTool) => void;
  setIsDslOpen: (open: boolean) => void;
  setIsIconModalOpen: (open: boolean) => void;
  setIsExportModalOpen: (open: boolean) => void;
  setIsShareModalOpen: (open: boolean) => void;
  setIsRecentModalOpen: (open: boolean) => void;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onSelectionChange: (params: { nodes: Node[]; edges: Edge[] }) => void;

  addNode: (type: ElementType, data?: Partial<DiagramElementData>, position?: { x: number; y: number }) => void;
  updateSelectedElementData: (data: Partial<DiagramElementData>) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;

  undo: () => void;
  redo: () => void;
  recordHistory: () => void;

  saveToDatabase: () => Promise<void>;
  setGraphFromDsl: (nodes: Node[], edges: Edge[]) => void;
  importDiagramJson: (json: string) => boolean;
}

let saveTimeout: NodeJS.Timeout | null = null;

// Convert Canonical Document -> React Flow Nodes & Edges
function documentToFlow(doc: DiagramDocument): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = doc.elements.map(el => ({
    id: el.id,
    type: el.type,
    position: el.position,
    parentId: el.parentId,
    style: {
      width: el.dimensions.width,
      height: el.dimensions.height,
    },
    data: el.data,
  }));

  const edges: Edge[] = doc.connections.map(conn => ({
    id: conn.id,
    source: conn.source,
    target: conn.target,
    sourceHandle: conn.sourceHandle,
    targetHandle: conn.targetHandle,
    label: conn.label,
    type: 'orthogonal',
    markerEnd: conn.arrowHead !== 'none' ? { type: MarkerType.ArrowClosed, color: conn.strokeColor || '#64748B' } : undefined,
    style: {
      stroke: conn.strokeColor || '#64748B',
      strokeWidth: conn.strokeWidth || 1.8,
      strokeDasharray: conn.strokeStyle === 'dashed' ? '5 5' : conn.strokeStyle === 'dotted' ? '2 2' : undefined,
    },
  }));

  return { nodes, edges };
}

// Convert React Flow Nodes & Edges -> Canonical Document
function flowToDocument(
  currentDoc: DiagramDocument,
  nodes: Node[],
  edges: Edge[]
): DiagramDocument {
  const elements: DiagramElement[] = nodes.map(n => ({
    id: n.id,
    type: (n.type as ElementType) || 'architecture',
    position: n.position,
    parentId: n.parentId,
    dimensions: {
      width: Number(n.style?.width || (n.measured?.width ?? 180)),
      height: Number(n.style?.height || (n.measured?.height ?? 74)),
    },
    data: (n.data as DiagramElementData) || { label: 'Node' },
  }));

  const connections: DiagramConnection[] = edges.map(e => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle || undefined,
    targetHandle: e.targetHandle || undefined,
    label: typeof e.label === 'string' ? e.label : undefined,
    routing: 'orthogonal',
    strokeColor: typeof e.style?.stroke === 'string' ? e.style.stroke : '#64748B',
    strokeWidth: typeof e.style?.strokeWidth === 'number' ? e.style.strokeWidth : 1.8,
    arrowHead: e.markerEnd ? 'arrow' : 'none',
  }));

  return {
    ...currentDoc,
    elements,
    connections,
    updatedAt: new Date().toISOString(),
    revision: (currentDoc.revision || 0) + 1,
  };
}

export const useDiagramStore = create<DiagramStoreState>((set, get) => ({
  currentDiagram: null,
  nodes: [],
  edges: [],
  selectedNodes: [],
  selectedEdges: [],
  saveStatus: 'saved',
  lastSavedAt: null,
  activeTool: 'select',

  isDslOpen: false,
  isIconModalOpen: false,
  isExportModalOpen: false,
  isShareModalOpen: false,
  isRecentModalOpen: false,

  undoStack: [],
  redoStack: [],

  initDiagram: async (diagramId?: string) => {
    try {
      let doc: DiagramDocument | null = null;
      if (diagramId) {
        doc = await getDiagramFromIDB(diagramId);
      }

      if (!doc) {
        doc = createDefaultDiagram(diagramId);
        await saveDiagramToIDB(doc);
      }

      const { nodes, edges } = documentToFlow(doc);
      set({
        currentDiagram: doc,
        nodes,
        edges,
        undoStack: [],
        redoStack: [],
        saveStatus: 'saved',
        lastSavedAt: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      console.error('Failed to init diagram from IDB:', err);
      const fallback = createDefaultDiagram(diagramId);
      const { nodes, edges } = documentToFlow(fallback);
      set({
        currentDiagram: fallback,
        nodes,
        edges,
        saveStatus: 'failed',
      });
    }
  },

  setDiagramTitle: (title: string) => {
    const { currentDiagram } = get();
    if (!currentDiagram) return;
    const updated = { ...currentDiagram, title };
    set({ currentDiagram: updated });
    get().saveToDatabase();
  },

  setActiveTool: (tool: EditorTool) => set({ activeTool: tool }),
  setIsDslOpen: (open: boolean) => set({ isDslOpen: open }),
  setIsIconModalOpen: (open: boolean) => set({ isIconModalOpen: open }),
  setIsExportModalOpen: (open: boolean) => set({ isExportModalOpen: open }),
  setIsShareModalOpen: (open: boolean) => set({ isShareModalOpen: open }),
  setIsRecentModalOpen: (open: boolean) => set({ isRecentModalOpen: open }),

  recordHistory: () => {
    const { nodes, edges, undoStack } = get();
    set({
      undoStack: [...undoStack.slice(-30), { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }],
      redoStack: [],
    });
  },

  undo: () => {
    const { undoStack, redoStack, nodes, edges } = get();
    if (undoStack.length === 0) return;

    const previous = undoStack[undoStack.length - 1];
    const newUndo = undoStack.slice(0, -1);

    set({
      nodes: previous.nodes,
      edges: previous.edges,
      undoStack: newUndo,
      redoStack: [{ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }, ...redoStack],
    });
    get().saveToDatabase();
  },

  redo: () => {
    const { undoStack, redoStack, nodes, edges } = get();
    if (redoStack.length === 0) return;

    const next = redoStack[0];
    const newRedo = redoStack.slice(1);

    set({
      nodes: next.nodes,
      edges: next.edges,
      redoStack: newRedo,
      undoStack: [...undoStack, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }],
    });
    get().saveToDatabase();
  },

  onNodesChange: (changes) => {
    const hasPositionOrRemove = changes.some(c => c.type === 'position' && c.dragging === false || c.type === 'remove');
    if (hasPositionOrRemove) {
      get().recordHistory();
    }

    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
    get().saveToDatabase();
  },

  onEdgesChange: (changes) => {
    const hasRemove = changes.some(c => c.type === 'remove');
    if (hasRemove) {
      get().recordHistory();
    }

    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
    get().saveToDatabase();
  },

  onConnect: (connection: Connection) => {
    get().recordHistory();
    const newEdge: Edge = {
      ...connection,
      id: `edge-${Date.now()}`,
      type: 'orthogonal',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#64748B' },
      style: { stroke: '#64748B', strokeWidth: 1.8 },
    };
    set({
      edges: addEdge(newEdge, get().edges),
    });
    get().saveToDatabase();
  },

  onSelectionChange: ({ nodes, edges }) => {
    set({
      selectedNodes: nodes,
      selectedEdges: edges,
    });
  },

  addNode: (type, data = {}, position) => {
    get().recordHistory();
    const id = `node-${Date.now()}`;
    const defaultPos = position || {
      x: 300 + Math.random() * 50,
      y: 200 + Math.random() * 50,
    };

    let defaultDimensions = { width: 180, height: 74 };
    if (type === 'group') defaultDimensions = { width: 400, height: 260 };
    if (type === 'shape') defaultDimensions = { width: 140, height: 70 };
    if (type === 'text') defaultDimensions = { width: 160, height: 40 };

    const newNode: Node = {
      id,
      type,
      position: defaultPos,
      style: defaultDimensions,
      data: {
        label: data.label || (type === 'group' ? 'New Group' : type === 'text' ? 'Text Note' : 'Component'),
        subtitle: data.subtitle,
        icon: data.icon,
        shape: data.shape || 'rectangle',
        fillColor: data.fillColor || (type === 'group' ? 'rgba(59, 130, 246, 0.04)' : '#FFFFFF'),
        strokeColor: data.strokeColor || (type === 'group' ? '#3B82F6' : '#94A3B8'),
        strokeStyle: data.strokeStyle || (type === 'group' ? 'dashed' : 'solid'),
        ...data,
      },
    };

    set({
      nodes: [...get().nodes, newNode],
      activeTool: 'select',
    });
    get().saveToDatabase();
  },

  updateSelectedElementData: (partialData) => {
    const { selectedNodes, nodes, selectedEdges, edges } = get();
    if (selectedNodes.length === 0 && selectedEdges.length === 0) return;

    get().recordHistory();

    if (selectedNodes.length > 0) {
      const selectedId = selectedNodes[0].id;
      const updatedNodes = nodes.map(n => {
        if (n.id === selectedId) {
          return {
            ...n,
            data: {
              ...(n.data as DiagramElementData),
              ...partialData,
            },
          };
        }
        return n;
      });
      set({ nodes: updatedNodes });
    } else if (selectedEdges.length > 0) {
      const selectedId = selectedEdges[0].id;
      const updatedEdges = edges.map(e => {
        if (e.id === selectedId) {
          return {
            ...e,
            label: partialData.label !== undefined ? partialData.label : e.label,
            style: {
              ...e.style,
              stroke: partialData.strokeColor || e.style?.stroke,
              strokeDasharray: partialData.strokeStyle === 'dashed' ? '5 5' : partialData.strokeStyle === 'dotted' ? '2 2' : undefined,
            },
          };
        }
        return e;
      });
      set({ edges: updatedEdges });
    }

    get().saveToDatabase();
  },

  deleteSelected: () => {
    const { selectedNodes, selectedEdges, nodes, edges } = get();
    if (selectedNodes.length === 0 && selectedEdges.length === 0) return;

    get().recordHistory();
    const nodeIdsToDelete = new Set(selectedNodes.map(n => n.id));
    const edgeIdsToDelete = new Set(selectedEdges.map(e => e.id));

    // Also remove any edges attached to deleted nodes
    edges.forEach(e => {
      if (nodeIdsToDelete.has(e.source) || nodeIdsToDelete.has(e.target)) {
        edgeIdsToDelete.add(e.id);
      }
    });

    set({
      nodes: nodes.filter(n => !nodeIdsToDelete.has(n.id)),
      edges: edges.filter(e => !edgeIdsToDelete.has(e.id)),
      selectedNodes: [],
      selectedEdges: [],
    });
    get().saveToDatabase();
  },

  duplicateSelected: () => {
    const { selectedNodes, nodes } = get();
    if (selectedNodes.length === 0) return;

    get().recordHistory();
    const newNodes: Node[] = selectedNodes.map(n => ({
      ...JSON.parse(JSON.stringify(n)),
      id: `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      position: {
        x: n.position.x + 30,
        y: n.position.y + 30,
      },
      selected: true,
    }));

    // Deselect original nodes
    const unselectedNodes = nodes.map(n => ({ ...n, selected: false }));
    set({
      nodes: [...unselectedNodes, ...newNodes],
      selectedNodes: newNodes,
    });
    get().saveToDatabase();
  },

  saveToDatabase: async () => {
    if (saveTimeout) clearTimeout(saveTimeout);
    set({ saveStatus: 'saving' });

    saveTimeout = setTimeout(async () => {
      try {
        const { currentDiagram, nodes, edges } = get();
        if (!currentDiagram) return;

        const docToSave = flowToDocument(currentDiagram, nodes, edges);
        await saveDiagramToIDB(docToSave);

        set({
          currentDiagram: docToSave,
          saveStatus: 'saved',
          lastSavedAt: new Date().toLocaleTimeString(),
        });
      } catch (err) {
        console.error('Error saving diagram to IndexedDB:', err);
        set({ saveStatus: 'failed' });
      }
    }, 500); // 500ms debounce
  },

  setGraphFromDsl: (newNodes, newEdges) => {
    get().recordHistory();
    set({
      nodes: newNodes,
      edges: newEdges,
    });
    get().saveToDatabase();
  },

  importDiagramJson: (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString) as DiagramDocument;
      if (!parsed.schemaVersion || !Array.isArray(parsed.elements)) {
        return false;
      }
      get().recordHistory();
      const { nodes, edges } = documentToFlow(parsed);
      set({
        currentDiagram: parsed,
        nodes,
        edges,
        saveStatus: 'saved',
      });
      get().saveToDatabase();
      return true;
    } catch {
      return false;
    }
  },
}));

