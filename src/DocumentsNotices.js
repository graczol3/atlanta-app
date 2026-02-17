import React, { useEffect, useState } from "react";
import {
  getAllNotices,
  addNotice,
  updateNotice,
  deleteNotice,
  getAllDocuments,
  addDocument,
  deleteDocument,
  updateDocument
} from "./db";
import "./DocumentsNotices.css";

export default function DocumentsNotices() {

  const [notices, setNotices] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [editingNotice, setEditingNotice] = useState(null);
  const [editingDocument, setEditingDocument] = useState(null);

  const [noticeForm, setNoticeForm] = useState({
    title: "",
    body: "",
    audience: "all",
    pinned: false
  });

  const [docDescription, setDocDescription] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const n = await getAllNotices();
    const d = await getAllDocuments();

    setNotices(n.sort((a, b) => b.date.localeCompare(a.date)));
    setDocuments(d.sort((a, b) => b.date.localeCompare(a.date)));
  };

  /* =========================
     OGŁOSZENIA
  ========================= */

  const saveNotice = async (e) => {
    e.preventDefault();
    if (!noticeForm.title.trim() || !noticeForm.body.trim()) return;

    if (editingNotice) {
      await updateNotice({
        ...editingNotice,
        ...noticeForm
      });
    } else {
      await addNotice({
        id: `N-${Date.now()}`,
        date: new Date().toISOString().slice(0,10),
        ...noticeForm
      });
    }

    setEditingNotice(null);
    setNoticeForm({
      title: "",
      body: "",
      audience: "all",
      pinned: false
    });

    loadData();
  };

  const startEdit = (notice) => {
    setEditingNotice(notice);
    setNoticeForm({
      title: notice.title,
      body: notice.body,
      audience: notice.audience,
      pinned: notice.pinned
    });
  };

  const cancelEdit = () => {
    setEditingNotice(null);
    setNoticeForm({
      title: "",
      body: "",
      audience: "all",
      pinned: false
    });
  };

  const removeNotice = async (id) => {
    await deleteNotice(id);
    loadData();
  };

  /* =========================
     DOKUMENTY
  ========================= */

  const addDoc = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    await addDocument({
      id: `D-${Date.now()}`,
      name: file.name,
      size: file.size,
      description: docDescription,
      date: new Date().toISOString().slice(0,10)
    });

    setDocDescription("");
    e.target.value = null;

    loadData();
  };

  const startEditDoc = (doc) => {
    setEditingDocument(doc);
    setDocDescription(doc.description || "");
  };

  const saveDocEdit = async () => {
    await updateDocument({
      ...editingDocument,
      description: docDescription
    });

    setEditingDocument(null);
    setDocDescription("");
    loadData();
  };

  const cancelDocEdit = () => {
    setEditingDocument(null);
    setDocDescription("");
  };

  const removeDoc = async (id) => {
    await deleteDocument(id);
    loadData();
  };

  return (
    <div className="docs-notices">

      <h2>Dokumenty i ogłoszenia</h2>

      {/* ================= OGŁOSZENIA ================= */}
      <div className="panel">
        <h3>{editingNotice ? "Edytuj ogłoszenie" : "Nowe ogłoszenie"}</h3>

        <form onSubmit={saveNotice} className="notice-form">
          <input
            type="text"
            placeholder="Tytuł"
            value={noticeForm.title}
            onChange={e => setNoticeForm(s => ({ ...s, title: e.target.value }))}
          />

          <textarea
            placeholder="Treść ogłoszenia"
            value={noticeForm.body}
            onChange={e => setNoticeForm(s => ({ ...s, body: e.target.value }))}
          />

          <div className="form-row">
            <select
              value={noticeForm.audience}
              onChange={e => setNoticeForm(s => ({ ...s, audience: e.target.value }))}
            >
              <option value="all">Wszyscy</option>
              <option value="tenants">Najemcy</option>
            </select>

            <label>
              <input
                type="checkbox"
                checked={noticeForm.pinned}
                onChange={e => setNoticeForm(s => ({ ...s, pinned: e.target.checked }))}
              />
              Przypnij
            </label>
          </div>

          <div className="form-actions">
            <button className="btn primary">
              {editingNotice ? "Zapisz zmiany" : "Opublikuj"}
            </button>

            {editingNotice && (
              <button
                type="button"
                className="btn light"
                onClick={cancelEdit}
              >
                Anuluj
              </button>
            )}
          </div>
        </form>

        <h3 style={{ marginTop: 20 }}>Lista ogłoszeń</h3>

        {notices.map(n => (
          <div key={n.id} className={`notice-item ${n.pinned ? "pinned" : ""}`}>
            <div className="notice-left">
              <strong>{n.title}</strong>
              <div className="notice-meta">
                {n.date} • {n.audience === "all" ? "Wszyscy" : "Najemcy"}
              </div>
            </div>

            <div className="notice-actions">
              <button
                className="btn light"
                onClick={() => startEdit(n)}
              >
                Edytuj
              </button>

              <button
                className="btn danger"
                onClick={() => removeNotice(n.id)}
              >
                Usuń
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= DOKUMENTY ================= */}
      <div className="panel">
        <h3>Dokumenty</h3>

        <div style={{ marginBottom: 10 }}>
          <input
            type="text"
            placeholder="Krótki opis dokumentu (opcjonalny)"
            value={docDescription}
            onChange={e => setDocDescription(e.target.value)}
            style={{ marginBottom: 8, width: "100%", padding: "8px" }}
          />
          <input type="file" onChange={addDoc} />
        </div>

        {documents.map(d => (
          <div key={d.id} className="notice-item">
            <div className="notice-left">
              <strong>{d.name}</strong>
              <div className="notice-meta">
                {d.date} • {(d.size / 1024).toFixed(0)} KB
              </div>
              {d.description && (
                <div className="notice-meta" style={{ marginTop: 4 }}>
                  {d.description}
                </div>
              )}
            </div>

            <div className="notice-actions">
              <button
                className="btn light"
                onClick={() => startEditDoc(d)}
              >
                Edytuj
              </button>

              <button
                className="btn danger"
                onClick={() => removeDoc(d.id)}
              >
                Usuń
              </button>
            </div>
          </div>
        ))}

        {editingDocument && (
          <div style={{ marginTop: 15 }}>
            <h4>Edytuj opis dokumentu</h4>

            <input
              type="text"
              value={docDescription}
              onChange={e => setDocDescription(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: 8 }}
            />

            <button className="btn primary" onClick={saveDocEdit}>
              Zapisz
            </button>

            <button
              className="btn light"
              style={{ marginLeft: 8 }}
              onClick={cancelDocEdit}
            >
              Anuluj
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
