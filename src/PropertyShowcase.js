import React from "react";
import { useNavigate } from "react-router-dom";
import "./PropertyShowcase.css";

export default function PropertyShowcase({ properties, reservations }) {
  const navigate = useNavigate();
 

  // ✅ POPRAWIONA LOGIKA
  const isReserved = (property) => {
    return reservations.some(
      (r) =>
        r.flat === property.name &&
        r.status === "paid"
    );
  };

  return (
    <div className="showcase-container">
      <div className="showcase-header-top">
        <button className="back-btn-dashboard" onClick={() => navigate("/")}>
          ← Powrót
        </button>
        <h1>Nieruchomości</h1>
        <p>Sprawdź aktualny status dostępnych lokali</p>
      </div>

      <div className="showcase-grid">
        {properties.map((prop) => {
          const reserved = isReserved(prop);

          return (
            <div key={prop.id} className="showcase-card">
              <div className="showcase-img-placeholder">
                {prop.images?.length > 0 ? (
                  <img
                    src={prop.images[0]}
                    alt={prop.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                ) : (
                  <span className="house-icon">🏠</span>
                )}

                {/* 🔥 STATUS */}
                {reserved && (
                  <div className="badge-reserved">
                    ZAREZERWOWANE
                  </div>
                )}

                <div className="showcase-type-tag">
                  {prop.type}
                </div>
              </div>

              <div className="showcase-details">
                <h3>{prop.name}</h3>
                <p className="showcase-address">
                  📍 {prop.address}
                </p>

                <div className="showcase-params">
                  <span><b>{prop.rooms}</b> pokoje</span>
                  <span><b>{prop.area}</b> m²</span>
                </div>

                <div className="showcase-price-section">
                  <span className="price-value">
                    {prop.price.toLocaleString()} zł
                  </span>
                  <span className="price-period"> / mies.</span>
                </div>

                <button
                  className="btn-interest"
                  disabled={reserved}
                  style={{
                    opacity: reserved ? 0.6 : 1,
                    cursor: reserved ? "not-allowed" : "pointer"
                  }}
                >
                  {reserved ? "Zarezerwowane" : "Jestem zainteresowany"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
