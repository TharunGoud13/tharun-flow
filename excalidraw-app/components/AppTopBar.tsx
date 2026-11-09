import React from "react";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Library,
  Loader2,
  PanelLeft,
  Save,
  Share2,
  Shapes,
} from "lucide-react";

import { TharunFlowMark } from "@excalidraw/excalidraw/components/ExcalidrawLogo";

import "./AppTopBar.scss";

export type SaveStatus = "saved" | "unsaved" | "saving" | "error";

interface Props {
  activeDiagramName: string;
  saveStatus: SaveStatus;
  isSidebarOpen: boolean;
  canShare: boolean;
  hasCollabError?: boolean;
  onSave: () => void;
  onToggleSidebar: () => void;
  onOpenIcons?: () => void;
  onOpenLibraries?: () => void;
  onShare?: () => void;
}

const SaveButton = ({
  status,
  onSave,
}: {
  status: SaveStatus;
  onSave: () => void;
}) => {
  const title =
    status === "unsaved"
      ? "Save changes (⌘S)"
      : status === "saving"
      ? "Saving…"
      : status === "error"
      ? "Save failed — click to retry"
      : "All changes saved";

  return (
    <button
      type="button"
      id="save-to-firebase-button"
      className={`tf-btn tf-save-btn is-${status}`}
      onClick={onSave}
      disabled={status === "saving"}
      title={title}
      aria-label={title}
    >
      {status === "saving" ? (
        <Loader2 size={15} strokeWidth={2.2} className="tf-spin" />
      ) : status === "saved" ? (
        <Check size={15} strokeWidth={2.4} className="tf-save-btn__check" />
      ) : status === "error" ? (
        <AlertCircle size={15} strokeWidth={2.4} />
      ) : (
        <Save size={15} strokeWidth={2.2} />
      )}
      <span className="tf-btn__label">
        {status === "saving"
          ? "Saving"
          : status === "unsaved"
          ? "Save"
          : status === "error"
          ? "Retry"
          : "Saved"}
      </span>
    </button>
  );
};

export const AppTopBar: React.FC<Props> = ({
  activeDiagramName,
  saveStatus,
  isSidebarOpen,
  canShare,
  hasCollabError,
  onSave,
  onToggleSidebar,
  onOpenIcons,
  onOpenLibraries,
  onShare,
}) => {
  return (
    <header className="tf-topbar" role="banner">
      <div className="tf-topbar__left">
        <div className="tf-brand" aria-label="tharun-flow">
          <TharunFlowMark className="tf-brand__mark" />
          <span className="tf-brand__wordmark">tharun-flow</span>
        </div>

        <span className="tf-topbar__divider" aria-hidden="true" />

        <button
          type="button"
          className="tf-doc-btn"
          onClick={onToggleSidebar}
          title="Open diagram history"
        >
          <span className="tf-doc-btn__name">
            {activeDiagramName || "Untitled diagram"}
          </span>
          <ChevronDown
            size={14}
            strokeWidth={2.2}
            className="tf-doc-btn__chevron"
          />
        </button>
      </div>

      <div className="tf-topbar__right">
        {onOpenIcons && (
          <button
            type="button"
            className="tf-btn tf-btn--ghost tf-btn--icons"
            onClick={onOpenIcons}
            title="Architecture & tech icons"
          >
            <Shapes size={16} strokeWidth={1.9} />
            <span className="tf-btn__label">Icons</span>
          </button>
        )}

        {onOpenLibraries && (
          <button
            type="button"
            className="tf-btn tf-btn--ghost tf-btn--libraries"
            onClick={onOpenLibraries}
            title="Libraries"
          >
            <Library size={16} strokeWidth={1.9} />
            <span className="tf-btn__label">Libraries</span>
          </button>
        )}

        <span className="tf-topbar__divider" aria-hidden="true" />

        <button
          type="button"
          className={`tf-btn tf-btn--icon tf-btn--ghost${
            isSidebarOpen ? " is-active" : ""
          }`}
          onClick={onToggleSidebar}
          aria-pressed={isSidebarOpen}
          title={isSidebarOpen ? "Close history" : "History"}
        >
          <PanelLeft size={17} strokeWidth={1.9} />
        </button>

        <SaveButton status={saveStatus} onSave={onSave} />

        {canShare && onShare && (
          <button
            type="button"
            className="tf-btn"
            onClick={onShare}
            title="Share or collaborate"
          >
            {hasCollabError ? (
              <AlertCircle
                size={15}
                strokeWidth={2.2}
                className="tf-text-danger"
              />
            ) : (
              <Share2 size={15} strokeWidth={1.9} />
            )}
            <span className="tf-btn__label">Share</span>
          </button>
        )}
      </div>
    </header>
  );
};
