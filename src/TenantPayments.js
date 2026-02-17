import React, { useMemo, useState } from "react";
import { updateReservation } from "./db";

export default function TenantPayments({
  reservations,
  setReservations,
  properties,
  setProperties
}) {
  const tenant = JSON.parse(sessionStorage.getItem("tenant") || "{}");
  const [paymentModal, setPaymentModal] = useState(null);

  /* ==========================
     DO ZAPŁATY
  ========================== */
  const toPay = useMemo(
    () =>
      reservations.filter(
        r =>
          r.user?.email === tenant.email &&
          r.status === "approved"
      ),
    [reservations, tenant.email]
  );

  const totalToPay = toPay.reduce(
    (sum, r) => sum + (r.price || 0),
    0
  );

  /* ==========================
     HISTORIA PŁATNOŚCI
  ========================== */
  const history = useMemo(
    () =>
      reservations.filter(
        r =>
          r.user?.email === tenant.email &&
          r.status === "paid" &&
          r.payment
      ),
    [reservations, tenant.email]
  );

  /* ==========================
     PŁATNOŚĆ
  ========================== */
  const payNow = (reservation) => {
    const updatedReservation = {
      ...reservation,
      status: "paid",
      payment: {
        paidAt: new Date().toISOString(),
        amount: reservation.price,
        method: "online"
      }
    };

    // 1️⃣ aktualizacja rezerwacji (UI)
    setReservations(prev =>
      prev.map(r =>
        r.id === reservation.id ? updatedReservation : r
      )
    );

    // 2️⃣ zapis do IndexedDB
    updateReservation(updatedReservation);

    // 3️⃣ 🔥 KLUCZOWE – oznacz TYLKO JEDNĄ nieruchomość
    setProperties(prev =>
      prev.map(p =>
        p.id === reservation.propertyId
          ? { ...p, reserved: true }
          : p
      )
    );

    setPaymentModal(null);
    alert("Płatność zakończona sukcesem ✅");
  };

  return (
    <div>
      <div className="tenant-header">
        <div>
          <h1>Płatności</h1>
          <p className="subtitle">
            Opłać zaakceptowane rezerwacje
          </p>
        </div>
      </div>

      {/* PODSUMOWANIE */}
      <div className="tenant-card">
        <h3>Podsumowanie</h3>
        <div>
          <strong>Do zapłaty:</strong>{" "}
          <span
            style={{
              color: totalToPay > 0 ? "#dc2626" : "#16a34a",
              fontWeight: 800,
              fontSize: 22
            }}
          >
            {totalToPay.toLocaleString()} zł
          </span>
        </div>
      </div>

      {/* DO ZAPŁATY */}
      <div className="tenant-card">
        <h3>Do zapłaty</h3>

        {toPay.length === 0 && <p>Brak płatności 🎉</p>}

        {toPay.map(r => (
          <div
            key={r.id}
            className="tenant-list-item"
          >
            <div>
              <strong>{r.flat}</strong>
              <div className="meta">ID: {r.id}</div>
              <div className="meta">
                {r.price.toLocaleString()} zł
              </div>
            </div>

            <button
              className="btn primary"
              onClick={() => setPaymentModal(r)}
            >
              Zapłać
            </button>
          </div>
        ))}
      </div>

      {/* HISTORIA */}
      <div className="tenant-card">
        <h3>Historia płatności</h3>

        {history.length === 0 && <p>Brak historii.</p>}

        {history.map(r => (
          <div
            key={r.id}
            className="tenant-list-item"
          >
            <div>
              <strong>{r.flat}</strong>
              <div className="meta">
                Opłacono:{" "}
                {new Date(
                  r.payment.paidAt
                ).toLocaleString("pl-PL")}
              </div>
              <div className="meta">
                Kwota:{" "}
                {r.payment.amount.toLocaleString()} zł
              </div>
            </div>

            <span className="badge paid">
              Opłacone
            </span>
          </div>
        ))}
      </div>

      {/* MODAL PŁATNOŚCI */}
      {paymentModal && (
        <div className="payment-modal">
          <div className="box">
            <h3>Płatność online</h3>
            <p>{paymentModal.flat}</p>
            <p>
              <strong>
                {paymentModal.price.toLocaleString()} zł
              </strong>
            </p>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn light"
                onClick={() => setPaymentModal(null)}
              >
                Anuluj
              </button>
              <button
                className="btn primary"
                onClick={() => payNow(paymentModal)}
              >
                Zapłać teraz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
