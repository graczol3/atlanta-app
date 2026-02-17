import React from "react";
import "./Modal.css";

export default function Modal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Anuluj",
  type = "info" // info | confirm
}) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-logo">ATLANTA</div>

        <h3>{title}</h3>
        <p>{message}</p>

        <div className="modal-actions">
          {type === "confirm" && (
            <button
              className="modal-btn light"
              onClick={onCancel}
            >
              {cancelText}
            </button>
          )}

          <button
            className="modal-btn primary"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
