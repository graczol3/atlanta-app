// TenantDocuments.js
import React, { useState } from "react";
import "./Tenant.css";
import TenantNav from "./TenantNav";

const docs = [
  { id: "D-1003", title: "Regulamin najmu", type: "pdf", date: "2025-11-06" },
  { id: "D-1002", title: "Uchwała 12/2025", type: "pdf", date: "2025-11-03" },
  { id: "D-1001", title: "Rozliczenie 10/2025", type: "pdf", date: "2025-10-28" },
];

export default function TenantDocuments() {
  const [q, setQ] = useState("");
  const filtered = docs.filter(d => !q || d.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="tenant-container">
      <h2>Dokumenty</h2>
      <div className="filters">
        <input placeholder="Szukaj dokumentu…" value={q} onChange={e=>setQ(e.target.value)} />
      </div>
      <ul className="list">
        {filtered.map(d => (
          <li key={d.id}>
            {d.title} • {d.type.toUpperCase()} • {d.date}
            <button className="btn light" style={{marginLeft:8}} onClick={()=>alert("Pobierz/Podgląd")}>Otwórz</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
