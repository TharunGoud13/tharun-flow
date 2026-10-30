'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Tldraw,
  Editor,
  createShapeId,
  exportAs,
  toRichText,
} from 'tldraw';
import 'tldraw/tldraw.css';

import { EraserInsertItemModal } from './EraserInsertItemModal';
import { PageBar } from './PageBar';
import { IconItem } from '@/lib/icons/iconRegistry';
import { 
  Undo2, Redo2, Download, Share2, Code2, 
  CheckCircle2, Loader2, Maximize2, MousePointer2,
  Square, Circle, Diamond, ArrowUpRight, Minus, 
  Frame, Type, StickyNote, Pencil, Cpu
} from 'lucide-react';
import { parseEraserDsl } from '@/lib/dsl/eraserDslParser';
import { layoutGraphWithDagre } from '@/lib/dsl/dslLayout';

interface TldrawStudioProps {
  diagramId?: string;
}

export function TldrawStudio({ diagramId = 'default' }: TldrawStudioProps) {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [activeTool, setActiveTool] = useState<string>('select');
  const [title, setTitle] = useState('System Architecture');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isInsertModalOpen, setIsInsertModalOpen] = useState(false);
  const [isDslOpen, setIsDslOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [currentPageName, setCurrentPageName] = useState<string>('Page 1');
  const saveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleSaveNotification = useCallback(() => {
    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      setSaveStatus('saved');
    }, 400);
  }, []);

  // Track active page name and active tool changes from editor
  useEffect(() => {
    if (!editor) return;

    const updateCurrentPage = () => {
      try {
        const page = editor.getCurrentPage();
        if (page) setCurrentPageName(page.name);
      } catch (e) {
        // Ignore if disposed
      }
    };

    updateCurrentPage();
    const unlisten = editor.store.listen(() => {
      updateCurrentPage();
      handleSaveNotification();
    });

    const interval = setInterval(() => {
      const current = editor.getCurrentToolId();
      setActiveTool(current);
    }, 150);

    return () => {
      clearInterval(interval);
      unlisten();
    };
  }, [editor, handleSaveNotification]);

  // Set active tool on editor
  const selectTool = useCallback((toolId: string) => {
    if (!editor) return;
    setActiveTool(toolId);

    if (toolId === 'rectangle') {
      editor.setCurrentTool('geo', { geo: 'rectangle' });
    } else if (toolId === 'ellipse') {
      editor.setCurrentTool('geo', { geo: 'ellipse' });
    } else if (toolId === 'diamond') {
      editor.setCurrentTool('geo', { geo: 'rhombus' });
    } else if (toolId === 'arrow') {
      editor.setCurrentTool('arrow');
    } else if (toolId === 'line') {
      editor.setCurrentTool('line');
    } else if (toolId === 'frame') {
      editor.setCurrentTool('frame');
    } else if (toolId === 'text') {
      editor.setCurrentTool('text');
    } else if (toolId === 'note') {
      editor.setCurrentTool('note');
    } else if (toolId === 'draw') {
      editor.setCurrentTool('draw');
    } else {
      editor.setCurrentTool('select');
    }
  }, [editor]);

  // Keyboard listeners for drawing tools
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively typing in an input, textarea, or text editing in tldraw
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable ||
        editor?.getEditingShape()
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'r') {
        selectTool('rectangle');
      } else if (key === 'o') {
        selectTool('ellipse');
      } else if (key === 'd' && !e.metaKey && !e.ctrlKey) {
        selectTool('diamond');
      } else if (key === 'a') {
        selectTool('arrow');
      } else if (key === 'l') {
        selectTool('line');
      } else if (key === 'f') {
        selectTool('frame');
      } else if (key === 't') {
        selectTool('text');
      } else if (key === 'n') {
        selectTool('note');
      } else if (key === 'p') {
        selectTool('draw');
      } else if (key === 'v' || key === 'escape') {
        selectTool('select');
      } else if (key === 'i') {
        setIsInsertModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor, selectTool]);

  // Insert Icon onto canvas
  const handleSelectIcon = (icon: IconItem) => {
    if (!editor) return;

    const center = editor.getViewportPageBounds().center;
    const shapeId = createShapeId();

    editor.createShape({
      id: shapeId,
      type: 'geo',
      x: center.x - 90,
      y: center.y - 40,
      props: {
        geo: 'rectangle',
        w: 180,
        h: 74,
        richText: toRichText(`${icon.name}\n${icon.category.toUpperCase()}`),
        color: icon.category === 'cloud' ? 'orange' : icon.category === 'tech' ? 'blue' : 'black',
        fill: 'semi',
        dash: 'draw',
        size: 's',
      },
    });

    editor.select(shapeId);
  };

  // Compile Eraser DSL to tldraw shapes with Dagre layout
  const handleCompileDsl = (code: string) => {
    if (!editor) return;

    try {
      const parsed = parseEraserDsl(code);
      const layouted = layoutGraphWithDagre(parsed.nodes, parsed.edges, parsed.direction);
      const center = editor.getViewportPageBounds().center;

      const shapesToCreate: any[] = [];
      const nodeShapeIdMap = new Map<string, any>();

      layouted.nodes.forEach((node) => {
        const id = createShapeId();
        nodeShapeIdMap.set(node.id, id);

        shapesToCreate.push({
          id,
          type: 'geo',
          x: center.x + node.position.x - 300,
          y: center.y + node.position.y - 200,
          props: {
            geo: 'rectangle',
            w: node.type === 'group' ? 420 : 180,
            h: node.type === 'group' ? 240 : 74,
            richText: toRichText((node.data as any)?.label || 'Node'),
            color: node.type === 'group' ? 'light-blue' : 'black',
            fill: node.type === 'group' ? 'none' : 'semi',
            dash: node.type === 'group' ? 'dashed' : 'draw',
            size: 's',
          },
        });
      });

      layouted.edges.forEach((edge) => {
        const sourceShapeId = nodeShapeIdMap.get(edge.source);
        const targetShapeId = nodeShapeIdMap.get(edge.target);

        if (sourceShapeId && targetShapeId) {
          const arrowId = createShapeId();
          shapesToCreate.push({
            id: arrowId,
            type: 'arrow',
            props: {
              richText: toRichText(typeof edge.label === 'string' ? edge.label : ''),
              color: 'blue',
            },
          });
        }
      });

      if (shapesToCreate.length > 0) {
        editor.createShapes(shapesToCreate);
        editor.zoomToFit();
      }
    } catch (err) {
      console.error('Failed to compile DSL to tldraw:', err);
    }
  };

  return (
    <div className="relative w-screen h-screen flex flex-col overflow-hidden bg-[#FBFBFB] select-none">
      {/* Top Navigation Bar (Eraser Style) */}
      <header className="h-14 border-b border-slate-200/90 bg-white/95 backdrop-blur-md px-4 flex items-center justify-between z-30 shadow-2xs">
        {/* Brand & Editable Title */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="flex items-center">
              <span className="w-3 h-5 bg-[#E11D48] rounded-xs -skew-x-12 inline-block"></span>
              <span className="w-3 h-5 bg-[#0284C7] rounded-xs -skew-x-12 -ml-1 inline-block"></span>
            </div>
            <span className="font-bold text-[17px] tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              tharun-flow
            </span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Inline Editable Title */}
          {isEditingTitle ? (
            <input
              type="text"
              value={title}
              autoFocus
              onChange={e => setTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={e => e.key === 'Enter' && setIsEditingTitle(false)}
              className="text-sm font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-blue-400 outline-none w-56"
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="text-sm font-semibold text-slate-800 hover:bg-slate-100/80 px-2 py-1 rounded transition-colors truncate max-w-[240px]"
              title="Click to rename diagram"
            >
              {title}
            </button>
          )}

          {/* Current Page Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-100/90 text-slate-700 text-xs font-medium border border-slate-200">
            <span className="text-slate-400 font-normal">Page:</span>
            <span className="font-semibold text-slate-900">{currentPageName}</span>
          </div>

          {/* Autosave Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border bg-slate-50 border-slate-200">
            {saveStatus === 'saved' ? (
              <>
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span className="text-slate-600 font-medium">Saved to browser</span>
              </>
            ) : (
              <>
                <Loader2 size={12} className="text-amber-500 animate-spin" />
                <span className="text-amber-600">Saving...</span>
              </>
            )}
          </div>
        </div>

        {/* Center: Undo/Redo & Fit Screen */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg border border-slate-200/60">
          <button
            onClick={() => editor?.undo()}
            className="p-1.5 rounded hover:bg-white text-slate-600 transition-all"
            title="Undo (⌘Z)"
          >
            <Undo2 size={15} />
          </button>
          <button
            onClick={() => editor?.redo()}
            className="p-1.5 rounded hover:bg-white text-slate-600 transition-all"
            title="Redo (⌘⇧Z)"
          >
            <Redo2 size={15} />
          </button>
          <div className="h-3 w-px bg-slate-300 mx-1" />
          <button
            onClick={() => editor?.zoomToFit({ animation: { duration: 300 } })}
            className="px-2 py-1 rounded hover:bg-white text-[12px] font-medium text-slate-700 flex items-center gap-1 transition-all"
            title="Fit to Screen"
          >
            <Maximize2 size={13} />
            <span>Fit</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Diagram-as-Code Toggle */}
          <button
            onClick={() => setIsDslOpen(!isDslOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isDslOpen
                ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Code2 size={14} className={isDslOpen ? 'text-blue-600' : 'text-slate-500'} />
            <span className="hidden sm:inline">Diagram-as-Code</span>
          </button>

          {/* Export Button */}
          <button
            onClick={async () => {
              if (!editor) return;
              try {
                const shapeIds = Array.from(editor.getCurrentPageShapeIds());
                if (shapeIds.length === 0) {
                  alert('Canvas is empty. Draw or add some shapes first.');
                  return;
                }
                await exportAs(editor, shapeIds, {
                  format: 'png',
                  name: title.toLowerCase().replace(/\s+/g, '-'),
                });
              } catch (err) {
                console.error('Export error:', err);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition-all"
          >
            <Download size={14} />
            <span>Export PNG</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm"
          >
            <Share2 size={14} />
            <span>Share</span>
          </button>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <div className="relative flex-1 w-full h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* Floating Tool Rail (Exact Eraser Tools + Shortcuts) - Positioned below undo/redo toolbar with zero overlap */}
        <aside className="absolute left-4 top-[72px] sm:top-1/2 sm:-translate-y-1/2 z-20 flex flex-col gap-1 p-1.5 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xl select-none max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-none">
          {/* Select Tool (V) */}
          <button
            onClick={() => selectTool('select')}
            className={`p-2 rounded-xl transition-all ${
              activeTool === 'select'
                ? 'bg-blue-50 text-blue-600 shadow-2xs font-bold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Select (V)"
          >
            <MousePointer2 size={18} />
          </button>

          {/* Tech & General Icon Insert (I) -> Opens user's exact screenshot panel! */}
          <button
            onClick={() => setIsInsertModalOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all relative group"
            title="Insert Item / Tech Icon (I)"
          >
            <Cpu size={18} className="group-hover:text-blue-600 transition-colors" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
          </button>

          <div className="h-px bg-slate-200 my-0.5" />

          {/* Rectangle (R) -> Drag to draw rectangle */}
          <button
            onClick={() => selectTool('rectangle')}
            className={`p-2 rounded-xl transition-all ${
              activeTool === 'geo'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Rectangle (R) - Click & drag to draw"
          >
            <Square size={18} />
          </button>

          {/* Diamond (D) -> Drag to draw decision */}
          <button
            onClick={() => selectTool('diamond')}
            className={`p-2 rounded-xl transition-all ${
              activeTool === 'rhombus' || activeTool === 'diamond'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Diamond / Decision (D) - Click & drag to draw"
          >
            <Diamond size={18} />
          </button>

          {/* Ellipse (O) -> Drag to draw circle */}
          <button
            onClick={() => selectTool('ellipse')}
            className={`p-2 rounded-xl transition-all ${
              activeTool === 'ellipse'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Ellipse / Oval (O) - Click & drag to draw"
          >
            <Circle size={18} />
          </button>

          {/* Arrow / Connector (A) -> Drag to connect */}
          <button
            onClick={() => selectTool('arrow')}
            className={`p-2 rounded-xl transition-all ${
              activeTool === 'arrow'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Arrow Connector (A) - Drag to connect shapes"
          >
            <ArrowUpRight size={18} />
          </button>

          {/* Line (L) */}
          <button
            onClick={() => selectTool('line')}
            className={`p-2 rounded-xl transition-all ${
              activeTool === 'line'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Line (L)"
          >
            <Minus size={18} />
          </button>

          {/* Frame / Group Container (F) */}
          <button
            onClick={() => selectTool('frame')}
            className={`p-2 rounded-xl transition-all ${
              activeTool === 'frame'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Frame / Group Container (F)"
          >
            <Frame size={18} />
          </button>

          {/* Text Tool (T) */}
          <button
            onClick={() => selectTool('text')}
            className={`p-2 rounded-xl transition-all ${
              activeTool === 'text'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Text Tool (T) - Click anywhere to type"
          >
            <Type size={18} />
          </button>

          {/* Sticky Note (N) */}
          <button
            onClick={() => selectTool('note')}
            className={`p-2 rounded-xl transition-all ${
              activeTool === 'note'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Sticky Note (N)"
          >
            <StickyNote size={18} />
          </button>

          {/* Freehand Pencil (P) */}
          <button
            onClick={() => selectTool('draw')}
            className={`p-2 rounded-xl transition-all ${
              activeTool === 'draw'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Freehand Draw (P)"
          >
            <Pencil size={18} />
          </button>
        </aside>

        {/* Modals */}
        <EraserInsertItemModal
          isOpen={isInsertModalOpen}
          onClose={() => setIsInsertModalOpen(false)}
          onSelectIcon={handleSelectIcon}
        />

        {/* Diagram-as-Code Slide-over Panel */}
        {isDslOpen && (
          <div className="absolute right-0 top-0 bottom-0 w-96 md:w-[460px] bg-white border-l border-slate-200/90 shadow-2xl z-40 flex flex-col select-none animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Code2 size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Diagram-as-Code</h2>
                  <p className="text-[11px] text-slate-500">Compile Eraser DSL directly to canvas</p>
                </div>
              </div>
              <button
                onClick={() => setIsDslOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-3 flex flex-col min-h-0 bg-[#0F172A]">
              <textarea
                defaultValue={`direction right\n\nClient [icon: react, label: "React Client"] > Gateway: "HTTPS"\nGateway [icon: cloudflare, label: "Cloudflare CDN"] > API: "Proxy"\nAPI [icon: nodejs, label: "API Gateway"] > Database: "Queries"\nDatabase [icon: postgresql, label: "PostgreSQL DB"]`}
                id="dsl-editor-area"
                className="w-full flex-1 bg-transparent text-emerald-400 font-mono text-xs leading-relaxed outline-none resize-none p-2"
                spellCheck={false}
              />
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Supports: &gt;, &lt;, [icon: ...]</span>
              <button
                onClick={() => {
                  const area = document.getElementById('dsl-editor-area') as HTMLTextAreaElement;
                  if (area) {
                    handleCompileDsl(area.value);
                    setIsDslOpen(false);
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                Compile to Canvas
              </button>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-5 max-w-sm w-full border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Share Diagram Link</h3>
              <p className="text-xs text-slate-500 mb-3">Anyone with this link can open and edit this diagram.</p>
              <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl mb-4">
                <input
                  readOnly
                  value={typeof window !== 'undefined' ? window.location.href : ''}
                  className="bg-transparent text-xs text-slate-700 font-mono w-full outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Copied link to clipboard!');
                    setIsShareModalOpen(false);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg"
                >
                  Copy
                </button>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="w-full py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Eraser-style Multi-Page Management Dock */}
        <PageBar
          editor={editor}
          onSaveNotification={handleSaveNotification}
        />

        {/* Tldraw Infinite Canvas Engine (IndexedDB Persistence + Draw-to-create + Inline Text) */}
        <div className="w-full h-full">
          <Tldraw
            persistenceKey={`eraser_diagram_${diagramId}`}
            onMount={(mountedEditor) => {
              setEditor(mountedEditor);

              // Initialize default architecture layout only once for a brand-new diagram
              const initKey = `eraser_init_${diagramId}`;
              const hasInitialized = typeof window !== 'undefined' && localStorage.getItem(initKey);
              const hasShapes = Array.from(mountedEditor.store.allRecords()).some(r => r.typeName === 'shape');

              if (!hasInitialized && !hasShapes && mountedEditor.getCurrentPageShapeIds().size === 0) {
                if (typeof window !== 'undefined') {
                  localStorage.setItem(initKey, 'true');
                }
                const center = mountedEditor.getViewportPageBounds().center;

                // Frame (VPC boundary)
                const frameId = createShapeId();
                mountedEditor.createShape({
                  id: frameId,
                  type: 'frame',
                  x: center.x - 220,
                  y: center.y - 180,
                  props: {
                    w: 620,
                    h: 360,
                    name: 'Primary VPC (us-east-1)',
                  },
                });

                // Nodes with editable text
                const clientNode = createShapeId();
                mountedEditor.createShape({
                  id: clientNode,
                  type: 'geo',
                  x: center.x - 420,
                  y: center.y - 40,
                  props: {
                    geo: 'rectangle',
                    w: 160,
                    h: 70,
                    richText: toRichText('Client Browser\nReact SPA'),
                    color: 'blue',
                    fill: 'semi',
                    size: 's',
                  },
                });

                const cfNode = createShapeId();
                mountedEditor.createShape({
                  id: cfNode,
                  type: 'geo',
                  x: center.x - 180,
                  y: center.y - 40,
                  props: {
                    geo: 'rectangle',
                    w: 160,
                    h: 70,
                    richText: toRichText('Cloudflare\nCDN & Proxy'),
                    color: 'orange',
                    fill: 'semi',
                    size: 's',
                  },
                });

                const apiNode = createShapeId();
                mountedEditor.createShape({
                  id: apiNode,
                  type: 'geo',
                  x: center.x + 60,
                  y: center.y - 100,
                  props: {
                    geo: 'rectangle',
                    w: 160,
                    h: 70,
                    richText: toRichText('API Gateway\nNode.js Express'),
                    color: 'green',
                    fill: 'semi',
                    size: 's',
                  },
                });

                const dbNode = createShapeId();
                mountedEditor.createShape({
                  id: dbNode,
                  type: 'geo',
                  x: center.x + 60,
                  y: center.y + 40,
                  props: {
                    geo: 'rectangle',
                    w: 160,
                    h: 70,
                    richText: toRichText('Database\nPostgreSQL'),
                    color: 'blue',
                    fill: 'semi',
                    size: 's',
                  },
                });

                // Zoom to fit all initial shapes
                setTimeout(() => mountedEditor.zoomToFit(), 100);
              }
            }}
            components={{
              Toolbar: null,
              NavigationPanel: null,
              MainMenu: null,
              PageMenu: null,
            }}
          />
        </div>
      </div>
    </div>
  );
}
