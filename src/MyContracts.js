// MyContracts.js
import React, { useMemo, useState } from "react";
import "./Tenant.css";
import TenantNav from "./TenantNav";


const seedContracts = [
  { id: "C-2025-001", flat: "A-07", start: "2025-11-01", end: "2026-10-31", rent: 2900, file: "/files/C-2025-001.pdf", status: "active" },
  { id: "C-2024-042", flat: "B-12", start: "2024-01-01", end: "2024-12-31", rent: 2700, file: "/files/C-2024-042.pdf", status: "archived" },
];

export default function MyContracts() {
  const tenant = JSON.parse(sessionStorage.getItem("tenant") || "{}");
  const [contracts] = useState(seedContracts);

  const mine = useMemo(() => {
    // tu można filtrować po tenant.email, jeśli kontrakty mają pole email
    return contracts;
  }, [contracts]);

  return (
    <>
      <TenantNav />
      <div className="tenant-container">
        <h2>Moje umowy</h2>
        <div className="panel">
          <ul className="list">
            {mine.map(c => (
              <li key={c.id}>
                {c.id} • lokal {c.flat} • {c.start} → {c.end} • {c.rent.toLocaleString()} zł/mc • {c.status}
                <a className="btn light" href={c.file} target="_blank" rel="noreferrer" style={{ marginLeft: 8 }}>
                  Podgląd
                </a>
              </li>
            ))}
            {mine.length === 0 && <li>Brak umów.</li>}
          </ul>
        </div>
      </div>
    </>
  );
}
