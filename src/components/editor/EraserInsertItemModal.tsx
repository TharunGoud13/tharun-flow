'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ALL_ICONS, GENERAL_ICONS, TECH_LOGO_ICONS, CLOUD_PROVIDER_ICONS, IconItem 
} from '@/lib/icons/iconRegistry';
import { 
  Search, X, Upload, Smile, Zap, Cloud, ChevronRight, CornerDownLeft, ArrowUpDown 
} from 'lucide-react';

interface InsertItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIcon: (icon: IconItem) => void;
}

export function EraserInsertItemModal({
  isOpen,
  onClose,
  onSelectIcon,
}: InsertItemModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'custom' | 'general' | 'tech' | 'cloud'>('all');
  const [customIcons, setCustomIcons] = useState<IconItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter icons based on category and search query
  const filteredIcons = useMemo(() => {
    let list: IconItem[] = [];
    if (activeCategory === 'all') {
      list = [...customIcons, ...ALL_ICONS];
    } else if (activeCategory === 'custom') {
      list = customIcons;
    } else if (activeCategory === 'general') {
      list = GENERAL_ICONS;
    } else if (activeCategory === 'tech') {
      list = TECH_LOGO_ICONS;
    } else if (activeCategory === 'cloud') {
      list = CLOUD_PROVIDER_ICONS;
    }

    const q = searchQuery.toLowerCase().trim();
    if (!q) return list;

    return list.filter(item => 
      item.name.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [searchQuery, activeCategory, customIcons]);

  // Keyboard navigation: Arrow keys & Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 5, filteredIcons.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 5, 0));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredIcons.length - 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredIcons[selectedIndex]) {
          onSelectIcon(filteredIcons[selectedIndex]);
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredIcons, selectedIndex, onSelectIcon, onClose]);

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const newIcon: IconItem = {
        id: `custom-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        category: 'custom',
        tags: ['custom', file.name.toLowerCase()],
        render: ({ className = 'w-6 h-6', size = 24 }) => (
          <img src={src} alt="custom" style={{ width: size, height: size, objectFit: 'contain' }} className={className} />
        ),
      };
      setCustomIcons(prev => [newIcon, ...prev]);
      setActiveCategory('custom');
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md flex flex-col overflow-hidden max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Top Search Input (matches Eraser: Q Insert item) */}
        <div className="p-3 border-b border-slate-100 flex items-center gap-2.5">
          <Search size={18} className="text-slate-500 ml-1" />
          <input
            type="text"
            placeholder="Insert item"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            autoFocus
            className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <X size={14} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded ml-1"
          >
            <X size={16} />
          </button>
        </div>

        {/* Breadcrumb Header */}
        <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-500">
            <span>All Categories</span>
            <span className="mx-1 text-slate-300">/</span>
            <span className="text-slate-900 capitalize">
              {activeCategory === 'all' ? 'Icon' : `${activeCategory} Icon`}
            </span>
          </div>
          {activeCategory !== 'all' && (
            <button
              onClick={() => setActiveCategory('all')}
              className="text-[11px] font-semibold text-blue-600 hover:underline"
            >
              Show all
            </button>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="p-3.5 overflow-y-auto flex-1 flex flex-col gap-3">
          {/* 4 Category Cards (matches user's screenshot exactly!) */}
          {!searchQuery && activeCategory === 'all' && (
            <div className="flex flex-col gap-2">
              {/* Card 1: Custom Icons */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/90 hover:border-blue-400 hover:bg-slate-50/80 cursor-pointer transition-all group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 group-hover:text-blue-600 transition-colors">
                    <Upload size={17} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Custom Icons</h4>
                    <p className="text-[11px] text-slate-500">Your team's custom icons</p>
                  </div>
                </div>
                <ChevronRight size={15} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/svg+xml,image/jpeg"
                  className="hidden"
                  onChange={handleCustomUpload}
                />
              </div>

              {/* Card 2: General Icon */}
              <div
                onClick={() => setActiveCategory('general')}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/90 hover:border-blue-400 hover:bg-slate-50/80 cursor-pointer transition-all group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 group-hover:text-blue-600 transition-colors">
                    <Smile size={17} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">General Icon</h4>
                    <p className="text-[11px] text-slate-500">250+ icons available</p>
                  </div>
                </div>
                <ChevronRight size={15} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
              </div>

              {/* Card 3: Tech Logo */}
              <div
                onClick={() => setActiveCategory('tech')}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/90 hover:border-blue-400 hover:bg-slate-50/80 cursor-pointer transition-all group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 group-hover:text-blue-600 transition-colors">
                    <Zap size={17} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Tech Logo</h4>
                    <p className="text-[11px] text-slate-500">Popular tools and libraries</p>
                  </div>
                </div>
                <ChevronRight size={15} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
              </div>

              {/* Card 4: Cloud Provider Icon */}
              <div
                onClick={() => setActiveCategory('cloud')}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/90 hover:border-blue-400 hover:bg-slate-50/80 cursor-pointer transition-all group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 group-hover:text-blue-600 transition-colors">
                    <Cloud size={17} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Cloud Provider Icon</h4>
                    <p className="text-[11px] text-slate-500">AWS, Azure, and Google Cloud</p>
                  </div>
                </div>
                <ChevronRight size={15} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
              </div>
            </div>
          )}

          {/* Grid of Icons (matches preview boxes with labels!) */}
          <div className="grid grid-cols-5 gap-2.5">
            {filteredIcons.map((icon, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={icon.id}
                  onClick={() => {
                    onSelectIcon(icon);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-center aspect-square ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs'
                  }`}
                  title={icon.name}
                >
                  <div className="w-7 h-7 flex items-center justify-center text-slate-700">
                    {icon.render ? icon.render({ size: 20 }) : null}
                  </div>
                  <span className="text-[9px] font-medium text-slate-500 mt-1 truncate max-w-full block leading-tight">
                    {icon.name}
                  </span>
                </button>
              );
            })}

            {filteredIcons.length === 0 && (
              <div className="col-span-5 py-8 text-center text-slate-400 text-xs">
                No icons found for "{searchQuery}".
              </div>
            )}
          </div>
        </div>

        {/* Footer (matches user's screenshot: ↑ ↓ to navigate enter to insert) */}
        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-[11px] text-slate-500">
          <span className="font-semibold text-slate-700">
            {filteredIcons.length} icons
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <ArrowUpDown size={12} className="text-slate-400" />
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <CornerDownLeft size={11} className="text-slate-400" />
              <span>enter to insert</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

