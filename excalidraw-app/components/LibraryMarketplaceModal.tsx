import React, { useState, useMemo } from "react";
import {
  Search,
  X,
  Library,
  Layers,
  Cloud,
  Code2,
  Check,
  Download,
  Loader2,
  Sparkles,
  ExternalLink,
  Database,
  ArrowRight,
} from "lucide-react";
import {
  CURATED_LIBRARIES,
  CuratedLibraryDef,
  installLibrary,
} from "../data/firebaseLibraryStorage";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  excalidrawAPI: ExcalidrawImperativeAPI | null;
  onSuccessToast: (message: string) => void;
}

type CategoryFilter = "all" | "architecture" | "cloud" | "tech" | "diagrams";

interface CategoryTab {
  id: CategoryFilter;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const CATEGORIES: CategoryTab[] = [
  { id: "all", label: "All Libraries", icon: Sparkles },
  { id: "architecture", label: "Architecture & Systems", icon: Layers },
  { id: "cloud", label: "Cloud & DevOps", icon: Cloud },
  { id: "tech", label: "Tech Stacks & Logos", icon: Code2 },
  { id: "diagrams", label: "UML & Diagrams", icon: Database },
];

export const LibraryMarketplaceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  excalidrawAPI,
  onSuccessToast,
}) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [installingId, setInstallingId] = useState<string | null>(null);
  const [installedIds, setInstalledIds] = useState<Set<string>>(new Set());
  const [isInstallingAll, setIsInstallingAll] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  const filteredLibraries = useMemo(() => {
    return CURATED_LIBRARIES.filter((lib) => {
      const matchCat = category === "all" || lib.category === category;
      const text = `${lib.name} ${lib.description} ${lib.author}`.toLowerCase();
      const matchSearch = !search.trim() || text.includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [category, search]);

  const handleInstallOne = async (lib: CuratedLibraryDef) => {
    if (!excalidrawAPI) {
      alert("Excalidraw is still initializing. Please try again in a moment.");
      return;
    }
    setInstallingId(lib.id);
    try {
      const count = await installLibrary(lib, excalidrawAPI);
      setInstalledIds((prev) => new Set(prev).add(lib.id));
      onSuccessToast(`Installed "${lib.name}" (${count} components) & synced to Firebase!`);
    } catch (err: any) {
      alert(`Failed to install library: ${err.message}`);
    } finally {
      setInstallingId(null);
    }
  };

  const handleInstallAll = async () => {
    if (!excalidrawAPI) return;
    setIsInstallingAll(true);
    let totalInstalled = 0;

    try {
      for (const lib of CURATED_LIBRARIES) {
        if (!installedIds.has(lib.id)) {
          const count = await installLibrary(lib, excalidrawAPI);
          totalInstalled += count;
          setInstalledIds((prev) => new Set(prev).add(lib.id));
        }
      }
      onSuccessToast(
        `All ${CURATED_LIBRARIES.length} libraries (${totalInstalled} items) saved to Firebase!`,
      );
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsInstallingAll(false);
    }
  };

  if (!isOpen) return null;

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
        zIndex: 1000,
        padding: "16px",
        fontFamily: "var(--ui-font)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "780px",
          maxHeight: "88vh",
          backgroundColor: "var(--island-bg-color, #ffffff)",
          color: "var(--text-primary-color, #0f172a)",
          borderRadius: "16px",
          boxShadow:
            "0 20px 40px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.08)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "modalFadeIn 0.18s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 22px",
            borderBottom: "1px solid var(--default-border-color, #e2e8f0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "var(--color-primary-light, #fff0f2)",
                color: "var(--color-primary, #eb0029)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Library size={22} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: 700,
                    letterSpacing: "-0.2px",
                  }}
                >
                  Excalidraw Libraries
                </h2>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: "12px",
                    backgroundColor: "#ecfdf5",
                    color: "#059669",
                    border: "1px solid #a7f3d0",
                  }}
                >
                  Cross-Device Firebase
                </span>
              </div>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "12.5px",
                  color: "#64748b",
                }}
              >
                Direct from libraries.excalidraw.com — saved to database across all devices
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              onClick={handleInstallAll}
              disabled={isInstallingAll}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#eb0029",
                color: "#ffffff",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: isInstallingAll ? "wait" : "pointer",
                transition: "all 0.15s ease",
                boxShadow: "0 2px 6px rgba(235, 0, 41, 0.25)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d60024")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#eb0029")}
            >
              {isInstallingAll ? (
                <Loader2 size={14} className="spin-animate" />
              ) : (
                <Download size={14} strokeWidth={2.4} />
              )}
              <span>{isInstallingAll ? "Installing..." : "Install All Top Libraries"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                border: "none",
                background: "transparent",
                color: "#64748b",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Search Bar & Categories */}
        <div
          style={{
            padding: "14px 22px 10px 22px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            borderBottom: "1px solid var(--default-border-color, #e2e8f0)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid var(--default-border-color, #e2e8f0)",
              backgroundColor: "var(--input-bg-color, #f8fafc)",
            }}
          >
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search architecture, AWS, Azure, GCP, databases, logos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "13.5px",
                color: "inherit",
                fontFamily: "var(--ui-font)",
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#94a3b8",
                  cursor: "pointer",
                  display: "flex",
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              paddingBottom: "4px",
            }}
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12.5px",
                    fontWeight: isActive ? 600 : 500,
                    border: isActive
                      ? "1px solid #eb0029"
                      : "1px solid var(--default-border-color, #e2e8f0)",
                    backgroundColor: isActive ? "#fff0f2" : "transparent",
                    color: isActive ? "#eb0029" : "#475569",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Icon size={14} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Library Items Grid */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "18px 22px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "14px",
            maxHeight: "55vh",
          }}
        >
          {filteredLibraries.map((lib) => {
            const isInstalled = installedIds.has(lib.id);
            const isCurrentInstalling = installingId === lib.id;

            return (
              <div
                key={lib.id}
                style={{
                  border: isInstalled
                    ? "1px solid #86efac"
                    : "1px solid var(--default-border-color, #e2e8f0)",
                  backgroundColor: isInstalled
                    ? "#f0fdf4"
                    : "var(--island-bg-color, #ffffff)",
                  borderRadius: "12px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "12px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                  transition: "all 0.15s ease",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "6px",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "var(--text-primary-color, #0f172a)",
                      }}
                    >
                      {lib.name}
                    </h3>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "2px 7px",
                        borderRadius: "6px",
                        backgroundColor: "#f1f5f9",
                        color: "#475569",
                      }}
                    >
                      ~{lib.itemCountEstimated} items
                    </span>
                  </div>

                  <p
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "12.5px",
                      color: "#475569",
                      lineHeight: "1.4",
                    }}
                  >
                    {lib.description}
                  </p>

                  <div
                    style={{
                      fontSize: "11.5px",
                      color: "#94a3b8",
                      fontWeight: 500,
                    }}
                  >
                    By {lib.author}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "10px",
                    borderTop: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <a
                    href="https://libraries.excalidraw.com/?theme=light&sort=default"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "11.5px",
                      color: "#64748b",
                      textDecoration: "none",
                    }}
                  >
                    <span>View online</span>
                    <ExternalLink size={11} />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleInstallOne(lib)}
                    disabled={isCurrentInstalling || isInstalled}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      borderRadius: "7px",
                      border: isInstalled ? "1px solid #86efac" : "none",
                      backgroundColor: isInstalled
                        ? "#dcfce7"
                        : "#0f172a",
                      color: isInstalled ? "#166534" : "#ffffff",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: isInstalled ? "default" : isCurrentInstalling ? "wait" : "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {isCurrentInstalling ? (
                      <>
                        <Loader2 size={13} className="spin-animate" />
                        <span>Saving...</span>
                      </>
                    ) : isInstalled ? (
                      <>
                        <Check size={13} strokeWidth={2.5} />
                        <span>In Database</span>
                      </>
                    ) : (
                      <>
                        <Download size={13} strokeWidth={2.2} />
                        <span>Install to DB</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 22px",
            borderTop: "1px solid var(--default-border-color, #e2e8f0)",
            backgroundColor: "var(--input-bg-color, #f8fafc)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "#64748b",
          }}
        >
          <span>
            {CURATED_LIBRARIES.length} top libraries curated from libraries.excalidraw.com
          </span>
          <span style={{ fontWeight: 600, color: "#eb0029" }}>
            All installations persist to Firebase Firestore across devices
          </span>
        </div>
      </div>
    </div>
  );
};
