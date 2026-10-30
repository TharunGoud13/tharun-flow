'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Editor } from 'tldraw';
import { 
  FileText, Plus, MoreHorizontal, Copy, Trash2, 
  Edit3, Check, Layers
} from 'lucide-react';

type TLPage = ReturnType<Editor['getPages']>[number];
type TLPageId = ReturnType<Editor['getCurrentPageId']>;

interface PageBarProps {
  editor: Editor | null;
  onPageChange?: (pageId: TLPageId) => void;
  onSaveNotification?: () => void;
}

export function PageBar({ editor, onPageChange, onSaveNotification }: PageBarProps) {
  const [pages, setPages] = useState<TLPage[]>([]);
  const [currentPageId, setCurrentPageId] = useState<TLPageId | null>(null);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [menuOpenPageId, setMenuOpenPageId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync pages with editor store
  useEffect(() => {
    if (!editor) return;

    const syncPages = () => {
      try {
        const currentPages = editor.getPages();
        const activeId = editor.getCurrentPageId();
        setPages([...currentPages]);
        setCurrentPageId(activeId);
      } catch (e) {
        console.error('Error syncing pages:', e);
      }
    };

    syncPages();

    // Listen to changes in the store (shapes, pages, instance state)
    const unlisten = editor.store.listen(() => {
      syncPages();
    });

    return () => {
      unlisten();
    };
  }, [editor]);

  // Focus input when editing starts
  useEffect(() => {
    if (editingPageId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingPageId]);

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenPageId(null);
      }
    };
    if (menuOpenPageId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuOpenPageId]);

  // Switch active page
  const handleSelectPage = (pageId: TLPageId) => {
    if (!editor || pageId === currentPageId) return;
    editor.setCurrentPage(pageId);
    setCurrentPageId(pageId);
    onPageChange?.(pageId);
    onSaveNotification?.();
  };

  // Add a new page
  const handleCreatePage = () => {
    if (!editor) return;
    const nextNumber = pages.length + 1;
    const name = `Page ${nextNumber}`;

    editor.createPage({ name });
    
    // Switch to the newly created page
    const updated = editor.getPages();
    const newPage = updated.find(p => p.name === name) || updated[updated.length - 1];
    if (newPage) {
      editor.setCurrentPage(newPage.id);
      setCurrentPageId(newPage.id);
      onPageChange?.(newPage.id);
    }

    onSaveNotification?.();
  };

  // Start renaming a page
  const startRename = (page: TLPage, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingPageId(page.id);
    setEditingName(page.name);
    setMenuOpenPageId(null);
  };

  // Save renamed page
  const saveRename = (pageId: TLPageId) => {
    if (!editor) return;
    const trimmed = editingName.trim();
    if (trimmed && trimmed.length > 0) {
      editor.renamePage(pageId, trimmed);
      onSaveNotification?.();
    }
    setEditingPageId(null);
  };

  // Duplicate page
  const handleDuplicate = (pageId: TLPageId, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!editor) return;
    editor.duplicatePage(pageId);
    setMenuOpenPageId(null);
    onSaveNotification?.();
  };

  // Delete page
  const handleDelete = (pageId: TLPageId, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!editor) return;
    if (pages.length <= 1) {
      alert('Diagram must contain at least one page.');
      setMenuOpenPageId(null);
      return;
    }
    editor.deletePage(pageId);
    setMenuOpenPageId(null);
    onSaveNotification?.();
  };

  if (!editor || pages.length === 0) return null;

  return (
    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 p-1 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xl select-none max-w-[calc(100vw-2rem)] overflow-x-auto scrollbar-none">
      {/* Pages Icon & Label */}
      <div className="flex items-center gap-1.5 px-2 text-slate-500 font-semibold text-xs border-r border-slate-200 mr-0.5">
        <Layers size={14} className="text-blue-600" />
        <span className="hidden sm:inline text-[11px] tracking-wide uppercase text-slate-400 font-bold">Pages</span>
      </div>

      {/* Pages Tabs */}
      <div className="flex items-center gap-1">
        {pages.map((page) => {
          const isActive = page.id === currentPageId;
          const isEditing = page.id === editingPageId;
          const isMenuOpen = page.id === menuOpenPageId;

          return (
            <div
              key={page.id}
              className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-2xs border border-blue-200/80 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
              }`}
              onClick={() => handleSelectPage(page.id)}
              onDoubleClick={(e) => startRename(page, e)}
              title={isActive ? 'Active page (double-click to rename)' : 'Click to switch page'}
            >
              {/* Active Dot */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              )}

              {/* Editable Name or Text */}
              {isEditing ? (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => saveRename(page.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveRename(page.id);
                      if (e.key === 'Escape') setEditingPageId(null);
                    }}
                    className="bg-white border border-blue-500 text-slate-900 px-1.5 py-0.5 rounded text-xs outline-none w-24"
                  />
                  <button
                    onClick={() => saveRename(page.id)}
                    className="p-0.5 text-blue-600 hover:text-blue-800"
                  >
                    <Check size={12} />
                  </button>
                </div>
              ) : (
                <span className="truncate max-w-[120px]">{page.name}</span>
              )}

              {/* Page Actions Dropdown Trigger (···) */}
              {!isEditing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenPageId(isMenuOpen ? null : page.id);
                  }}
                  className={`p-0.5 rounded-md hover:bg-slate-200/70 transition-opacity ${
                    isActive || isMenuOpen ? 'opacity-80 group-hover:opacity-100' : 'opacity-0 group-hover:opacity-80'
                  }`}
                  title="Page options"
                >
                  <MoreHorizontal size={13} />
                </button>
              )}

              {/* Context Dropdown Menu */}
              {isMenuOpen && (
                <div
                  ref={menuRef}
                  className="absolute bottom-full mb-2 left-0 w-36 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => startRename(page, e)}
                    className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Edit3 size={13} className="text-slate-500" />
                    <span>Rename</span>
                  </button>
                  <button
                    onClick={(e) => handleDuplicate(page.id, e)}
                    className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Copy size={13} className="text-slate-500" />
                    <span>Duplicate</span>
                  </button>
                  {pages.length > 1 && (
                    <>
                      <div className="h-px bg-slate-100 my-1" />
                      <button
                        onClick={(e) => handleDelete(page.id, e)}
                        className="w-full px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Page Button */}
      <button
        onClick={handleCreatePage}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50/80 border border-dashed border-slate-300 hover:border-blue-400 transition-all ml-0.5"
        title="Add new page (+)"
      >
        <Plus size={14} />
        <span className="hidden sm:inline">Add Page</span>
      </button>
    </div>
  );
}

