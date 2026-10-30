'use client';

import React, { useEffect, useState } from 'react';
import { useDiagramStore } from '@/lib/store/diagramStore';
import { listDiagramsFromIDB, deleteDiagramFromIDB, generateDiagramId, createDefaultDiagram, saveDiagramToIDB } from '@/lib/storage/idbStorage';
import { X, Plus, Trash2, Copy, FileText, ArrowRight, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function RecentDiagramsModal() {
  const { isRecentModalOpen, setIsRecentModalOpen, currentDiagram, initDiagram } = useDiagramStore();
  const [diagrams, setDiagrams] = useState<Array<{ id: string; title: string; updatedAt: string; elementCount: number }>>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadList = async () => {
    setLoading(true);
    try {
      const list = await listDiagramsFromIDB();
      setDiagrams(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isRecentModalOpen) {
      loadList();
    }
  }, [isRecentModalOpen]);

  if (!isRecentModalOpen) return null;

  const handleCreateNew = async () => {
    const newId = generateDiagramId();
    const newDoc = createDefaultDiagram(newId, 'Untitled Diagram');
    await saveDiagramToIDB(newDoc);
    await initDiagram(newId);
    setIsRecentModalOpen(false);
    router.push(`/d/${newId}`);
  };

  const handleOpenDiagram = async (id: string) => {
    await initDiagram(id);
    setIsRecentModalOpen(false);
    router.push(`/d/${id}`);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this diagram?')) {
      await deleteDiagramFromIDB(id);
      loadList();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <FileText size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Diagrams</h2>
              <p className="text-xs text-slate-500">Persistent storage in IndexedDB</p>
            </div>
          </div>

          <button
            onClick={() => setIsRecentModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Button */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={handleCreateNew}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            <span>Create New Diagram</span>
          </button>
        </div>

        {/* List of Diagrams */}
        <div className="p-4 overflow-y-auto flex flex-col gap-2 max-h-[400px]">
          {diagrams.map(diag => {
            const isCurrent = diag.id === currentDiagram?.id;
            return (
              <div
                key={diag.id}
                onClick={() => handleOpenDiagram(diag.id)}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer group ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-50/30'
                    : 'border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {diag.title}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {new Date(diag.updatedAt).toLocaleDateString()} {new Date(diag.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>•</span>
                    <span>{diag.elementCount} elements</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleDelete(e, diag.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete diagram"
                  >
                    <Trash2 size={14} />
                  </button>
                  <ArrowRight size={15} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            );
          })}

          {diagrams.length === 0 && !loading && (
            <div className="py-8 text-center text-slate-400 text-xs">
              No saved diagrams yet. Create your first diagram above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

