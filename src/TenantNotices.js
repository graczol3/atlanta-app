import React, { useEffect, useState } from "react";
import { getAllNotices, getAllDocuments } from "./db";
import "./TenantNotices.css";

export default function TenantNotices() {
  const [notices, setNotices] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allNotices = await getAllNotices();
    const allDocuments = await getAllDocuments();

    // widoczne dla najemcy
    const visible = allNotices.filter(
      (n) => n.audience === "all" || n.audience === "tenants"
    );

    visible.sort((a, b) => new Date(b.date) - new Date(a.date));
    allDocuments.sort((a, b) => new Date(b.date) - new Date(a.date));

    setNotices(visible);
    setDocuments(allDocuments);
  };

  const pinnedNotices = notices.filter((n) => n.pinned);
  const regularNotices = notices.filter((n) => !n.pinned);

  return (
    <div className="tenant-notices-page">

      {/* ================= HEADER ================= */}
      <div className="tenant-header">
        <h1>Ogłoszenia</h1>
        <p className="subtitle">
          Aktualności i komunikaty od zarządcy
        </p>
      </div>

      {/* ================= WAŻNE ================= */}
      {pinnedNotices.length > 0 && (
        <div className="notice-card">
          <h3>📌 Ważne ogłoszenia</h3>

          <ul className="notice-list">
            {pinnedNotices.map((n) => (
              <li key={n.id} className="notice-item pinned">
                <div className="notice-info">
                  <div className="notice-title">{n.title}</div>
                  <div className="notice-meta">{n.date}</div>
                </div>

                <button
                  className="notice-btn"
                  onClick={() => setSelectedNotice(n)}
                >
                  Czytaj
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ================= WSZYSTKIE ================= */}
      <div className="notice-card">
        <h3>Wszystkie ogłoszenia ({notices.length})</h3>

        <ul className="notice-list">
          {regularNotices.map((n) => (
            <li key={n.id} className="notice-item">
              <div className="notice-info">
                <div className="notice-title">{n.title}</div>
                <div className="notice-meta">
                  {n.date} •{" "}
                  {n.audience === "all"
                    ? "Dla wszystkich"
                    : "Dla najemców"}
                </div>
              </div>

              <button
                className="notice-btn"
                onClick={() => setSelectedNotice(n)}
              >
                Czytaj
              </button>
            </li>
          ))}

          {regularNotices.length === 0 && (
            <li className="empty">Brak ogłoszeń</li>
          )}
        </ul>
      </div>

      {/* ================= DOKUMENTY ================= */}
      <div className="notice-card">
        <h3>📂 Dokumenty ({documents.length})</h3>

        <ul className="notice-list">
          {documents.map((doc) => (
            <li key={doc.id} className="notice-item">
              <div className="notice-info">
                <div className="notice-title">{doc.name}</div>
                <div className="notice-meta">
                  {doc.date} • {(doc.size / 1024).toFixed(0)} KB
                </div>
              </div>

              <button
                className="notice-btn"
                onClick={() =>
                  alert("Tutaj możesz podpiąć pobieranie pliku")
                }
              >
                Pobierz
              </button>
            </li>
          ))}

          {documents.length === 0 && (
            <li className="empty">Brak dokumentów</li>
          )}
        </ul>
      </div>

      {/* ================= MODAL ================= */}
      {selectedNotice && (
        <div
          className="notice-modal-backdrop"
          onClick={() => setSelectedNotice(null)}
        >
          <div
            className="notice-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="notice-modal-header">
              <h3>{selectedNotice.title}</h3>

              <button
                className="notice-close"
                onClick={() => setSelectedNotice(null)}
              >
                ×
              </button>
            </div>

            <div className="notice-meta">
              {selectedNotice.id} • {selectedNotice.date}
            </div>

            <div className="notice-modal-content">
              {selectedNotice.body ||
                selectedNotice.content}
            </div>
          </div>
        </div>
      )}

      {/* ================= INFO ================= */}
      <div className="notice-card">
        <h3>ℹ️ O ogłoszeniach</h3>
        <p className="notice-meta">
          Ogłoszenia są publikowane przez zarządcę budynków i
          dotyczą spraw wspólnych mieszkańców.
        </p>
        <p className="notice-meta">
          W przypadku pytań prosimy o kontakt z administracją:
          <strong> biuro@atlanta.pl</strong>
        </p>
      </div>

    </div>
  );
}
