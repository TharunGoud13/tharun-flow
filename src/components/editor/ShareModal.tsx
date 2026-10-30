'use client';

import React, { useState } from 'react';
import { useDiagramStore } from '@/lib/store/diagramStore';
import { X, Copy, Check, Globe, Link2, ShieldCheck } from 'lucide-react';

export function ShareModal() {
  const { isShareModalOpen, setIsShareModalOpen, currentDiagram } = useDiagramStore();
  const [copied, setCopied] = useState(false);

  if (!isShareModalOpen) return null;

  const diagramId = currentDiagram?.id || '';
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/d/${diagramId}`
    : `https://app.eraser-canvas.local/d/${diagramId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Globe size={18} />
            </div>
            <h2 className="text-base font-bold text-slate-900">Share Diagram</h2>
          </div>
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Anyone with this unique link can view and edit this diagram. The link contains a cryptographically safe unguessable ID.
          </p>

          <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-xl">
            <Link2 size={16} className="text-slate-400 ml-2 flex-shrink-0" />
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="bg-transparent text-xs text-slate-800 font-mono w-full outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all flex-shrink-0 shadow-2xs"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>

          <div className="flex items-start gap-2 p-3 bg-blue-50/60 border border-blue-200/60 rounded-xl text-[11px] text-blue-800">
            <ShieldCheck size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <span>
              Changes you make are stored persistently in IndexedDB and sync automatically to the diagram document.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

