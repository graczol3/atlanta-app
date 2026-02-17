import React from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page">

      {/* PRZYCISK POWROTU */}
      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Powrót
      </button>

      {/* HERO */}
      <section className="about-hero">
        <div className="about-container">
          <h1>O nas</h1>
          <p>
            Atlanta to nowoczesna firma zajmująca się kompleksowym zarządzaniem
            nieruchomościami. Łączymy doświadczenie, technologię i
            profesjonalizm.
          </p>
        </div>
      </section>

      {/* MISJA */}
      <section className="about-section">
        <div className="about-container">
          <h2>Nasza misja</h2>
          <p>
            Naszym celem jest uproszczenie zarządzania nieruchomościami
            poprzez nowoczesne narzędzia cyfrowe. Pomagamy właścicielom
            kontrolować umowy, płatności, zgłoszenia techniczne i dokumentację
            w jednym intuicyjnym systemie.
          </p>
        </div>
      </section>

      {/* CO NAS WYRÓŻNIA */}
      <section className="about-section light">
        <div className="about-container">
          <h2>Dlaczego Atlanta?</h2>

          <div className="about-grid">
            <div className="about-card">
              <h3>📊 Pełna kontrola</h3>
              <p>
                Monitoruj płatności, rezerwacje i zgłoszenia techniczne w
                czasie rzeczywistym.
              </p>
            </div>

            <div className="about-card">
              <h3>🔒 Bezpieczeństwo</h3>
              <p>
                Dane przechowywane w bezpiecznym środowisku z kontrolą
                dostępu i wersjonowaniem dokumentów.
              </p>
            </div>

            <div className="about-card">
              <h3>⚡ Automatyzacja</h3>
              <p>
                Automatyczne przypomnienia, generowanie dokumentów i raporty
                finansowe w kilka sekund.
              </p>
            </div>

            <div className="about-card">
              <h3>🤝 Profesjonalne wsparcie</h3>
              <p>
                Zespół specjalistów z doświadczeniem w zarządzaniu
                nieruchomościami komercyjnymi i mieszkaniowymi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATYSTYKI */}
      <section className="about-section">
        <div className="about-container">
          <h2>Zaufali nam</h2>

          <div className="about-stats">
            <div>
              <h3>150+</h3>
              <p>Zarządzanych lokali</p>
            </div>
            <div>
              <h3>98%</h3>
              <p>Zadowolonych klientów</p>
            </div>
            <div>
              <h3>24/7</h3>
              <p>Wsparcie techniczne</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
