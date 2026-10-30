'use client';

import React, { useState } from 'react';
import { useDiagramStore } from '@/lib/store/diagramStore';
import { 
  Palette, Copy, Trash2, Edit3, 
  Minus, MoreHorizontal, Layers 
} from 'lucide-react';
import { DiagramElementData, StrokeStyle } from '@/types/diagram';

const COLOR_PALETTE = [
  { name: 'White', color: '#FFFFFF', border: '#E2E8F0' },
  { name: 'Slate', color: '#F8FAFC', border: '#94A3B8' },
  { name: 'Blue', color: '#EFF6FF', border: '#3B82F6' },
  { name: 'Green', color: '#ECFDF5', border: '#10B981' },
  { name: 'Amber', color: '#FFFBEB', border: '#F59E0B' },
  { name: 'Rose', color: '#FFF1F2', border: '#F43F5E' },
  { name: 'Purple', color: '#FAF5FF', border: '#A855F7' },
  { name: 'Cyan', color: '#ECFEFF', border: '#06B6D4' },
];

export function ContextToolbar() {
  const {
    selectedNodes,
    selectedEdges,
    updateSelectedElementData,
    duplicateSelected,
    deleteSelected,
    setIsIconModalOpen,
  } = useDiagramStore();

  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const activeNode = selectedNodes[0];
  const activeEdge = selectedEdges[0];

  if (!activeNode && !activeEdge) {
    return null;
  }

  const nodeData = (activeNode?.data || {}) as DiagramElementData;
  const isArchitectureNode = activeNode?.type === 'architecture';

  const handleColorChange = (fill: string, border: string) => {
    updateSelectedElementData({
      fillColor: fill,
      strokeColor: border,
    });
    setIsColorMenuOpen(false);
  };

  const handleLineStyleChange = (style: StrokeStyle) => {
    updateSelectedElementData({ strokeStyle: style });
  };

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl shadow-xl select-none animate-in fade-in duration-150">
      {/* Quick Label Edit */}
      {activeNode && (
        <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-800">
          <Edit3 size={13} className="text-slate-500" />
          <input
            type="text"
            value={nodeData.label || ''}
            onChange={e => updateSelectedElementData({ label: e.target.value })}
            placeholder="Label..."
            className="bg-transparent border-none outline-none w-28 text-xs font-semibold text-slate-800"
          />
        </div>
      )}

      {/* For Tech Nodes: Subtitle */}
      {isArchitectureNode && (
        <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-800">
          <input
            type="text"
            value={nodeData.subtitle || ''}
            onChange={e => updateSelectedElementData({ subtitle: e.target.value })}
            placeholder="Subtitle..."
            className="bg-transparent border-none outline-none w-24 text-[11px] text-slate-600"
          />
        </div>
      )}

      {/* Change Icon for Architecture Node */}
      {isArchitectureNode && (
        <button
          onClick={() => setIsIconModalOpen(true)}
          className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          title="Change Technology Icon"
        >
          Icon
        </button>
      )}

      {/* Color Palette Picker */}
      <div className="relative">
        <button
          onClick={() => setIsColorMenuOpen(!isColorMenuOpen)}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
          title="Color Theme"
        >
          <Palette size={16} />
        </button>

        {isColorMenuOpen && (
          <div className="absolute top-full left-0 mt-2 p-2 bg-white border border-slate-200 rounded-xl shadow-xl grid grid-cols-4 gap-1.5 w-44 z-30 animate-in fade-in zoom-in-95 duration-100">
            {COLOR_PALETTE.map(item => (
              <button
                key={item.name}
                onClick={() => handleColorChange(item.color, item.border)}
                className="w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110 flex items-center justify-center shadow-2xs"
                style={{ backgroundColor: item.color, borderColor: item.border }}
                title={item.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Stroke Style: Solid vs Dashed */}
      <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
        <button
          onClick={() => handleLineStyleChange('solid')}
          className={`px-2 py-1 text-[11px] font-semibold rounded ${
            nodeData.strokeStyle === 'solid' || !nodeData.strokeStyle
              ? 'bg-white shadow-2xs text-slate-900'
              : 'text-slate-500 hover:text-slate-900'
          }`}
          title="Solid Line"
        >
          Solid
        </button>
        <button
          onClick={() => handleLineStyleChange('dashed')}
          className={`px-2 py-1 text-[11px] font-semibold rounded ${
            nodeData.strokeStyle === 'dashed'
              ? 'bg-white shadow-2xs text-slate-900'
              : 'text-slate-500 hover:text-slate-900'
          }`}
          title="Dashed Line"
        >
          Dash
        </button>
      </div>

      <div className="h-4 w-px bg-slate-200 mx-1" />

      {/* Duplicate */}
      <button
        onClick={duplicateSelected}
        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
        title="Duplicate (⌘D)"
      >
        <Copy size={16} />
      </button>

      {/* Delete */}
      <button
        onClick={deleteSelected}
        className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
        title="Delete (Del / Backspace)"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

