import React, { useMemo, useRef, useState } from "react";
import "./Tenant.css";
import TenantNav from "./TenantNav";
import { useNavigate } from "react-router-dom";

const seedBookings = [
  { id: "R-1201", flat: "B-12", date: "2025-11-09", status: "pending" },
  { id: "R-1199", flat: "A-07", date: "2025-11-02", status: "approved" },
];

const seedCurrent = { flat: "A-07", building: "Bud. A", start: "2025-11-01", end: "2026-10-31", rent: 2900 };

const seedNotices = [
  { id: "N-2003", title: "Przegląd instalacji 15.11", date: "2025-11-10", audience: "tenants", pinned: true },
  { id: "N-2002", title: "Nowe miejsca parkingowe", date: "2025-11-05", audience: "all", pinned: false },
];

// Płatności – dane przykładowe
const seedPayments = [
  { id: "P-2311-01", title: "Czynsz 11/2025", due: "2025-11-15", amount: 2900, status: "due" },
  { id: "P-2310-01", title: "Czynsz 10/2025", due: "2025-10-15", amount: 2900, status: "overdue" },
];

export default function MyPlaces() {
  const navigate = useNavigate();
  const tenant = JSON.parse(sessionStorage.getItem("tenant") || "{}");

  const [bookings, setBookings] = useState(seedBookings);
  const [current] = useState(seedCurrent);
  const [notices] = useState(seedNotices);

  // Płatności
  const [payments, setPayments] = useState(seedPayments);
  const [receipt, setReceipt] = useState(null);

  // szybkie zgłoszenie do obecnego lokalu
  const [desc, setDesc] = useState("");
  const [photoName, setPhotoName] = useState("");
  const fileRef = useRef(null);

  const submitTicket = (e) => {
    e.preventDefault();
    if (!desc) return alert("Dodaj krótki opis usterki.");
    const payload = { flat: current?.flat, desc, photoName, priority: "medium" };
    console.log("Ticket:", payload);
    alert("Zgłoszenie wysłane do administracji.");
    setDesc("");
    setPhotoName("");
    if (fileRef.current) fileRef.current.value = "";
    // TODO: FormData -> POST /api/tickets
  };

  const pendingCount = useMemo(() => bookings.filter((b) => b.status === "pending").length, [bookings]);

  // Akcje płatności (na razie symulacja)
  const pay = (pid) => {
    setPayments((prev) => prev.map((p) => (p.id === pid ? { ...p, status: "paid" } : p)));
    const paid = payments.find((p) => p.id === pid);
    setReceipt({
      id: pid,
      date: new Date().toISOString(),
      amount: paid?.amount || 0,
      method: "card",
      reference: `REF-${Math.floor(Math.random() * 900000) + 100000}`,
    });
    alert("Płatność przyjęta — status: paid");
    // TODO: Integracja z bramką (Stripe/Przelewy24) i aktualizacja po sukcesie
  };

  const viewReceipt = (pid) => {
    const paid = payments.find((p) => p.id === pid);
    if (!paid || paid.status !== "paid") return alert("Brak potwierdzenia dla nieopłaconej pozycji.");
    setReceipt({
      id: pid,
      date: new Date().toISOString(),
      amount: paid.amount,
      method: "card",
      reference: `REF-${Math.floor(Math.random() * 900000) + 100000}`,
    });
  };

  return (
    <>
      <TenantNav />
      <div className="tenant-container">
        {/* Toolbar u góry – lewa strona, spójny z /offers */}
        <div className="tenant-toolbar">
          <button className="btn light" onClick={() => navigate("/offers")}>
            Aktualne oferty
          </button>
          <button className="btn light" onClick={() => navigate("/my-contracts")}>
            Moje umowy
          </button>
        </div>

        <h2>Moje lokale</h2>

        {/* sekcja: aktualny lokal */}
        <div className="card">
          <div className="title">Aktualnie wynajmowany lokal</div>
          {current ? (
            <>
              <div className="meta">
                {current.building} • {current.flat}
              </div>
              <div className="meta">
                Okres: {current.start} → {current.end}
              </div>
              <div className="price">{current.rent.toLocaleString()} zł/mc</div>
            </>
          ) : (
            <div className="meta">Brak aktywnej umowy</div>
          )}
        </div>

        {/* sekcja: płatności */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Płatności</h3>
          <ul className="list">
            {payments.map((p) => (
              <li key={p.id}>
                {p.title} • termin: {p.due} • {p.amount.toLocaleString()} zł •
                <span className={`badge ${p.status}`} style={{ marginLeft: 6 }}>
                  {p.status}
                </span>
                <span style={{ marginLeft: 8 }} />
                {p.status !== "paid" ? (
                  <button className="btn primary" onClick={() => pay(p.id)}>
                    Opłać
                  </button>
                ) : (
                  <button className="btn light" onClick={() => viewReceipt(p.id)}>
                    Potwierdzenie
                  </button>
                )}
              </li>
            ))}
            {payments.length === 0 && <li>Brak należności.</li>}
          </ul>

          {/* podgląd potwierdzenia */}
          {receipt && (
            <div className="card" style={{ marginTop: 10 }}>
              <div className="title">Potwierdzenie płatności</div>
              <div className="meta">Id: {receipt.id}</div>
              <div className="meta">Data: {new Date(receipt.date).toLocaleString()}</div>
              <div className="meta">Kwota: {receipt.amount.toLocaleString()} zł</div>
              <div className="meta">Metoda: {receipt.method}</div>
              <div className="meta">Ref: {receipt.reference}</div>
            </div>
          )}
        </div>

        {/* sekcja: rezerwacje */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>
            Moje rezerwacje ({bookings.length}) • Oczekujące: {pendingCount}
          </h3>
          <ul className="list">
            {bookings.map((b) => (
              <li key={b.id}>
                {b.id} • {b.flat} • {b.date} • {b.status}
              </li>
            ))}
          </ul>
        </div>

        {/* sekcja: szybkie zgłoszenie usterki do bieżącego lokalu */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Zgłoś usterkę w lokalu {current?.flat || "-"}</h3>
          <form className="tenant-form" onSubmit={submitTicket}>
            <textarea
              rows={3}
              placeholder="Krótki opis usterki"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <label className="upload">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoName(e.target.files?.[0]?.name || "")}
              />
              Dodaj zdjęcie
            </label>
            {photoName && <div className="hint">Wybrano: {photoName}</div>}
            <button className="btn primary" type="submit">
              Wyślij zgłoszenie
            </button>
          </form>
        </div>

        {/* sekcja: ogłoszenia z panelu admina */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Ogłoszenia</h3>
          <ul className="list">
            {notices.map((n) => (
              <li key={n.id}>
                {n.title} • {n.date} • {n.audience}
                {n.pinned && <span style={{ marginLeft: 8 }}>📌</span>}
              </li>
            ))}
            {notices.length === 0 && <li>Brak ogłoszeń.</li>}
          </ul>
        </div>
      </div>
    </>
  );
}
