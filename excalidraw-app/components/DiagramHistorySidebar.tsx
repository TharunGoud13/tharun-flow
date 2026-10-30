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
  Clock,
  CloudCheck,
  Database,
  Sparkles,
} from "lucide-react";
import {
  FirebaseDiagramMetadata,
  FirebaseDiagramRecord,
  listFirebaseDiagrams,
  loadFirebaseDiagram,
  createNewDiagramRecord,
  duplicateFirebaseDiagram,
  deleteFirebaseDiagram,
  renameFirebaseDiagram,
  saveDiagramToFirebase,
} from "../data/firebaseDiagramStorage";

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
      console.error("Failed to load diagrams from Firebase:", e);
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

  const filteredDiagrams = useMemo(() => {
    if (!searchTerm.trim()) return diagrams;
    const lower = searchTerm.toLowerCase();
    return diagrams.filter((d) => d.name.toLowerCase().includes(lower));
  }, [diagrams, searchTerm]);

  // Group diagrams chronologically like ChatGPT
  const groupedDiagrams = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
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
        alert("Failed to load diagram from Firebase.");
      }
    } catch (err) {
      console.error(err);
      alert("Error loading diagram from Firebase.");
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
    if (window.confirm("Are you sure you want to delete this diagram from Firebase?")) {
      setActionLoadingId(id);
      try {
        await deleteFirebaseDiagram(id);
        const remaining = diagrams.filter((d) => d.id !== id);
        setDiagrams(remaining);

        if (id === activeDiagramId && remaining.length > 0) {
          const next = await loadFirebaseDiagram(remaining[0].id);
          if (next) onSelectDiagram(next);
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

  const saveRename = async (id: string, e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.stopPropagation();
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
      {/* Backdrop overlay for focus */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.32)",
            backdropFilter: "blur(2px)",
            zIndex: 998,
            transition: "opacity 0.2s ease",
          }}
        />
      )}

      {/* Slide-out Sidebar */}
      <aside
        aria-label="Diagrams History Sidebar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "290px",
          backgroundColor: "var(--island-bg-color, #ffffff)",
          borderRight: "1px solid var(--default-border-color, #e0e0e0)",
          boxShadow: isOpen
            ? "4px 0 24px rgba(0, 0, 0, 0.15)"
            : "none",
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.24s cubic-bezier(0.16, 1, 0.3, 1)",
          color: "var(--text-primary-color, #1e1e1e)",
          userSelect: "none",
        }}
      >
        {/* Top Header */}
        <div
          style={{
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--default-border-color, #e0e0e0)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "var(--color-primary-light, #ffe3e3)",
                color: "var(--color-primary, #e03131)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Layers size={18} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, letterSpacing: "-0.2px" }}>
                tharun-flow
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-secondary-color, #777)",
                  fontWeight: 500,
                }}
              >
                Diagram History
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Close Sidebar"
            style={{
              background: "none",
              border: "none",
              padding: "6px",
              borderRadius: "6px",
              cursor: "pointer",
              color: "var(--text-secondary-color, #666)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
            }}
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        {/* Action Button: + New Diagram (ChatGPT style) */}
        <div style={{ padding: "14px 16px 10px 16px" }}>
          <button
            type="button"
            onClick={() => {
              onNewDiagram();
              onClose();
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
              padding: "9px 14px",
              borderRadius: "10px",
              border: "1px solid var(--color-primary, #e03131)",
              backgroundColor: "var(--color-primary-light, #fff5f5)",
              color: "var(--color-primary, #e03131)",
              cursor: "pointer",
              fontSize: "0.88rem",
              fontWeight: 600,
              boxShadow: "0 1px 3px rgba(224, 49, 49, 0.12)",
              transition: "all 0.15s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Plus size={16} strokeWidth={2.5} />
              <span>New diagram</span>
            </div>
            <span
              style={{
                fontSize: "0.7rem",
                padding: "2px 6px",
                borderRadius: "4px",
                backgroundColor: "rgba(224, 49, 49, 0.15)",
                color: "var(--color-primary, #e03131)",
              }}
            >
              +
            </span>
          </button>
        </div>

        {/* Search input */}
        <div style={{ padding: "0 16px 12px 16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 12px",
              borderRadius: "8px",
              border: "1px solid var(--default-border-color, #e0e0e0)",
              backgroundColor: "var(--input-bg-color, #f8f9fa)",
            }}
          >
            <Search size={14} color="var(--text-secondary-color, #888)" />
            <input
              type="text"
              placeholder="Search diagrams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                color: "inherit",
                fontSize: "0.82rem",
                outline: "none",
                minWidth: 0,
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: "#888",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Diagrams List (ChatGPT Chronological Groups) */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 10px 16px 10px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {isLoading && diagrams.length === 0 ? (
            <div
              style={{
                padding: "30px 16px",
                textAlign: "center",
                fontSize: "0.82rem",
                color: "var(--text-secondary-color, #888)",
              }}
            >
              Loading diagrams from Firebase...
            </div>
          ) : groupedDiagrams.length === 0 ? (
            <div
              style={{
                padding: "30px 16px",
                textAlign: "center",
                fontSize: "0.82rem",
                color: "var(--text-secondary-color, #888)",
              }}
            >
              {searchTerm ? "No diagrams found" : "No saved diagrams yet"}
            </div>
          ) : (
            groupedDiagrams.map((group) => (
              <div key={group.label} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <div
                  style={{
                    padding: "4px 10px",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "var(--text-secondary-color, #888)",
                  }}
                >
                  {group.label}
                </div>

                {group.items.map((diag) => {
                  const isActive = diag.id === activeDiagramId;
                  const isActionRunning = actionLoadingId === diag.id;
                  const isEditing = editingId === diag.id;

                  return (
                    <div
                      key={diag.id}
                      onClick={() => !isActionRunning && !isEditing && handleSelect(diag)}
                      className="diagram-sidebar-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 10px",
                        borderRadius: "8px",
                        backgroundColor: isActive
                          ? "var(--color-primary-light, #fff5f5)"
                          : "transparent",
                        color: isActive
                          ? "var(--color-primary, #e03131)"
                          : "var(--text-primary-color, #1e1e1e)",
                        cursor: isActionRunning ? "wait" : "pointer",
                        transition: "all 0.12s ease",
                        position: "relative",
                      }}
                    >
                      {isEditing ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            width: "100%",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveRename(diag.id, e);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            autoFocus
                            style={{
                              flex: 1,
                              padding: "4px 8px",
                              borderRadius: "5px",
                              border: "1px solid var(--color-primary, #e03131)",
                              fontSize: "0.82rem",
                              fontWeight: 600,
                              outline: "none",
                              backgroundColor: "var(--input-bg-color, #ffffff)",
                              color: "inherit",
                              minWidth: 0,
                            }}
                          />
                          <button
                            type="button"
                            onClick={(e) => saveRename(diag.id, e)}
                            title="Save name"
                            style={{
                              padding: "4px",
                              border: "none",
                              borderRadius: "4px",
                              backgroundColor: "var(--color-primary, #e03131)",
                              color: "#fff",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Check size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            title="Cancel"
                            style={{
                              padding: "4px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              background: "transparent",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              flex: 1,
                              minWidth: 0,
                            }}
                          >
                            <Layers
                              size={15}
                              strokeWidth={2}
                              style={{
                                color: isActive
                                  ? "var(--color-primary, #e03131)"
                                  : "var(--text-secondary-color, #888)",
                                flexShrink: 0,
                              }}
                            />
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                minWidth: 0,
                                flex: 1,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "0.84rem",
                                  fontWeight: isActive ? 600 : 500,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {diag.name}
                              </span>
                              <span
                                style={{
                                  fontSize: "0.68rem",
                                  color: "var(--text-secondary-color, #888)",
                                }}
                              >
                                {diag.elementCount || 0} {diag.elementCount === 1 ? "element" : "elements"}
                              </span>
                            </div>
                          </div>

                          {/* Action icons (show on item hover or when active) */}
                          <div
                            className="diagram-actions"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "3px",
                              flexShrink: 0,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Rename */}
                            <button
                              type="button"
                              title="Rename diagram"
                              onClick={(e) => startRename(diag, e)}
                              style={{
                                padding: "4px",
                                border: "none",
                                background: "transparent",
                                borderRadius: "4px",
                                cursor: "pointer",
                                color: "var(--text-secondary-color, #777)",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Pencil size={13} />
                            </button>

                            {/* Duplicate */}
                            <button
                              type="button"
                              title="Duplicate diagram"
                              onClick={(e) => handleDuplicate(diag.id, e)}
                              style={{
                                padding: "4px",
                                border: "none",
                                background: "transparent",
                                borderRadius: "4px",
                                cursor: "pointer",
                                color: "var(--text-secondary-color, #777)",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Copy size={13} />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              title="Delete diagram"
                              onClick={(e) => handleDelete(diag.id, e)}
                              style={{
                                padding: "4px",
                                border: "none",
                                background: "transparent",
                                borderRadius: "4px",
                                cursor: "pointer",
                                color: "#fa5252",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer info (Firebase cloud sync) */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid var(--default-border-color, #e0e0e0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.74rem",
            color: "var(--text-secondary-color, #777)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: "#2b8a3e",
                display: "inline-block",
                boxShadow: "0 0 6px #2b8a3e",
              }}
            />
            <span>Firebase Connected</span>
          </div>
          <span>
            {diagrams.length} {diagrams.length === 1 ? "diagram" : "diagrams"}
          </span>
        </div>
      </aside>
    </>
  );
};
