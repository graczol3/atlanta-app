import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./TenantPanel.css";

import TenantMyPlaces from "./TenantMyPlaces";
import TenantPayments from "./TenantPayments";
import TenantReservations from "./TenantReservations";
import TenantTickets from "./TenantTickets";
import TenantNotices from "./TenantNotices";
import TenantProfile from "./TenantProfile";

export default function TenantPanel({
  properties,
  setProperties,
  reservations,
  setReservations
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const tenant = JSON.parse(sessionStorage.getItem("tenant") || "{}");

  const fullName =
    tenant.firstName && tenant.lastName
      ? `${tenant.firstName} ${tenant.lastName}`
      : tenant.email || "Najemca";

  const avatarLetter =
    tenant.firstName?.[0]?.toUpperCase() ||
    tenant.lastName?.[0]?.toUpperCase() ||
    tenant.email?.[0]?.toUpperCase() ||
    "N";

  const logout = () => {
    sessionStorage.removeItem("tenant");
    navigate("/", { replace: true });
  };

  // ✅ MÓJ PROFIL JAKO PIERWSZY
  const menuItems = [
    { path: "/tenant/profile", label: "👤 Mój profil" },
    { path: "/tenant/my-places", label: "🏠 Moje lokale" },
    { path: "/tenant/payments", label: "💳 Płatności" },
    { path: "/tenant/reservations", label: "📝 Rezerwacje" },
    { path: "/tenant/tickets", label: "🛠️ Zgłoszenia usterek" },
    { path: "/tenant/notices", label: "📢 Ogłoszenia" },
  ];

  return (
    <div className="tenant-layout">
      {/* SIDEBAR */}
      <aside className="tenant-sidebar">
        <div className="brand">
          <div className="brand-name">Atlanta Najemca</div>
        </div>

        <nav className="menu">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`menu-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="tenant-main">
        {/* TOPBAR */}
        <div className="tenant-topbar">
          <div className="tenant-topbar-spacer"></div>

          <div className="tenant-profile-menu">
            <div
              className="tenant-user"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="avatar">{avatarLetter}</div>
              <div>
                <div className="name">{fullName}</div>
                <div className="role">Klient</div>
              </div>
            </div>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <button
                  className="dropdown-item logout"
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                >
                  🚪 Wyloguj
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ROUTING */}
        <Routes>
          <Route
            path="/my-places"
            element={
              <TenantMyPlaces
                properties={properties}
                reservations={reservations}
              />
            }
          />

          <Route
            path="/payments"
            element={
              <TenantPayments
                reservations={reservations}
                setReservations={setReservations}
                properties={properties}
                setProperties={setProperties}
              />
            }
          />

          <Route
            path="/reservations"
            element={
              <TenantReservations
                properties={properties}
                reservations={reservations}
                setReservations={setReservations}
              />
            }
          />

          <Route path="/tickets" element={<TenantTickets />} />
          <Route path="/notices" element={<TenantNotices />} />
          <Route path="/profile" element={<TenantProfile />} />

          <Route
            path="/"
            element={
              <TenantMyPlaces
                properties={properties}
                reservations={reservations}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}
