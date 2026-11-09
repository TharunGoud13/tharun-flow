import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

import "./ToastNotification.scss";

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
    if (!toast) {
      return;
    }
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) {
    return null;
  }

  return (
    <div
      className={`tf-toast tf-toast--${toast.type}`}
      role="status"
      aria-live="polite"
    >
      <span className="tf-toast__icon">
        {toast.type === "success" ? (
          <CheckCircle2 size={19} strokeWidth={2.3} />
        ) : toast.type === "error" ? (
          <AlertCircle size={19} strokeWidth={2.3} />
        ) : (
          <Info size={19} strokeWidth={2.3} />
        )}
      </span>

      <span className="tf-toast__body">
        <span className="tf-toast__message">{toast.message}</span>
        {toast.subMessage && (
          <span className="tf-toast__sub">{toast.subMessage}</span>
        )}
      </span>

      <button
        type="button"
        onClick={onClose}
        title="Dismiss"
        aria-label="Dismiss notification"
        className="tf-toast__close"
      >
        <X size={14} strokeWidth={2.2} />
      </button>
    </div>
  );
};
