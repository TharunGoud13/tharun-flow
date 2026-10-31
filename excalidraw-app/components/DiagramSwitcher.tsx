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
  Cpu,
  Library,
} from "lucide-react";

export type SaveStatus = "saved" | "unsaved" | "saving" | "error";

interface Props {
  activeDiagramName: string;
  saveStatus: SaveStatus;
  onSave: () => void;
  onToggleSidebar: () => void;
  onQuickNew: () => void;
  onOpenIcons?: () => void;
  onOpenLibraries?: () => void;
  isSidebarOpen?: boolean;
}

export const DiagramSwitcher: React.FC<Props> = ({
  activeDiagramName,
  saveStatus,
  onSave,
  onToggleSidebar,
  onQuickNew,
  onOpenIcons,
  onOpenLibraries,
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
        fontFamily: "var(--ui-font)",
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
            ? "1px solid #eb0029"
            : "1px solid var(--default-border-color, #e2e8f0)",
          backgroundColor: isSidebarOpen
            ? "var(--color-primary-light, #fff0f2)"
            : "var(--island-bg-color, #ffffff)",
          color: isSidebarOpen
            ? "#eb0029"
            : "var(--text-primary-color, #1e293b)",
          cursor: "pointer",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
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
          border: "1px solid var(--default-border-color, #e2e8f0)",
          backgroundColor: "var(--island-bg-color, #ffffff)",
          color: "var(--text-primary-color, #0f172a)",
          cursor: "pointer",
          fontSize: "0.85rem",
          fontWeight: 600,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          transition: "all 0.15s ease",
          maxWidth: "200px",
          fontFamily: "var(--ui-font)",
        }}
      >
        <span
          style={{
            color: "#eb0029",
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
          border: "1px solid var(--default-border-color, #e2e8f0)",
          backgroundColor: "var(--island-bg-color, #ffffff)",
          color: "#eb0029",
          cursor: "pointer",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
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
              ? "1px solid #eb0029"
              : saveStatus === "error"
              ? "1px solid #ef4444"
              : "1px solid var(--default-border-color, #e2e8f0)",
          backgroundColor:
            saveStatus === "unsaved"
              ? "#eb0029"
              : saveStatus === "error"
              ? "#fef2f2"
              : "var(--island-bg-color, #ffffff)",
          color:
            saveStatus === "unsaved"
              ? "#ffffff"
              : saveStatus === "error"
              ? "#dc2626"
              : "var(--text-primary-color, #0f172a)",
          cursor: saveStatus === "saving" ? "wait" : "pointer",
          fontSize: "0.85rem",
          fontWeight: 600,
          boxShadow:
            saveStatus === "unsaved"
              ? "0 2px 8px rgba(235, 0, 41, 0.28)"
              : "0 1px 3px rgba(0, 0, 0, 0.05)",
          transition: "all 0.18s ease",
          opacity: saveStatus === "saving" ? 0.7 : 1,
          fontFamily: "var(--ui-font)",
        }}
      >
        {saveStatus === "saving" ? (
          <Loader2 size={16} strokeWidth={2.4} className="spin-animate" />
        ) : saveStatus === "saved" ? (
          <Check size={16} strokeWidth={2.4} color="#10b981" />
        ) : saveStatus === "error" ? (
          <AlertCircle size={16} strokeWidth={2.4} color="#dc2626" />
        ) : (
          <Save size={16} strokeWidth={2.2} />
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

      {/* 5. Architecture & Cloud Icons Button */}
      {onOpenIcons && (
        <button
          type="button"
          onClick={onOpenIcons}
          title="Architecture & Cloud Icons"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            height: "36px",
            padding: "0 10px",
            borderRadius: "8px",
            border: "1px solid var(--default-border-color, #e2e8f0)",
            backgroundColor: "var(--island-bg-color, #ffffff)",
            color: "var(--color-on-surface, #1e293b)",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s ease",
            fontFamily: "var(--ui-font)",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#eb0029";
            e.currentTarget.style.color = "#eb0029";
            e.currentTarget.style.backgroundColor = "#fff0f2";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor =
              "var(--default-border-color, #e2e8f0)";
            e.currentTarget.style.color = "var(--color-on-surface, #1e293b)";
            e.currentTarget.style.backgroundColor =
              "var(--island-bg-color, #ffffff)";
          }}
        >
          <Cpu size={15} strokeWidth={2.2} color="#eb0029" />
          <span>Icons</span>
        </button>
      )}

      {/* 6. Excalidraw Libraries Marketplace Button */}
      {onOpenLibraries && (
        <button
          type="button"
          onClick={onOpenLibraries}
          title="Excalidraw Libraries (Cloud & Architecture)"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            height: "36px",
            padding: "0 10px",
            borderRadius: "8px",
            border: "1px solid var(--default-border-color, #e2e8f0)",
            backgroundColor: "var(--island-bg-color, #ffffff)",
            color: "var(--color-on-surface, #1e293b)",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s ease",
            fontFamily: "var(--ui-font)",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#eb0029";
            e.currentTarget.style.color = "#eb0029";
            e.currentTarget.style.backgroundColor = "#fff0f2";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor =
              "var(--default-border-color, #e2e8f0)";
            e.currentTarget.style.color = "var(--color-on-surface, #1e293b)";
            e.currentTarget.style.backgroundColor =
              "var(--island-bg-color, #ffffff)";
          }}
        >
          <Library size={15} strokeWidth={2.2} color="#eb0029" />
          <span>Libraries</span>
        </button>
      )}
    </div>
  );
};
