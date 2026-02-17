import React, { useEffect, useMemo, useState } from "react";
import "./Tickets.css";
import {
  getAllTickets,
  updateTicket,
  deleteTicket
} from "./db";

const STATUS_LABELS = {
  open: "Otwarte",
  in_progress: "W trakcie",
  resolved: "Zamknięte"
};

const PRIORITY_LABELS = {
  low: "Niski",
  medium: "Średni",
  high: "Wysoki"
};

export default function Tickets() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    const data = await getAllTickets();
    setRows(data);
  };

  const filtered = useMemo(() => {
    return rows.filter(t => {
      const matchQ =
        !q ||
        t.id.toLowerCase().includes(q.toLowerCase()) ||
        t.flat.toLowerCase().includes(q.toLowerCase()) ||
        (t.tenant || "").toLowerCase().includes(q.toLowerCase()) ||
        (t.email || "").toLowerCase().includes(q.toLowerCase()) ||
        t.title.toLowerCase().includes(q.toLowerCase());

      const matchS = filterStatus === "all" || t.status === filterStatus;
      const matchP = filterPriority === "all" || t.priority === filterPriority;

      return matchQ && matchS && matchP;
    });
  }, [rows, q, filterStatus, filterPriority]);

  const setStatus = async (id, status) => {
    const t = rows.find(r => r.id === id);
    if (!t) return;
    await updateTicket({ ...t, status });
    loadTickets();
  };

  const setPriority = async (id, priority) => {
    const t = rows.find(r => r.id === id);
    if (!t) return;
    await updateTicket({ ...t, priority });
    loadTickets();
  };

  const remove = async (id) => {
    await deleteTicket(id);
    loadTickets();
  };

  return (
    <div className="admin-tickets">
      <h2>Zgłoszenia techniczne</h2>

      <div className="filters">
        <input
          placeholder="Szukaj: ID, lokal, najemca, email, opis…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />

        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">Wszystkie statusy</option>
          <option value="open">Otwarte</option>
          <option value="in_progress">W trakcie</option>
          <option value="resolved">Zamknięte</option>
        </select>

        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option value="all">Wszystkie priorytety</option>
          <option value="low">Niski</option>
          <option value="medium">Średni</option>
          <option value="high">Wysoki</option>
        </select>
      </div>

      <div className="tickets-panel">
        <div className="tickets-head">
          <div>ID</div>
          <div>Data</div>
          <div>Lokal</div>
          <div>Najemca</div>
          <div>Opis</div>
          <div>Priorytet</div>
          <div>Status</div>
          <div>Akcje</div>
        </div>

        {filtered.map(t => (
          <div className="tickets-row" key={t.id}>
            <div>{t.id}</div>
            <div>{t.date}</div>
            <div>{t.flat}</div>

            <div>
              <strong>{t.tenant || "Najemca"}</strong>
              <div className="email">{t.email || "-"}</div>
            </div>

            <div className="description">
              {t.title}
            </div>

            <div>
              <select
                className={`badge ${t.priority}`}
                value={t.priority}
                onChange={e => setPriority(t.id, e.target.value)}
              >
                <option value="low">{PRIORITY_LABELS.low}</option>
                <option value="medium">{PRIORITY_LABELS.medium}</option>
                <option value="high">{PRIORITY_LABELS.high}</option>
              </select>
            </div>

            <div>
              <select
                className={`badge ${t.status}`}
                value={t.status}
                onChange={e => setStatus(t.id, e.target.value)}
              >
                <option value="open">{STATUS_LABELS.open}</option>
                <option value="in_progress">{STATUS_LABELS.in_progress}</option>
                <option value="resolved">{STATUS_LABELS.resolved}</option>
              </select>
            </div>

            <div className="actions">
              <button className="btn light">Przypisz</button>
              <button className="btn danger" onClick={() => remove(t.id)}>
                Usuń
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="empty">Brak zgłoszeń</div>
        )}
      </div>
    </div>
  );
}
