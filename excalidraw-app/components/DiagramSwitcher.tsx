import React from "react";

export type SaveStatus = "saved" | "unsaved" | "saving" | "error";

interface Props {
  activeDiagramName: string;
  saveStatus: SaveStatus;
  onSave: () => void;
  onOpenHistory: () => void;
  onQuickNew: () => void;
}

export const DiagramSwitcher: React.FC<Props> = ({
  activeDiagramName,
  saveStatus,
  onSave,
  onOpenHistory,
  onQuickNew,
}) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        height: "var(--default-button-size, 2.25rem)",
        zIndex: 5,
      }}
    >
      {/* Diagram Switcher / History Button */}
      <button
        type="button"
        onClick={onOpenHistory}
        title="View Diagram History & Switch Diagrams"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          height: "100%",
          padding: "0 12px",
          borderRadius: "var(--border-radius-lg, 8px)",
          border: "1px solid var(--default-border-color, #e0e0e0)",
          backgroundColor: "var(--island-bg-color, #ffffff)",
          color: "var(--text-primary-color, #1e1e1e)",
          cursor: "pointer",
          fontSize: "0.85rem",
          fontWeight: 600,
          boxShadow: "var(--shadow-island)",
          transition: "all 0.15s ease",
          maxWidth: "220px",
        }}
      >
        <span
          style={{
            color: "var(--color-primary, #e03131)",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          {/* Flow Diagram icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
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
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.6, flexShrink: 0 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* New Diagram Button */}
      <button
        type="button"
        onClick={onQuickNew}
        title="Create New Diagram"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "var(--default-button-size, 2.25rem)",
          borderRadius: "var(--border-radius-lg, 8px)",
          border: "1px solid var(--default-border-color, #e0e0e0)",
          backgroundColor: "var(--island-bg-color, #ffffff)",
          color: "var(--color-primary, #e03131)",
          cursor: "pointer",
          fontSize: "1.2rem",
          fontWeight: 700,
          boxShadow: "var(--shadow-island)",
          transition: "all 0.15s ease",
        }}
      >
        +
      </button>

      {/* Explicit Save to Firebase Button */}
      <button
        type="button"
        onClick={onSave}
        disabled={saveStatus === "saving"}
        title={
          saveStatus === "unsaved"
            ? "Save changes to Firebase (Cmd+S / Ctrl+S)"
            : saveStatus === "saving"
            ? "Saving to Firebase..."
            : saveStatus === "error"
            ? "Error saving. Click to retry."
            : "Diagram saved to Firebase"
        }
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          height: "100%",
          padding: "0 12px",
          borderRadius: "var(--border-radius-lg, 8px)",
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
              ? "0 2px 6px rgba(224, 49, 49, 0.35)"
              : "var(--shadow-island)",
          transition: "all 0.18s ease",
        }}
      >
        {saveStatus === "saving" && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            style={{
              animation: "spin 1s linear infinite",
            }}
          >
            <style>
              {`@keyframes spin { 100% { transform: rotate(360deg); } }`}
            </style>
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
        )}

        {saveStatus === "saved" && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2f9e44"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}

        {saveStatus === "unsaved" && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
        )}

        {saveStatus === "error" && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#e03131"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
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
