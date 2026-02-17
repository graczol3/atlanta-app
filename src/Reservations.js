import React, { useMemo, useState, useEffect } from "react";
import "./Reservations.css";
import { updateReservation, deleteReservation } from "./db";

export default function Reservations({ reservations, setReservations }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  /* ==========================
     AUTO-FIX: payment → paid
  ========================== */
  useEffect(() => {
    setReservations(prev =>
      prev.map(r => {
        if (r.payment && r.status !== "paid") {
          const fixed = { ...r, status: "paid" };
          updateReservation(fixed);
          return fixed;
        }
        return r;
      })
    );
  }, [setReservations]);

  const translateStatus = (status) => {
    const map = {
      pending: "Oczekująca",
      approved: "Zaakceptowana",
      rejected: "Odrzucona",
      cancelled: "Anulowana przez najemcę",
      paid: "Opłacona"
    };
    return map[status] || status;
  };

  const filtered = useMemo(() => {
    return reservations.filter(r => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.user?.email?.toLowerCase().includes(q) ||
        r.flat.toLowerCase().includes(q);

      const matchesStatus =
        filter === "all" ? true : r.status === filter;

      return matchesQuery && matchesStatus;
    });
  }, [reservations, query, filter]);

  const updateStatus = async (id, status) => {
    const updated = reservations.map(r =>
      r.id === id ? { ...r, status } : r
    );

    const changed = updated.find(r => r.id === id);
    await updateReservation(changed);
    setReservations(updated);
  };

  const removeReservation = async (id) => {
    const confirmed = window.confirm(
      "Czy na pewno chcesz USUNĄĆ tę rezerwację na stałe?"
    );
    if (!confirmed) return;

    await deleteReservation(id);
    setReservations(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="reservations">
      <h2>Zarządzanie rezerwacjami</h2>

      <div className="controls">
        <input
          type="text"
          placeholder="Szukaj: ID, email, lokal…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">Wszystkie</option>
          <option value="pending">Oczekujące</option>
          <option value="approved">Zaakceptowane</option>
          <option value="rejected">Odrzucone</option>
          <option value="cancelled">Anulowane</option>
          <option value="paid">Opłacone</option>
        </select>
      </div>

      <div className="table">
        <div className="thead">
          <div>ID</div>
          <div>Data</div>
          <div>Najemca (email)</div>
          <div>Lokal</div>
          <div>Cena</div>
          <div>Status</div>
          <div>Akcja</div>
        </div>

        {filtered.map(r => (
          <div className="trow" key={r.id}>
            <div>{r.id}</div>
            <div>{r.date}</div>
            <div className="user-name">{r.user?.email}</div>
            <div>{r.flat}</div>
            <div>{r.price.toLocaleString()} zł</div>

            <div>
              <span className={`badge ${r.status}`}>
                {translateStatus(r.status)}
              </span>
            </div>

            <div className="actions">
              {r.status === "pending" ? (
                <>
                  <button
                    className="btn approve"
                    onClick={() => updateStatus(r.id, "approved")}
                  >
                    Akceptuj
                  </button>
                  <button
                    className="btn reject"
                    onClick={() => updateStatus(r.id, "rejected")}
                  >
                    Odrzuć
                  </button>
                </>
              ) : (
                <span className="done-label">Decyzja podjęta</span>
              )}

              <button
                className="btn danger"
                onClick={() => removeReservation(r.id)}
              >
                Usuń
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
