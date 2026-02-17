import React, { useMemo } from "react";
import "./TenantMyPlaces.css";

export default function TenantMyPlaces({ properties, reservations }) {
  const tenant = JSON.parse(sessionStorage.getItem("tenant") || "{}");

  const rentedProperties = useMemo(() => {
    return reservations
      .filter(
        r =>
          r.user?.email === tenant.email &&
          r.status === "paid"
      )
      .map(r => {
        const prop = properties.find(p => p.id === r.propertyId);
        return prop ? { ...prop, reservation: r } : null;
      })
      .filter(Boolean);
  }, [reservations, properties, tenant.email]);

  return (
    <div className="tenant-myplaces-page">
      <h1 className="page-title">
        Aktualnie wynajmowane lokale ({rentedProperties.length})
      </h1>

      {rentedProperties.length === 0 && (
        <div className="empty-box">
          Nie masz obecnie aktywnego najmu.
        </div>
      )}

      <div className="myplaces-list">
        {rentedProperties.map(p => (
          <div className="myplace-row" key={p.id}>
            
            {/* LEWA STRONA */}
            <div className="myplace-left">
              <img
                src={p.images?.[0] || "/placeholder.jpg"}
                alt={p.name}
              />

              <div className="left-info">
                <h2>{p.name}</h2>
                <p className="address">📍 {p.address}</p>

                <div className="price">
                  {p.price.toLocaleString()} zł / mc
                </div>

                <span className="status-badge">
                  ZAREZERWOWANE
                </span>
              </div>
            </div>

            {/* PRAWA STRONA */}
            <div className="myplace-right">
              <div className="info-section">
                <h3>Parametry lokalu</h3>
                <div className="info-grid">
                  <span>🏠 Typ</span><b>{p.type}</b>
                  <span>🚪 Pokoje</span><b>{p.rooms}</b>
                  <span>📐 Powierzchnia</span><b>{p.area} m²</b>
                </div>
              </div>

              <div className="info-section">
                <h3>Okres najmu</h3>
                <p>
                  {p.reservation?.startDate || "2025-11-01"} →{" "}
                  {p.reservation?.endDate || "2026-10-31"}
                </p>
              </div>

              <div className="info-section">
                <h3>Informacje organizacyjne</h3>
                <ul>
                  <li>🔑 Dostęp do kluczy: Portiernia, pok. 101</li>
                  <li>📦 Skrytka pocztowa: {p.name}</li>
                  <li>🚗 Miejsce parkingowe: —</li>
                  <li>🏢 Zarządca: Jan Kowalski</li>
                  <li>📞 Tel. kontaktowy: 123-456-789</li>
                </ul>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
