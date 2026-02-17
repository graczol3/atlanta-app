import React, { useMemo } from "react";
import "./TenantReservations.css";
import { addReservation, updateReservation } from "./db";

export default function TenantReservations({
  properties,
  reservations,
  setReservations
}) {
  const tenant = JSON.parse(sessionStorage.getItem("tenant") || "{}");

  /* ===============================
     TWOJE REZERWACJE
  =============================== */
  const myBookings = useMemo(
    () => reservations.filter(r => r.user?.email === tenant.email),
    [reservations, tenant.email]
  );

  const translateStatus = (status) => {
    switch (status) {
      case "pending": return "Oczekująca";
      case "approved": return "Zaakceptowana";
      case "rejected": return "Odrzucona";
      case "cancelled": return "Anulowana przez najemcę";
      case "paid": return "Opłacona";
      default: return status;
    }
  };

  /* ===============================
     🔥 SPRAWDZAMY CZY LOKAL JEST JUŻ ZAREZERWOWANY (PAID)
  =============================== */
  const isReserved = (property) => {
    return reservations.some(
      (r) =>
        r.propertyId === property.id &&
        r.status === "paid"
    );
  };

  /* ===============================
     WSZYSTKIE LOKALE (NIC NIE USUWAMY)
  =============================== */
  const availableOffers = useMemo(
    () => properties,
    [properties]
  );

  /* ===============================
     REZERWUJ LOKAL
  =============================== */
  const reserve = async (prop) => {
    const newReservation = {
      id: `R-${Date.now()}`,
      propertyId: prop.id, // 🔥 KLUCZ
      date: new Date().toISOString().slice(0, 10),
      user: {
        name: tenant.email?.split("@")[0] || "Najemca",
        email: tenant.email
      },
      flat: prop.name,
      price: prop.price,
      status: "pending"
    };

    await addReservation(newReservation);
    setReservations(prev => [newReservation, ...prev]);
  };

  /* ===============================
     ANULUJ (PENDING)
  =============================== */
  const cancelReservation = async (id) => {
    setReservations(prev =>
      prev.map(r => {
        if (r.id === id && r.status === "pending") {
          const updated = { ...r, status: "rejected" };
          updateReservation(updated);
          return updated;
        }
        return r;
      })
    );
  };

  /* ===============================
     ZREZYGNUJ (APPROVED)
  =============================== */
  const resignReservation = async (id) => {
    setReservations(prev =>
      prev.map(r => {
        if (r.id === id && r.status === "approved") {
          const updated = { ...r, status: "cancelled" };
          updateReservation(updated);
          return updated;
        }
        return r;
      })
    );
  };

  return (
    <div className="tenant-reservations-page">

      {/* ===============================
          TWOJE REZERWACJE
      =============================== */}
      <section className="panel wide">
        <h2>Twoje rezerwacje ({myBookings.length})</h2>

        {myBookings.length === 0 && (
          <p className="hint">Nie masz jeszcze żadnych rezerwacji.</p>
        )}

        <ul className="reservation-list">
          {myBookings.map(r => (
            <li key={r.id} className="reservation-row">
              <div>
                <div className="title">{r.flat}</div>
                <div className="meta">
                  ID: {r.id} • Data: {r.date}
                </div>
              </div>

              <div className="right">
                <span className={`badge ${r.status}`}>
                  {translateStatus(r.status)}
                </span>

                {r.status === "pending" && (
                  <button
                    className="btn danger"
                    onClick={() => cancelReservation(r.id)}
                  >
                    Anuluj
                  </button>
                )}

                {r.status === "approved" && (
                  <button
                    className="btn light"
                    onClick={() => resignReservation(r.id)}
                  >
                    Zrezygnuj z rezerwacji
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ===============================
          DOSTĘPNE LOKALE
      =============================== */}
      <section className="offers-section">
        <h2>Dostępne lokale</h2>

        <div className="offers-grid">
          {availableOffers.map(o => {
            const reserved = isReserved(o);

            return (
              <div className="offer-card" key={o.id}>
                <img
                  src={o.images?.[0] || "/placeholder.jpg"}
                  alt={o.name}
                  className="offer-image"
                />

                <div className="offer-body">
                  <h3>{o.name}</h3>
                  <p className="address">📍 {o.address}</p>

                  <div className="offer-meta">
                    <span>🏠 {o.type}</span>
                    <span>📐 {o.area || "—"} m²</span>
                  </div>

                  <div className="price">
                    {o.price?.toLocaleString()} zł / mc
                  </div>

                  <button
                    className="btn primary full"
                    disabled={reserved}
                    style={{
                      opacity: reserved ? 0.6 : 1,
                      cursor: reserved ? "not-allowed" : "pointer"
                    }}
                    onClick={() => !reserved && reserve(o)}
                  >
                    {reserved ? "Zarezerwowane" : "Zarezerwuj lokal"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
