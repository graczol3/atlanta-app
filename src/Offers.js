// Offers.js
import React, { useMemo, useState } from "react";
import "./Tenant.css";
import TenantNav from "./TenantNav";
import { useNavigate } from "react-router-dom";

const seed = [
  { id: "A-07", building: "Bud. A", rooms: 2, area: 48, type: "2-pokojowe", price: 2900, availableFrom: "2025-12-01" },
  { id: "B-12", building: "Bud. B", rooms: 3, area: 64, type: "3-pokojowe", price: 3200, availableFrom: "2025-11-20" },
  { id: "C-03", building: "Bud. C", rooms: 1, area: 28, type: "kawalerka", price: 2500, availableFrom: "2025-12-10" },
];

export default function Offers() {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [type, setType] = useState("all");
  const [from, setFrom] = useState("");
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const offers = useMemo(() => {
    return seed.filter(o => {
      const okMin = !min || o.price >= Number(min);
      const okMax = !max || o.price <= Number(max);
      const okType = type === "all" ? true : o.type === type;
      const okFrom = !from || new Date(o.availableFrom) <= new Date(from);
      return okMin && okMax && okType && okFrom;
    });
  }, [min, max, type, from]);

  const reserve = (flatId) => {
    const email = JSON.parse(sessionStorage.getItem("tenant")||"{}").email || "guest@example.com";
    const r = { id: `R-${Math.floor(Math.random()*900000)+100000}`, flat: flatId, email, date: new Date().toISOString().slice(0,10), status: "pending" };
    setBookings(prev => [r, ...prev]);
    alert("Wysłano rezerwację. Status: pending");
    // TODO: POST /api/bookings
  };

  return (
    <>
      <TenantNav />
      <div className="tenant-container">
        {/* Toolbar z powrotem do panelu */}
        <div className="tenant-toolbar">
          <button className="btn light" onClick={() => navigate('/my-places')}>
            ← Wróć do panelu
          </button>
        </div>

        <h2>Oferty</h2>

        {/* Filtry */}
        <div className="filters">
          <input type="number" placeholder="Cena od" value={min} onChange={e=>setMin(e.target.value)} />
          <input type="number" placeholder="Cena do" value={max} onChange={e=>setMax(e.target.value)} />
          <select value={type} onChange={e=>setType(e.target.value)}>
            <option value="all">Wszystkie typy</option>
            <option value="kawalerka">Kawalerka</option>
            <option value="2-pokojowe">2-pokojowe</option>
            <option value="3-pokojowe">3-pokojowe</option>
          </select>
          <input type="date" value={from} onChange={e=>setFrom(e.target.value)} />
        </div>

        {/* Lista ofert */}
        <div className="cards">
          {offers.map(o => (
            <div className="card" key={o.id}>
              <div className="title">{o.id} • {o.type}</div>
              <div className="meta">{o.building} • {o.area} m² • {o.rooms} pokoje</div>
              <div className="price">{o.price.toLocaleString()} zł/mc</div>
              <div className="avail">Dostępne od: {o.availableFrom}</div>

              <div className="actions">
                <button className="btn primary" onClick={() => reserve(o.id)}>Zarezerwuj</button>
                <button className="btn light" onClick={() => navigate('/documents')}>Dokumenty</button>
              </div>
            </div>
          ))}
        </div>

        {/* Rezerwacje wysłane w tej sesji */}
        {bookings.length > 0 && (
          <>
            <h3>Twoje zgłoszenia rezerwacyjne</h3>
            <ul className="list">
              {bookings.map(b => (
                <li key={b.id}>{b.id} • {b.flat} • {b.date} • {b.status}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
