'use client';

import React, { useState } from 'react';
import { useDiagramStore, EditorTool } from '@/lib/store/diagramStore';
import {
  MousePointer2,
  Square,
  ArrowUpRight,
  Type,
  Cpu,
  Layers,
  Circle,
  Diamond,
  Database,
  Cloud,
  ChevronRight,
} from 'lucide-react';
import { NodeShape } from '@/types/diagram';

export function ToolRail() {
  const {
    activeTool,
    setActiveTool,
    addNode,
    setIsIconModalOpen,
  } = useDiagramStore();

  const [isShapeMenuOpen, setIsShapeMenuOpen] = useState(false);

  const handleShapeSelect = (shape: NodeShape, label: string) => {
    addNode('shape', { shape, label });
    setIsShapeMenuOpen(false);
  };

  return (
    <aside className="absolute left-4 top-20 z-10 flex flex-col gap-1.5 p-1.5 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl shadow-lg select-none">
      {/* Select Tool */}
      <button
        onClick={() => setActiveTool('select')}
        className={`p-2.5 rounded-lg transition-all ${
          activeTool === 'select'
            ? 'bg-blue-50 text-blue-600 shadow-2xs font-bold'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
        title="Select (V / Esc)"
      >
        <MousePointer2 size={18} />
      </button>

      {/* Tech Architecture Component */}
      <button
        onClick={() => setIsIconModalOpen(true)}
        className="p-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all group relative"
        title="Add Tech Architecture Node (I)"
      >
        <Cpu size={18} className="group-hover:text-blue-600 transition-colors" />
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
      </button>

      {/* Shape Picker with Flyout */}
      <div className="relative">
        <button
          onClick={() => setIsShapeMenuOpen(!isShapeMenuOpen)}
          className={`p-2.5 rounded-lg transition-all flex items-center justify-between w-full ${
            isShapeMenuOpen || activeTool === 'shape'
              ? 'bg-blue-50 text-blue-600 shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          title="Shapes (R)"
        >
          <Square size={18} />
        </button>

        {/* Shape Flyout Submenu */}
        {isShapeMenuOpen && (
          <div className="absolute left-full top-0 ml-2.5 p-1.5 bg-white border border-slate-200 rounded-xl shadow-xl flex flex-col gap-1 w-44 z-30 animate-in fade-in zoom-in-95 duration-100">
            <button
              onClick={() => handleShapeSelect('rectangle', 'Rectangle')}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-left"
            >
              <Square size={15} className="text-slate-500" />
              <span>Rectangle</span>
            </button>
            <button
              onClick={() => handleShapeSelect('ellipse', 'Process / Ellipse')}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-left"
            >
              <Circle size={15} className="text-slate-500" />
              <span>Ellipse</span>
            </button>
            <button
              onClick={() => handleShapeSelect('diamond', 'Decision')}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-left"
            >
              <Diamond size={15} className="text-slate-500" />
              <span>Diamond</span>
            </button>
            <button
              onClick={() => handleShapeSelect('cylinder', 'Database')}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-left"
            >
              <Database size={15} className="text-slate-500" />
              <span>Database</span>
            </button>
            <button
              onClick={() => handleShapeSelect('cloud', 'Cloud Network')}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-left"
            >
              <Cloud size={15} className="text-slate-500" />
              <span>Cloud</span>
            </button>
          </div>
        )}
      </div>

      {/* Group / Container Boundary */}
      <button
        onClick={() => addNode('group', { label: 'VPC Subnet', badge: 'VPC' })}
        className="p-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
        title="Add Group / Subnet Container (G)"
      >
        <Layers size={18} />
      </button>

      {/* Text Annotation */}
      <button
        onClick={() => addNode('text', { label: 'Architecture Note' })}
        className="p-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
        title="Add Text Label (T)"
      >
        <Type size={18} />
      </button>

      <div className="h-px w-full bg-slate-200 my-0.5" />

      {/* Hint for connection */}
      <div
        className="p-2 text-center text-[10px] text-slate-400 font-semibold cursor-default"
        title="Drag from node handles to create arrows"
      >
        <ArrowUpRight size={16} className="mx-auto text-slate-400" />
      </div>
    </aside>
  );
}

