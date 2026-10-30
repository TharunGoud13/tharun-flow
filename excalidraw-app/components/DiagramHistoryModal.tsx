import React, { useState, useEffect, useMemo } from "react";
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

import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  excalidrawAPI: ExcalidrawImperativeAPI | null;
  onSelectDiagram: (diagram: FirebaseDiagramRecord) => void;
  activeDiagramId: string | null;
}

export const DiagramHistoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  excalidrawAPI,
  onSelectDiagram,
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
      console.error("Failed to fetch diagrams from Firebase:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDiagrams();
      setSearchTerm("");
      setEditingId(null);
    }
  }, [isOpen]);

  const filteredDiagrams = useMemo(() => {
    if (!searchTerm.trim()) {
      return diagrams;
    }
    const lower = searchTerm.toLowerCase();
    return diagrams.filter((d) => d.name.toLowerCase().includes(lower));
  }, [diagrams, searchTerm]);

  const handleSelect = async (meta: FirebaseDiagramMetadata) => {
    setActionLoadingId(meta.id);
    try {
      const record = await loadFirebaseDiagram(meta.id);
      if (record) {
        onSelectDiagram(record);
        onClose();
      } else {
        alert("Could not load diagram from Firebase.");
      }
    } catch (err) {
      console.error(err);
      alert("Error loading diagram from Firebase.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCreateNew = async () => {
    setIsLoading(true);
    try {
      const newDiag = createNewDiagramRecord();
      const saveRes = await saveDiagramToFirebase(newDiag);
      if (saveRes.success) {
        await fetchDiagrams();
        onSelectDiagram(newDiag);
        onClose();
      } else {
        alert("Failed to create diagram: " + (saveRes.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
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

        // If user deleted the currently active diagram, switch to the first remaining one
        if (id === activeDiagramId && remaining.length > 0) {
          const nextRecord = await loadFirebaseDiagram(remaining[0].id);
          if (nextRecord) {
            onSelectDiagram(nextRecord);
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

  const saveRename = async (id: string) => {
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

  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "680px",
          maxHeight: "85vh",
          backgroundColor: "var(--island-bg-color, #ffffff)",
          color: "var(--text-primary-color, #1e1e1e)",
          borderRadius: "16px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid var(--default-border-color, #e0e0e0)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--default-border-color, #e0e0e0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "var(--color-primary-light, #ffe3e3)",
                color: "var(--color-primary, #e03131)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>
                Diagram History
              </h2>
              <p
                style={{
                  margin: "2px 0 0 0",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary-color, #666)",
                }}
              >
                Persistent diagrams saved in Firebase Firestore
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              onClick={handleCreateNew}
              disabled={isLoading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "var(--color-primary, #e03131)",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "opacity 0.15s ease",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Diagram
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                border: "none",
                background: "transparent",
                color: "var(--text-secondary-color, #666)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
              }}
            >
              &times;
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div
          style={{
            padding: "12px 24px",
            borderBottom: "1px solid var(--default-border-color, #e0e0e0)",
          }}
        >
          <input
            type="text"
            placeholder="Search diagrams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid var(--default-border-color, #e0e0e0)",
              backgroundColor: "var(--input-bg-color, #f8f9fa)",
              color: "inherit",
              fontSize: "0.9rem",
              outline: "none",
            }}
          />
        </div>

        {/* Diagram List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            minHeight: "240px",
          }}
        >
          {isLoading && diagrams.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "var(--text-secondary-color, #666)",
              }}
            >
              Loading diagrams from Firebase...
            </div>
          ) : filteredDiagrams.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "var(--text-secondary-color, #666)",
              }}
            >
              {searchTerm ? "No diagrams match your search." : "No diagrams found."}
            </div>
          ) : (
            filteredDiagrams.map((diag) => {
              const isActive = diag.id === activeDiagramId;
              const isActionRunning = actionLoadingId === diag.id;

              return (
                <div
                  key={diag.id}
                  onClick={() => !isActionRunning && handleSelect(diag)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: isActive
                      ? "2px solid var(--color-primary, #e03131)"
                      : "1px solid var(--default-border-color, #e0e0e0)",
                    backgroundColor: isActive
                      ? "var(--color-primary-light, #fff5f5)"
                      : "var(--card-bg-color, #ffffff)",
                    cursor: isActionRunning ? "wait" : "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {editingId === diag.id ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveRename(diag.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          autoFocus
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            border: "1px solid var(--color-primary, #e03131)",
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            outline: "none",
                            width: "220px",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => saveRename(diag.id)}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "4px",
                            border: "none",
                            backgroundColor: "var(--color-primary, #e03131)",
                            color: "#fff",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                          }}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            background: "transparent",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            color: "var(--text-primary-color, #1e1e1e)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {diag.name}
                        </span>
                        {isActive && (
                          <span
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              padding: "2px 6px",
                              borderRadius: "4px",
                              backgroundColor: "var(--color-primary, #e03131)",
                              color: "#ffffff",
                              letterSpacing: "0.5px",
                              textTransform: "uppercase",
                            }}
                          >
                            Active
                          </span>
                        )}
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        fontSize: "0.75rem",
                        color: "var(--text-secondary-color, #777)",
                      }}
                    >
                      <span>
                        {diag.elementCount || 0}{" "}
                        {diag.elementCount === 1 ? "element" : "elements"}
                      </span>
                      <span>•</span>
                      <span>
                        Updated {new Date(diag.updatedAt).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Rename */}
                    <button
                      type="button"
                      title="Rename diagram"
                      onClick={(e) => startRename(diag, e)}
                      style={{
                        padding: "6px 8px",
                        borderRadius: "6px",
                        border: "1px solid var(--default-border-color, #e0e0e0)",
                        backgroundColor: "var(--island-bg-color, #ffffff)",
                        cursor: "pointer",
                        color: "inherit",
                        fontSize: "0.8rem",
                      }}
                    >
                      ✎
                    </button>

                    {/* Duplicate */}
                    <button
                      type="button"
                      title="Duplicate diagram"
                      onClick={(e) => handleDuplicate(diag.id, e)}
                      style={{
                        padding: "6px 8px",
                        borderRadius: "6px",
                        border: "1px solid var(--default-border-color, #e0e0e0)",
                        backgroundColor: "var(--island-bg-color, #ffffff)",
                        cursor: "pointer",
                        color: "inherit",
                        fontSize: "0.8rem",
                      }}
                    >
                      ⎘
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      title="Delete diagram"
                      onClick={(e) => handleDelete(diag.id, e)}
                      style={{
                        padding: "6px 8px",
                        borderRadius: "6px",
                        border: "1px solid #ffc9c9",
                        backgroundColor: "#fff5f5",
                        color: "#e03131",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                      }}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
