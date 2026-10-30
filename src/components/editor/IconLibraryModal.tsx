'use client';

import React, { useState, useMemo } from 'react';
import { useDiagramStore } from '@/lib/store/diagramStore';
import { TECH_ICONS, TechIconDef } from '@/lib/icons/techIcons';
import { DiagramElementData } from '@/types/diagram';
import { Search, X, Layers, Sparkles } from 'lucide-react';

export function IconLibraryModal() {
  const {
    isIconModalOpen,
    setIsIconModalOpen,
    addNode,
    selectedNodes,
    updateSelectedElementData,
  } = useDiagramStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Tech' },
    { id: 'cloud', label: 'Cloud' },
    { id: 'database', label: 'Databases' },
    { id: 'devops', label: 'DevOps & Containers' },
    { id: 'backend', label: 'Backend' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'networking', label: 'Networking & Security' },
  ];

  const filteredIcons = useMemo(() => {
    return TECH_ICONS.filter(icon => {
      const matchesCategory =
        selectedCategory === 'all' ||
        icon.category === selectedCategory ||
        (selectedCategory === 'networking' && (icon.category === 'networking' || icon.category === 'security'));

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        icon.name.toLowerCase().includes(q) ||
        icon.id.toLowerCase().includes(q) ||
        icon.tags.some(t => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  if (!isIconModalOpen) return null;

  const handleSelectIcon = (icon: TechIconDef) => {
    // If a node is currently selected, update its icon!
    if (selectedNodes.length > 0 && selectedNodes[0].type === 'architecture') {
      const activeData = selectedNodes[0].data as DiagramElementData;
      updateSelectedElementData({
        icon: icon.id,
        label: activeData.label || icon.name,
      });
    } else {
      // Otherwise, add a new tech architecture node to canvas
      addNode('architecture', {
        label: icon.name,
        subtitle: icon.category.toUpperCase(),
        icon: icon.id,
      });
    }
    setIsIconModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Layers size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Architecture Icon Palette
              </h2>
              <p className="text-xs text-slate-500">
                {selectedNodes.length > 0 && selectedNodes[0].type === 'architecture'
                  ? 'Select an icon to replace on current node'
                  : 'Click to add an architecture component to canvas'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsIconModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search icons (e.g. AWS, Postgres, Kafka, Docker, React, Redis)..."
              value={searchQuery}
              autoFocus
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Icons Grid */}
        <div className="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[420px]">
          {filteredIcons.map(icon => (
            <button
              key={icon.id}
              onClick={() => handleSelectIcon(icon)}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/80 hover:border-blue-500 hover:bg-blue-50/30 transition-all text-left group shadow-2xs"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center p-2 group-hover:scale-105 transition-transform flex-shrink-0">
                {icon.render({ size: 24 })}
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                  {icon.name}
                </span>
                <span className="block text-[10px] text-slate-400 capitalize truncate">
                  {icon.category}
                </span>
              </div>
            </button>
          ))}

          {filteredIcons.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 text-sm">
              No matching tech icons found for "{searchQuery}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
