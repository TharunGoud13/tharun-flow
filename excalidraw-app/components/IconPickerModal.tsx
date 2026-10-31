import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  X,
  Cpu,
  Cloud,
  Code2,
  Database,
  Layers,
  Sparkles,
  Check,
} from "lucide-react";

import { ALL_ICONS, IconDef } from "./iconData";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectIcon: (icon: IconDef) => void;
}

type CategoryType = "all" | "cloud" | "tech" | "database" | "architecture";

interface CategoryTab {
  id: CategoryType;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const CATEGORIES: CategoryTab[] = [
  { id: "all", label: "All Icons", icon: Sparkles },
  { id: "cloud", label: "Cloud & DevOps", icon: Cloud },
  { id: "tech", label: "Tech & Stacks", icon: Code2 },
  { id: "database", label: "Databases", icon: Database },
  { id: "architecture", label: "Architecture", icon: Layers },
];

export const IconPickerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectIcon,
}) => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryType>("all");
  const [justInsertedId, setJustInsertedId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearch("");
      setActiveCategory("all");
      setJustInsertedId(null);
    }
  }, [isOpen]);

  const filteredIcons = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ALL_ICONS.filter((icon) => {
      const matchCat =
        activeCategory === "all" || icon.category === activeCategory;
      if (!matchCat) return false;
      if (!q) return true;

      return (
        icon.title.toLowerCase().includes(q) ||
        icon.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [search, activeCategory]);

  const handleIconClick = (icon: IconDef) => {
    setJustInsertedId(icon.id);
    onSelectIcon(icon);
    setTimeout(() => {
      setJustInsertedId(null);
    }, 1500);
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
          maxWidth: "680px",
          maxHeight: "85vh",
          backgroundColor: "var(--color-surface-lowest, #ffffff)",
          color: "var(--color-on-surface, #212529)",
          borderRadius: "16px",
          boxShadow:
            "0 20px 40px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.08)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "modalFadeIn 0.15s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--color-surface-low, #e9ecef)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "#fff0f2",
                color: "#eb0029",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Cpu size={20} strokeWidth={2.2} />
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "var(--color-on-surface, #212529)",
                  letterSpacing: "-0.2px",
                }}
              >
                Architecture & Tech Icons
              </h2>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "12px",
                  color: "#868e96",
                }}
              >
                Click any icon to place it instantly onto your canvas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              border: "none",
              background: "transparent",
              color: "#868e96",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f1f3f5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div
          style={{
            padding: "12px 20px 8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 12px",
              borderRadius: "10px",
              border: "1.5px solid var(--color-surface-low, #dee2e6)",
              backgroundColor: "var(--color-surface-mid, #f8f9fa)",
              transition: "border-color 0.15s ease",
            }}
          >
            <Search size={18} color="#adb5bd" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search icons (e.g. aws, react, database, server, docker)..."
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: "14px",
                color: "inherit",
                fontFamily: "inherit",
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#adb5bd",
                  padding: "2px",
                  display: "flex",
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            padding: "4px 20px 10px",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
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
                    : "1px solid var(--color-surface-low, #e9ecef)",
                  backgroundColor: isActive ? "#fff0f2" : "transparent",
                  color: isActive ? "#eb0029" : "#495057",
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

        {/* Icons Grid */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "8px 20px 20px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))",
            gap: "10px",
          }}
        >
          {filteredIcons.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "40px 20px",
                color: "#868e96",
              }}
            >
              <p style={{ margin: "0 0 6px", fontSize: "15px", fontWeight: 600 }}>
                No icons found
              </p>
              <p style={{ margin: 0, fontSize: "13px" }}>
                Try searching for something else like "cloud", "database", or "server"
              </p>
            </div>
          ) : (
            filteredIcons.map((icon) => {
              const isInserted = justInsertedId === icon.id;
              return (
                <button
                  key={icon.id}
                  type="button"
                  onClick={() => handleIconClick(icon)}
                  title={`Add ${icon.title} to canvas`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "14px 6px 10px",
                    borderRadius: "12px",
                    border: isInserted
                      ? "1.5px solid #2b8a3e"
                      : "1px solid var(--color-surface-low, #e9ecef)",
                    backgroundColor: isInserted
                      ? "#ebfbee"
                      : "var(--color-surface-lowest, #ffffff)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (!isInserted) {
                      e.currentTarget.style.borderColor = "#eb0029";
                      e.currentTarget.style.backgroundColor = "#fff0f2";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(235, 0, 41, 0.12)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isInserted) {
                      e.currentTarget.style.borderColor =
                        "var(--color-surface-low, #e9ecef)";
                      e.currentTarget.style.backgroundColor =
                        "var(--color-surface-lowest, #ffffff)";
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isInserted ? (
                      <Check size={26} color="#2b8a3e" strokeWidth={2.5} />
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: icon.getSvg(28, icon.color),
                        }}
                        style={{
                          width: "28px",
                          height: "28px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 500,
                      color: isInserted ? "#2b8a3e" : "#495057",
                      textAlign: "center",
                      lineHeight: "1.2",
                      maxWidth: "88px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {icon.title.split(" ")[0]}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div
          style={{
            padding: "10px 20px",
            backgroundColor: "var(--color-surface-mid, #f8f9fa)",
            borderTop: "1px solid var(--color-surface-low, #e9ecef)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "#868e96",
          }}
        >
          <span>
            Showing {filteredIcons.length} of {ALL_ICONS.length} icons
          </span>
          <span style={{ fontWeight: 500, color: "#eb0029" }}>
            tharun-flow Component Library
          </span>
        </div>
      </div>
    </div>
  );
};
