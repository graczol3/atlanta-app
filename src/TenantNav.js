import React from "react";
import { useNavigate } from "react-router-dom";
import "./Tenant.css";

export default function TenantNav() {
  const navigate = useNavigate();
  // Pobieramy dane użytkownika z sesji
  const user = JSON.parse(sessionStorage.getItem("tenant") || "{}");

  const logout = () => {
    sessionStorage.removeItem("tenant");
    navigate("/", { replace: true });
  };

  return (
    <nav className="tenant-nav-wrapper">
      {/* Puste miejsce po lewej zamiast loga */}
      <div className="nav-left-empty"></div>

      {/* Prawa strona - Imię i Wyloguj */}
      <div className="nav-user-info">
        <span className="nav-user-name">
          {user.FirstName || "Użytkownik"}
        </span>

        <button 
          className="btn light" 
          onClick={logout}
          style={{ padding: '8px 20px' }}
        >
          Wyloguj
        </button>
      </div>
    </nav>
  );
}