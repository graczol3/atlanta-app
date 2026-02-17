import React from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import "./AdminPanel.css";

import Dashboard from "./Dashboard";
import Properties from "./Properties";
import Reservations from "./Reservations";
import DocumentsNotices from "./DocumentsNotices";
import ReportsAnalytics from "./ReportsAnalytics";
import Tickets from "./Tickets";
import UsersRoles from "./UsersRoles";
import AdminHome from "./AdminHome";

export default function AdminPanel({
  properties,
  setProperties,
  reservations,
  setReservations,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { title: "Panel Główny", to: "/admin", icon: "🏠" },
    { title: "Statystyki", to: "/admin/dashboard", icon: "📊" },
    { title: "Nieruchomości", to: "/admin/properties", icon: "🏢" },
    { title: "Rezerwacje", to: "/admin/reservations", icon: "📝" },
    { title: "Ogłoszenia", to: "/admin/documents", icon: "📢" },
    { title: "Zgłoszenia", to: "/admin/tickets", icon: "🛠️" },
    { title: "Raporty", to: "/admin/reports", icon: "📈" },
    { title: "Użytkownicy", to: "/admin/users", icon: "👥" },
  ];

  const isHome = location.pathname === "/admin";

  return (
    <div className="admin-outer-container">
      <div className="admin-layout-main">
        {/* SIDEBAR */}
        <aside className="admin-sidebar-nav">
          <div className="brand-header">
            <span className="brand-title">Atlanta Admin</span>
          </div>

          <nav className="vertical-menu">
            {items.map((item) => (
              <button
                key={item.to}
                className={`menu-link-item ${
                  location.pathname === item.to ? "active" : ""
                }`}
                onClick={() => navigate(item.to)}
              >
                {item.icon} {item.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* CONTENT */}
        <main className="admin-view-port">
          {/* PASEK ADMINA */}
          <div
            className="admin-profile-info"
            style={{
              justifyContent: "flex-end",
              marginBottom: isHome ? "30px" : "10px",
            }}
          >
            <div className="user-circle">AD</div>
            <span>Administrator</span>

            <div className="admin-sticky-actions">
              <button
                className="nav-btn-alt"
                onClick={() => navigate("/")}
              >
                Strona główna
              </button>
              <button
                className="nav-btn-alt logout-red"
                onClick={() => navigate("/admin/login")}
              >
                Wyloguj się
              </button>
            </div>
          </div>

          {/* HEADER – tylko /admin */}
          {isHome && (
            <header className="admin-main-header">
              <div>
                <h1>Panel Główny</h1>
                <p className="subtitle-text">System zarządzania Atlanta</p>
              </div>
            </header>
          )}

          {/* ROUTING */}
          <section className="admin-content-area">
            <Routes>
              <Route path="/" element={<AdminHome />} />

              {/* 🔥 KLUCZOWA ZMIANA */}
              <Route
                path="dashboard"
                element={<Dashboard reservations={reservations} />}
              />

              <Route
                path="properties"
                element={
                  <Properties
                    properties={properties}
                    setProperties={setProperties}
                  />
                }
              />

              <Route
                path="reservations"
                element={
                  <Reservations
                    reservations={reservations}
                    setReservations={setReservations}
                  />
                }
              />

              <Route path="documents" element={<DocumentsNotices />} />
              <Route path="reports" element={<ReportsAnalytics />} />
              <Route path="tickets" element={<Tickets />} />
              <Route path="users" element={<UsersRoles />} />
            </Routes>
          </section>
        </main>
      </div>
    </div>
  );
}
