'use client';

import React, { useEffect, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { useDiagramStore } from '@/lib/store/diagramStore';
import { EditorHeader } from '@/components/editor/EditorHeader';
import { Canvas } from '@/components/editor/Canvas';
import { Loader2 } from 'lucide-react';

interface EditorProps {
  diagramId?: string;
}

export function Editor({ diagramId }: EditorProps) {
  const { initDiagram, currentDiagram } = useDiagramStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;
    initDiagram(diagramId).then(() => {
      if (mounted) setIsInitializing(false);
    });
    return () => {
      mounted = false;
    };
  }, [diagramId, initDiagram]);

  if (isInitializing) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-3 select-none">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-3.5 h-6 bg-[#E11D48] rounded-xs -skew-x-12 inline-block"></span>
          <span className="w-3.5 h-6 bg-[#0284C7] rounded-xs -skew-x-12 -ml-1 inline-block"></span>
          <span className="font-bold text-2xl tracking-tight text-white ml-1">tharun-flow</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
          <Loader2 size={14} className="animate-spin text-blue-500" />
          <span>Restoring diagram from IndexedDB...</span>
        </div>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-50">
        <EditorHeader />
        <Canvas />
      </div>
    </ReactFlowProvider>
  );
}

