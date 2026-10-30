import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastData {
  id: number;
  message: string;
  type: "success" | "error" | "info";
  subMessage?: string;
}

interface Props {
  toast: ToastData | null;
  onClose: () => void;
}

export const ToastNotification: React.FC<Props> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";

  return (
    <div
      style={{
        position: "fixed",
        top: "76px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 99999,
        pointerEvents: "auto",
        animation: "toastSlideIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      <style>
        {`
          @keyframes toastSlideIn {
            0% {
              opacity: 0;
              transform: translate(-50%, -12px) scale(0.96);
            }
            100% {
              opacity: 1;
              transform: translate(-50%, 0) scale(1);
            }
          }
        `}
      </style>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px 18px",
          borderRadius: "12px",
          backgroundColor: isSuccess
            ? "var(--island-bg-color, #ffffff)"
            : isError
            ? "#fff5f5"
            : "var(--island-bg-color, #ffffff)",
          border: isSuccess
            ? "1px solid rgba(43, 138, 62, 0.35)"
            : isError
            ? "1px solid rgba(224, 49, 49, 0.4)"
            : "1px solid var(--default-border-color, #e0e0e0)",
          boxShadow:
            "0 12px 32px rgba(0, 0, 0, 0.16), 0 2px 6px rgba(0, 0, 0, 0.08)",
          backdropFilter: "blur(12px)",
          color: "var(--text-primary-color, #1e1e1e)",
          minWidth: "280px",
          maxWidth: "460px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {isSuccess && <CheckCircle2 size={20} color="#2b8a3e" strokeWidth={2.4} />}
          {isError && <AlertCircle size={20} color="#e03131" strokeWidth={2.4} />}
          {!isSuccess && !isError && <Info size={20} color="#1971c2" strokeWidth={2.4} />}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              lineHeight: 1.3,
              color: isError ? "#c92a2a" : "inherit",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {toast.message}
          </div>
          {toast.subMessage && (
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary-color, #666666)",
                marginTop: "2px",
              }}
            >
              {toast.subMessage}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          title="Dismiss"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "6px",
            color: "var(--text-secondary-color, #888)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "color 0.15s ease",
          }}
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};
