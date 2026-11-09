import React, { useState, useEffect, useMemo } from "react";
import {
  PanelLeftClose,
  Plus,
  Search,
  Layers,
  Pencil,
  Copy,
  Trash2,
  Check,
  X,
  Loader2,
} from "lucide-react";

import { TharunFlowMark } from "@excalidraw/excalidraw/components/ExcalidrawLogo";

import type {
  FirebaseDiagramMetadata,
  FirebaseDiagramRecord,
} from "../data/firebaseDiagramStorage";

import {
  listFirebaseDiagrams,
  loadFirebaseDiagram,
  duplicateFirebaseDiagram,
  deleteFirebaseDiagram,
  renameFirebaseDiagram,
} from "../data/firebaseDiagramStorage";

import "./DiagramHistorySidebar.scss";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectDiagram: (diagram: FirebaseDiagramRecord) => void;
  onNewDiagram: () => void;
  activeDiagramId: string | null;
}

export const DiagramHistorySidebar: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectDiagram,
  onNewDiagram,
  activeDiagramId,
}) => {
  const [diagrams, setDiagrams] = useState<FirebaseDiagramMetadata[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchDiagrams = async () => {
    setIsLoading(true);
    try {
      const list = await listFirebaseDiagrams();
      setDiagrams(list);
    } catch (e) {
      console.error("Failed to load diagrams:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDiagrams();
      setEditingId(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !editingId) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, editingId, onClose]);

  const filteredDiagrams = useMemo(() => {
    if (!searchTerm.trim()) {
      return diagrams;
    }
    const lower = searchTerm.toLowerCase();
    return diagrams.filter((d) => d.name.toLowerCase().includes(lower));
  }, [diagrams, searchTerm]);

  // Group diagrams chronologically like ChatGPT
  const groupedDiagrams = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();
    const startOfYesterday = startOfToday - 86400000;
    const startOf7Days = startOfToday - 86400000 * 7;

    const today: FirebaseDiagramMetadata[] = [];
    const yesterday: FirebaseDiagramMetadata[] = [];
    const last7Days: FirebaseDiagramMetadata[] = [];
    const older: FirebaseDiagramMetadata[] = [];

    filteredDiagrams.forEach((diag) => {
      const t = diag.updatedAt || diag.createdAt || 0;
      if (t >= startOfToday) {
        today.push(diag);
      } else if (t >= startOfYesterday) {
        yesterday.push(diag);
      } else if (t >= startOf7Days) {
        last7Days.push(diag);
      } else {
        older.push(diag);
      }
    });

    return [
      { label: "Today", items: today },
      { label: "Yesterday", items: yesterday },
      { label: "Previous 7 Days", items: last7Days },
      { label: "Older", items: older },
    ].filter((group) => group.items.length > 0);
  }, [filteredDiagrams]);

  const handleSelect = async (meta: FirebaseDiagramMetadata) => {
    if (meta.id === activeDiagramId) {
      onClose();
      return;
    }
    setActionLoadingId(meta.id);
    try {
      const record = await loadFirebaseDiagram(meta.id);
      if (record) {
        onSelectDiagram(record);
        onClose();
      } else {
        alert("Couldn’t load this diagram. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Couldn’t load this diagram. Please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoadingId(id);
    try {
      await duplicateFirebaseDiagram(id);
      await fetchDiagrams();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (diagrams.length <= 1) {
      alert("You must keep at least one diagram.");
      return;
    }
    if (window.confirm("Delete this diagram? This can’t be undone.")) {
      setActionLoadingId(id);
      try {
        await deleteFirebaseDiagram(id);
        const remaining = diagrams.filter((d) => d.id !== id);
        setDiagrams(remaining);

        if (id === activeDiagramId && remaining.length > 0) {
          const next = await loadFirebaseDiagram(remaining[0].id);
          if (next) {
            onSelectDiagram(next);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  const startRename = (diag: FirebaseDiagramMetadata, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(diag.id);
    setEditingName(diag.name);
  };

  const saveRename = async (
    id: string,
    e?: React.MouseEvent | React.KeyboardEvent,
  ) => {
    if (e) {
      e.stopPropagation();
    }
    if (!editingName.trim()) {
      setEditingId(null);
      return;
    }
    setActionLoadingId(id);
    try {
      await renameFirebaseDiagram(id, editingName.trim());
      setEditingId(null);
      await fetchDiagrams();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <>
      <div
        className={`tf-sidebar-backdrop${isOpen ? " is-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        aria-label="Diagram history"
        aria-hidden={!isOpen}
        className={`tf-sidebar${isOpen ? " is-open" : ""}`}
      >
        <div className="tf-sidebar__header">
          <div className="tf-sidebar__brand">
            <TharunFlowMark className="tf-sidebar__brand-mark" />
            <div className="tf-sidebar__brand-text">
              <span className="tf-sidebar__brand-name">tharun-flow</span>
              <span className="tf-sidebar__brand-sub">Diagram history</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Close sidebar"
            aria-label="Close sidebar"
            className="tf-icon-btn"
          >
            <PanelLeftClose size={18} strokeWidth={1.9} />
          </button>
        </div>

        <div className="tf-sidebar__actions">
          <button
            type="button"
            onClick={() => {
              onNewDiagram();
              onClose();
            }}
            className="tf-new-btn"
          >
            <Plus size={16} strokeWidth={2.2} />
            <span>New diagram</span>
          </button>
        </div>

        <div className="tf-sidebar__search">
          <div className="tf-search">
            <Search size={14} strokeWidth={2} className="tf-search__icon" />
            <input
              type="text"
              placeholder="Search diagrams"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="tf-search__input"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="tf-search__clear"
                aria-label="Clear search"
              >
                <X size={12} strokeWidth={2.2} />
              </button>
            )}
          </div>
        </div>

        <div className="tf-sidebar__list">
          {isLoading && diagrams.length === 0 ? (
            <div className="tf-sidebar__empty">
              <Loader2 size={18} className="tf-spin" />
              <span>Loading diagrams…</span>
            </div>
          ) : groupedDiagrams.length === 0 ? (
            <div className="tf-sidebar__empty">
              <Layers size={18} strokeWidth={1.8} />
              <span>
                {searchTerm ? "No diagrams found" : "No saved diagrams yet"}
              </span>
            </div>
          ) : (
            groupedDiagrams.map((group) => (
              <div key={group.label} className="tf-sidebar__group">
                <div className="tf-sidebar__group-label">{group.label}</div>

                {group.items.map((diag) => {
                  const isActive = diag.id === activeDiagramId;
                  const isActionRunning = actionLoadingId === diag.id;
                  const isEditing = editingId === diag.id;

                  return (
                    <div
                      key={diag.id}
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        !isActionRunning && !isEditing && handleSelect(diag)
                      }
                      onKeyDown={(e) => {
                        if (
                          !isActionRunning &&
                          !isEditing &&
                          (e.key === "Enter" || e.key === " ")
                        ) {
                          e.preventDefault();
                          handleSelect(diag);
                        }
                      }}
                      className={`tf-diagram${isActive ? " is-active" : ""}${
                        isActionRunning ? " is-busy" : ""
                      }`}
                    >
                      {isEditing ? (
                        <div
                          className="tf-diagram__rename"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                saveRename(diag.id, e);
                              }
                              if (e.key === "Escape") {
                                setEditingId(null);
                              }
                            }}
                            autoFocus
                            className="tf-diagram__rename-input"
                          />
                          <button
                            type="button"
                            onClick={(e) => saveRename(diag.id, e)}
                            title="Save name"
                            className="tf-icon-btn tf-icon-btn--accent"
                          >
                            <Check size={13} strokeWidth={2.6} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            title="Cancel"
                            className="tf-icon-btn"
                          >
                            <X size={13} strokeWidth={2.2} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="tf-diagram__icon">
                            {isActionRunning ? (
                              <Loader2 size={15} className="tf-spin" />
                            ) : (
                              <Layers size={15} strokeWidth={1.9} />
                            )}
                          </span>
                          <span className="tf-diagram__meta">
                            <span className="tf-diagram__name">
                              {diag.name}
                            </span>
                            <span className="tf-diagram__sub">
                              {diag.elementCount || 0}{" "}
                              {diag.elementCount === 1 ? "element" : "elements"}
                            </span>
                          </span>
                          <span
                            className="tf-diagram__actions"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              title="Rename diagram"
                              aria-label="Rename diagram"
                              onClick={(e) => startRename(diag, e)}
                              className="tf-icon-btn"
                            >
                              <Pencil size={13} strokeWidth={1.9} />
                            </button>
                            <button
                              type="button"
                              title="Duplicate diagram"
                              aria-label="Duplicate diagram"
                              onClick={(e) => handleDuplicate(diag.id, e)}
                              className="tf-icon-btn"
                            >
                              <Copy size={13} strokeWidth={1.9} />
                            </button>
                            <button
                              type="button"
                              title="Delete diagram"
                              aria-label="Delete diagram"
                              onClick={(e) => handleDelete(diag.id, e)}
                              className="tf-icon-btn tf-icon-btn--danger"
                            >
                              <Trash2 size={13} strokeWidth={1.9} />
                            </button>
                          </span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="tf-sidebar__footer">
          <span className="tf-sidebar__status">
            <span className="tf-sidebar__status-dot" />
            Synced to your workspace
          </span>
          <span>
            {diagrams.length} {diagrams.length === 1 ? "diagram" : "diagrams"}
          </span>
        </div>
      </aside>
    </>
  );
};
