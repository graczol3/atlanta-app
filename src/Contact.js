import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Contact.css";

export default function Contact() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Wiadomość została wysłana (demo).");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-page">

      {/* 🔙 PRZYCISK POWRÓT */}
      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Powrót
      </button>

      {/* HERO */}
      <section className="contact-hero">
        <h1>Skontaktuj się z nami</h1>
        <p>
          Masz pytania dotyczące zarządzania nieruchomościami?
          Chętnie pomożemy.
        </p>
      </section>

      {/* CONTENT */}
      <section className="contact-content">

        {/* LEWA STRONA – DANE FIRMY */}
        <div className="contact-info">
          <h2>Dane kontaktowe</h2>

          <div className="contact-card">
            <h3>ATLANTA Sp. z o.o.</h3>
            <p>ul. Przykładowa 15</p>
            <p>00-100 Warszawa</p>
          </div>

          <div className="contact-card">
            <h3>Telefon</h3>
            <p>+48 500 600 700</p>
          </div>

          <div className="contact-card">
            <h3>Email</h3>
            <p>kontakt@atlanta.pl</p>
          </div>

          <div className="contact-card">
            <h3>Godziny pracy</h3>
            <p>Pon – Pt: 8:00 – 17:00</p>
            <p>Sob – Nd: Zamknięte</p>
          </div>
        </div>

        {/* PRAWA STRONA – FORMULARZ */}
        <div className="contact-form-section">
          <h2>Napisz do nas</h2>

          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Imię i nazwisko"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />

            <input
              type="email"
              placeholder="Adres e-mail"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />

            <textarea
              placeholder="Wiadomość"
              rows="5"
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              required
            />

            <button type="submit" className="btn primary">
              Wyślij wiadomość
            </button>
          </form>
        </div>

      </section>
    </div>
  );
}
