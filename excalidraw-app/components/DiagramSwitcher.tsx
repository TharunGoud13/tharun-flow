import React from "react";
import {
  PanelLeft,
  Layers,
  ChevronDown,
  Plus,
  Save,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";

export type SaveStatus = "saved" | "unsaved" | "saving" | "error";

interface Props {
  activeDiagramName: string;
  saveStatus: SaveStatus;
  onSave: () => void;
  onToggleSidebar: () => void;
  onQuickNew: () => void;
  isSidebarOpen?: boolean;
}

export const DiagramSwitcher: React.FC<Props> = ({
  activeDiagramName,
  saveStatus,
  onSave,
  onToggleSidebar,
  onQuickNew,
  isSidebarOpen,
}) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        height: "36px",
        zIndex: 5,
      }}
    >
      {/* 1. Sidebar Toggle Button (ChatGPT style panel icon) */}
      <button
        type="button"
        onClick={onToggleSidebar}
        title="Toggle Diagram History (Sidebar)"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          height: "36px",
          width: "36px",
          borderRadius: "8px",
          border: isSidebarOpen
            ? "1px solid var(--color-primary, #e03131)"
            : "1px solid var(--default-border-color, #e0e0e0)",
          backgroundColor: isSidebarOpen
            ? "var(--color-primary-light, #fff5f5)"
            : "var(--island-bg-color, #ffffff)",
          color: isSidebarOpen
            ? "var(--color-primary, #e03131)"
            : "var(--text-primary-color, #1e1e1e)",
          cursor: "pointer",
          boxShadow: "var(--shadow-island)",
          transition: "all 0.15s ease",
          flexShrink: 0,
        }}
      >
        <PanelLeft size={17} strokeWidth={2.2} />
      </button>

      {/* 2. Diagram Name & History Opener */}
      <button
        type="button"
        onClick={onToggleSidebar}
        title="Diagram History & Switcher"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          height: "36px",
          padding: "0 12px",
          borderRadius: "8px",
          border: "1px solid var(--default-border-color, #e0e0e0)",
          backgroundColor: "var(--island-bg-color, #ffffff)",
          color: "var(--text-primary-color, #1e1e1e)",
          cursor: "pointer",
          fontSize: "0.85rem",
          fontWeight: 600,
          boxShadow: "var(--shadow-island)",
          transition: "all 0.15s ease",
          maxWidth: "200px",
        }}
      >
        <span
          style={{
            color: "var(--color-primary, #e03131)",
            display: "inline-flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <Layers size={16} strokeWidth={2.4} />
        </span>
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {activeDiagramName || "Untitled Diagram"}
        </span>
        <span style={{ opacity: 0.6, display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
          <ChevronDown size={14} strokeWidth={2.4} />
        </span>
      </button>

      {/* 3. Quick New Diagram Button */}
      <button
        type="button"
        onClick={onQuickNew}
        title="Create New Diagram"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          height: "36px",
          width: "36px",
          borderRadius: "8px",
          border: "1px solid var(--default-border-color, #e0e0e0)",
          backgroundColor: "var(--island-bg-color, #ffffff)",
          color: "var(--color-primary, #e03131)",
          cursor: "pointer",
          boxShadow: "var(--shadow-island)",
          transition: "all 0.15s ease",
          flexShrink: 0,
        }}
      >
        <Plus size={18} strokeWidth={2.6} />
      </button>

      {/* 4. Explicit Save to Firebase Button */}
      <button
        id="save-to-firebase-button"
        type="button"
        onClick={onSave}
        disabled={saveStatus === "saving"}
        title={
          saveStatus === "unsaved"
            ? "Save changes to Firebase (Cmd+S / Ctrl+S)"
            : saveStatus === "saving"
            ? "Saving to Firebase..."
            : saveStatus === "error"
            ? "Save failed. Click to retry."
            : "Diagram saved to Firebase"
        }
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          height: "36px",
          padding: "0 12px",
          borderRadius: "8px",
          border:
            saveStatus === "unsaved"
              ? "1px solid #e03131"
              : saveStatus === "error"
              ? "1px solid #fa5252"
              : "1px solid var(--default-border-color, #e0e0e0)",
          backgroundColor:
            saveStatus === "unsaved"
              ? "#e03131"
              : saveStatus === "error"
              ? "#fff5f5"
              : "var(--island-bg-color, #ffffff)",
          color:
            saveStatus === "unsaved"
              ? "#ffffff"
              : saveStatus === "error"
              ? "#e03131"
              : "var(--text-primary-color, #1e1e1e)",
          cursor: saveStatus === "saving" ? "not-allowed" : "pointer",
          fontSize: "0.85rem",
          fontWeight: 600,
          boxShadow:
            saveStatus === "unsaved"
              ? "0 2px 8px rgba(224, 49, 49, 0.35)"
              : "var(--shadow-island)",
          transition: "all 0.18s ease",
          flexShrink: 0,
        }}
      >
        {saveStatus === "saving" && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              animation: "spin 1s linear infinite",
            }}
          >
            <style>
              {`@keyframes spin { 100% { transform: rotate(360deg); } }`}
            </style>
            <Loader2 size={15} strokeWidth={2.5} />
          </span>
        )}

        {saveStatus === "saved" && (
          <Check size={16} color="#2b8a3e" strokeWidth={2.6} />
        )}

        {saveStatus === "unsaved" && (
          <Save size={15} strokeWidth={2.4} />
        )}

        {saveStatus === "error" && (
          <AlertCircle size={15} color="#e03131" strokeWidth={2.4} />
        )}

        <span>
          {saveStatus === "saving"
            ? "Saving..."
            : saveStatus === "unsaved"
            ? "Save"
            : saveStatus === "error"
            ? "Retry Save"
            : "Saved"}
        </span>

        {saveStatus === "unsaved" && (
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              display: "inline-block",
            }}
          />
        )}
      </button>
    </div>
  );
};
