'use client';

import React, { useState } from 'react';
import { useDiagramStore } from '@/lib/store/diagramStore';
import { 
  Undo2, Redo2, Download, Share2, Code2, 
  CheckCircle2, Loader2, AlertCircle, FolderOpen, 
  Sparkles, Maximize2 
} from 'lucide-react';
import { useReactFlow } from '@xyflow/react';

export function EditorHeader() {
  const {
    currentDiagram,
    setDiagramTitle,
    saveStatus,
    undo,
    redo,
    undoStack,
    redoStack,
    isDslOpen,
    setIsDslOpen,
    setIsExportModalOpen,
    setIsShareModalOpen,
    setIsRecentModalOpen,
  } = useDiagramStore();

  const { fitView, zoomIn, zoomOut } = useReactFlow();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(currentDiagram?.title || 'System Architecture');

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim()) {
      setDiagramTitle(titleInput.trim());
    }
  };

  return (
    <header className="h-14 border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-4 flex items-center justify-between z-20 select-none shadow-2xs">
      {/* Left: Brand & Title & Status */}
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Eraser-inspired brand logo mark */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setIsRecentModalOpen(true)}>
          <div className="flex items-center">
            <span className="w-3 h-5 bg-[#E11D48] rounded-xs -skew-x-12 inline-block"></span>
            <span className="w-3 h-5 bg-[#0284C7] rounded-xs -skew-x-12 -ml-1 inline-block"></span>
          </div>
          <span className="font-bold text-[17px] tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            tharun-flow
          </span>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        {/* Editable Title */}
        <div className="flex items-center gap-2 min-w-0">
          {isEditingTitle ? (
            <input
              type="text"
              value={titleInput}
              autoFocus
              onChange={e => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={e => e.key === 'Enter' && handleTitleSubmit()}
              className="text-sm font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-blue-400 outline-none w-56"
            />
          ) : (
            <button
              onClick={() => {
                setTitleInput(currentDiagram?.title || 'System Architecture');
                setIsEditingTitle(true);
              }}
              className="text-sm font-semibold text-slate-800 hover:bg-slate-100/80 px-2 py-1 rounded transition-colors truncate max-w-[240px]"
              title="Click to rename diagram"
            >
              {currentDiagram?.title || 'System Architecture'}
            </button>
          )}

          {/* Autosave Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border">
            {saveStatus === 'saved' && (
              <>
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span className="text-slate-500">Saved to browser</span>
              </>
            )}
            {saveStatus === 'saving' && (
              <>
                <Loader2 size={12} className="text-amber-500 animate-spin" />
                <span className="text-amber-600">Saving...</span>
              </>
            )}
            {saveStatus === 'failed' && (
              <>
                <AlertCircle size={12} className="text-rose-500" />
                <span className="text-rose-600">Save failed</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Center: Undo/Redo & View Navigation */}
      <div className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg border border-slate-200/60">
        <button
          onClick={undo}
          disabled={undoStack.length === 0}
          className="p-1.5 rounded hover:bg-white text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="Undo (⌘Z)"
        >
          <Undo2 size={15} />
        </button>
        <button
          onClick={redo}
          disabled={redoStack.length === 0}
          className="p-1.5 rounded hover:bg-white text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="Redo (⌘⇧Z)"
        >
          <Redo2 size={15} />
        </button>

        <div className="h-3 w-px bg-slate-300 mx-1" />

        <button
          onClick={() => fitView({ duration: 400 })}
          className="px-2 py-1 rounded hover:bg-white text-[12px] font-medium text-slate-700 flex items-center gap-1 transition-all"
          title="Fit diagram to screen"
        >
          <Maximize2 size={13} />
          <span>Fit</span>
        </button>
      </div>

      {/* Right: Actions (Diagram-as-Code, Recent, Export, Share) */}
      <div className="flex items-center gap-2">
        {/* Toggle Diagram-as-Code */}
        <button
          onClick={() => setIsDslOpen(!isDslOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isDslOpen
              ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-2xs'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
          title="Toggle Diagram-as-Code (DSL)"
        >
          <Code2 size={14} className={isDslOpen ? 'text-blue-600' : 'text-slate-500'} />
          <span className="hidden sm:inline">Diagram-as-Code</span>
        </button>

        {/* Recent Diagrams Drawer Button */}
        <button
          onClick={() => setIsRecentModalOpen(true)}
          className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          title="Browse Saved Diagrams"
        >
          <FolderOpen size={16} />
        </button>

        {/* Export Button */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs"
        >
          <Download size={14} />
          <span>Export</span>
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
  );
}

