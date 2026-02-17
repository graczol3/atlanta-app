import React, { useEffect, useState } from "react";
import { addTicket, getAllTickets, deleteTicket } from "./db";
import Modal from "./Modal";
import "./TenantTickets.css";

/* Statusy – baza EN, UI PL */
const STATUS_LABELS = {
  open: "Otwarte",
  in_progress: "W trakcie",
  resolved: "Zamknięte"
};

export default function TenantTickets() {
  const [tickets, setTickets] = useState([]);
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("medium");

  /* ===== MODALE ===== */
  const [infoOpen, setInfoOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  /* dane najemcy */
  const tenant = JSON.parse(sessionStorage.getItem("tenant") || "{}");

  const tenantName =
    tenant.firstName && tenant.lastName
      ? `${tenant.firstName} ${tenant.lastName}`
      : tenant.email || "Najemca";

  const tenantEmail = tenant.email || "";

  const currentFlat = "A-07"; // możesz później dynamicznie podpiąć

  /* ======================
     ŁADOWANIE TYLKO MOICH ZGŁOSZEŃ
  ====================== */
  useEffect(() => {
    const loadTickets = async () => {
      const all = await getAllTickets();

      // 🔥 TERAZ KAŻDY WIDZI TYLKO SWOJE
      const myTickets = all.filter(
        t => t.email === tenantEmail
      );

      setTickets(myTickets);
    };

    if (tenantEmail) {
      loadTickets();
    }
  }, [tenantEmail]);

  /* ======================
     DODANIE ZGŁOSZENIA
  ====================== */
  const submitTicket = async (e) => {
    e.preventDefault();
    if (!desc.trim()) return;

    const ticket = {
      id: `T-${Date.now()}`,
      title: desc,
      flat: currentFlat,
      date: new Date().toISOString().slice(0, 10),
      status: "open",
      priority,
      tenant: tenantName,
      email: tenantEmail
    };

    await addTicket(ticket);

    // 🔄 odśwież tylko swoje
    const all = await getAllTickets();
    const myTickets = all.filter(
      t => t.email === tenantEmail
    );
    setTickets(myTickets);

    setDesc("");
    setPriority("medium");
    setInfoOpen(true);
  };

  /* ======================
     COFNIĘCIE ZGŁOSZENIA
  ====================== */
  const confirmDelete = (id) => {
    setConfirmId(id);
  };

  const handleDelete = async () => {
    await deleteTicket(confirmId);

    const all = await getAllTickets();
    const myTickets = all.filter(
      t => t.email === tenantEmail
    );
    setTickets(myTickets);

    setConfirmId(null);
  };

  return (
    <div className="tenant-tickets-page">
      {/* HEADER */}
      <div className="tenant-tickets-header">
        <h1>Zgłoszenia usterek</h1>
        <p className="subtitle">Zgłoś problem i śledź status naprawy</p>
      </div>

      {/* FORMULARZ */}
      <div className="ticket-card">
        <h3>Zgłoś nową usterkę</h3>

        <form className="ticket-form" onSubmit={submitTicket}>
          <div className="textarea-wrapper">
            <textarea
              placeholder="Opisz problem (max 100 znaków)"
              value={desc}
              maxLength={100}
              onChange={(e) => setDesc(e.target.value)}
              required
            />
            <div className="char-counter">
              {desc.length} / 100
            </div>
          </div>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Priorytet: Niski</option>
            <option value="medium">Priorytet: Średni</option>
            <option value="high">Priorytet: Wysoki</option>
          </select>

          <button type="submit">Wyślij zgłoszenie</button>
        </form>
      </div>

      {/* LISTA */}
      <div className="ticket-card">
        <h3>Moje zgłoszenia ({tickets.length})</h3>

        <ul className="ticket-list">
          {tickets.map(t => (
            <li key={t.id} className="ticket-item">
              <div className="ticket-left">
                <div className="ticket-title">{t.title}</div>
                <div className="ticket-meta">
                  {t.id} • {t.date} • Lokal {t.flat}
                </div>
              </div>

              <div className="ticket-right">
                <span className={`ticket-badge ${t.status}`}>
                  {STATUS_LABELS[t.status]}
                </span>

                {t.status === "open" && (
                  <button
                    className="btn-cancel"
                    onClick={() => confirmDelete(t.id)}
                  >
                    Cofnij
                  </button>
                )}
              </div>
            </li>
          ))}

          {tickets.length === 0 && (
            <li>Brak zgłoszeń</li>
          )}
        </ul>
      </div>

      {/* ===== MODAL INFO ===== */}
      <Modal
        open={infoOpen}
        title="Informacja"
        message="Zgłoszenie zostało wysłane do administracji."
        onConfirm={() => setInfoOpen(false)}
      />

      {/* ===== MODAL CONFIRM ===== */}
      <Modal
        open={confirmId !== null}
        type="confirm"
        title="Potwierdzenie"
        message="Czy na pewno chcesz cofnąć to zgłoszenie? Zostanie usunięte również u administratora."
        confirmText="Tak, cofnij"
        cancelText="Anuluj"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}
