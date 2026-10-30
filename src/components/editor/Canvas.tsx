'use client';

import React, { useMemo, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  SelectionMode,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useDiagramStore } from '@/lib/store/diagramStore';
import { ArchitectureNode } from '@/components/nodes/ArchitectureNode';
import { ShapeNode } from '@/components/nodes/ShapeNode';
import { GroupNode } from '@/components/nodes/GroupNode';
import { TextNode } from '@/components/nodes/TextNode';
import { OrthogonalEdge } from '@/components/edges/OrthogonalEdge';
import { ToolRail } from '@/components/editor/ToolRail';
import { ContextToolbar } from '@/components/editor/ContextToolbar';
import { DslPanel } from '@/components/dsl/DslPanel';
import { IconLibraryModal } from '@/components/editor/IconLibraryModal';
import { ExportModal } from '@/components/editor/ExportModal';
import { ShareModal } from '@/components/editor/ShareModal';
import { RecentDiagramsModal } from '@/components/editor/RecentDiagramsModal';

export function Canvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onSelectionChange,
    undo,
    redo,
    deleteSelected,
    duplicateSelected,
    activeTool,
  } = useDiagramStore();

  const nodeTypes = useMemo(
    () => ({
      architecture: ArchitectureNode,
      shape: ShapeNode,
      group: GroupNode,
      text: TextNode,
    }),
    []
  );

  const edgeTypes = useMemo(
    () => ({
      orthogonal: OrthogonalEdge,
    }),
    []
  );

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (modKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if (modKey && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if (modKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicateSelected();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, deleteSelected, duplicateSelected]);

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] bg-slate-50 overflow-hidden">
      {/* Floating Left Tool Rail */}
      <ToolRail />

      {/* Floating Contextual Properties Toolbar */}
      <ContextToolbar />

      {/* Diagram-as-Code Slide-over */}
      <DslPanel />

      {/* Modals */}
      <IconLibraryModal />
      <ExportModal />
      <ShareModal />
      <RecentDiagramsModal />

      {/* Main React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          type: 'orthogonal',
        }}
        selectionMode={SelectionMode.Partial}
        proOptions={{ hideAttribution: true }}
        className="eraser-canvas"
      >
        {/* Subtle Eraser Dot Grid */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.2}
          color="#94A3B8"
          className="opacity-40"
        />

        {/* Canvas Navigation & Controls */}
        <Controls
          showInteractive={false}
          className="!bg-white/95 !border !border-slate-200 !rounded-xl !shadow-md !p-0.5"
        />

        {/* Canvas Mini-map */}
        <MiniMap
          nodeColor={n => {
            if (n.type === 'group') return '#93C5FD';
            if (n.type === 'architecture') return '#3B82F6';
            return '#E2E8F0';
          }}
          className="!bg-white/90 !border !border-slate-200 !rounded-xl !shadow-md overflow-hidden"
          zoomable
          pannable
        />
      </ReactFlow>
    </div>
  );
}

