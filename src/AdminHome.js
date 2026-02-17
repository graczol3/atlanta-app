import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminHome() {
  const navigate = useNavigate();

  // Definiujemy kafelki, które mają się wyświetlać na środku strony głównej admina
  const items = [
    { key: "dashboard", title: "Statystyki", desc: "Podgląd KPI i wykresy", to: "/admin/dashboard", icon: "📊" },
    { key: "properties", title: "Nieruchomości", desc: "Lista i edycja lokali", to: "/admin/properties", icon: "🏢" },
    { key: "reservations", title: "Rezerwacje", desc: "Wnioski i akceptacje", to: "/admin/reservations", icon: "📝" },
    { key: "documents", title: "Dokumenty", desc: "Umowy i ogłoszenia", to: "/admin/documents", icon: "📄" },
    { key: "tickets", title: "Zgłoszenia", desc: "Usterki i statusy", to: "/admin/tickets", icon: "🛠️" },
    { key: "reports", title: "Raporty", desc: "Analizy i eksport", to: "/admin/reports", icon: "📈" },
    { key: "users", title: "Użytkownicy", desc: "Najemcy i role", to: "/admin/users", icon: "👥" },
  ];

  return (
    <section className="admin-dashboard-grid">
      {items.map(i => (
        <div className="admin-card-tile" key={i.key} onClick={() => navigate(i.to)}>
          <div className="tile-icon-wrap">{i.icon}</div>
          <h3 className="tile-heading">{i.title}</h3>
          <p className="tile-subtext">{i.desc}</p>
          <span className="tile-action-link">Przejdź →</span>
        </div>
      ))}
    </section>
  );
}