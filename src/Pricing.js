import React from "react";
import { useNavigate } from "react-router-dom";
import "./Pricing.css";

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <div className="pricing-page">

      {/* PRZYCISK POWRÓT */}
      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Powrót
      </button>

      {/* HERO */}
      <section className="pricing-hero">
        <h1>Regulamin i warunki wynajmu</h1>
        <p>
          Zasady najmu nieruchomości oferowanych przez ATLANTA Sp. z o.o.
        </p>
      </section>

      {/* TREŚĆ REGULAMINU */}
      <section className="pricing-section">
        <div className="pricing-container">

          <div className="pricing-block">
            <h2>1. Postanowienia ogólne</h2>
            <p>
              1.1. Niniejszy regulamin określa zasady wynajmu nieruchomości
              oferowanych przez ATLANTA Sp. z o.o.
            </p>
            <p>
              1.2. Najemca zobowiązuje się do przestrzegania warunków umowy
              najmu oraz obowiązujących przepisów prawa.
            </p>
            <p>
              1.3. Zawarcie umowy najmu oznacza akceptację niniejszego regulaminu.
            </p>
          </div>

          <div className="pricing-block">
            <h2>2. Warunki finansowe</h2>
            <ul>
              <li>Czynsz płatny miesięcznie do 10 dnia każdego miesiąca.</li>
              <li>Kaucja w wysokości 1–2 miesięcznego czynszu.</li>
              <li>Media rozliczane według rzeczywistego zużycia.</li>
              <li>Opłaty administracyjne zgodnie z ustaleniami wspólnoty.</li>
            </ul>
          </div>

          <div className="pricing-block">
            <h2>3. Okres najmu</h2>
            <ul>
              <li>Minimalny okres najmu: 6 lub 12 miesięcy.</li>
              <li>Możliwość przedłużenia umowy po uzgodnieniu stron.</li>
              <li>Okres wypowiedzenia: 1 miesiąc.</li>
              <li>Rezerwacja nieruchomości wymaga wpłaty zaliczki.</li>
            </ul>
          </div>

          <div className="pricing-block">
            <h2>4. Obowiązki Najemcy</h2>
            <ul>
              <li>Utrzymanie lokalu w należytym stanie technicznym.</li>
              <li>Terminowe regulowanie opłat.</li>
              <li>Nieudostępnianie lokalu osobom trzecim bez zgody Wynajmującego.</li>
              <li>Nieprowadzenie działalności sprzecznej z prawem.</li>
            </ul>
          </div>

          <div className="pricing-block">
            <h2>5. Odpowiedzialność i szkody</h2>
            <p>
              Najemca ponosi odpowiedzialność za szkody powstałe w lokalu
              w trakcie trwania umowy, z wyłączeniem normalnego zużycia.
            </p>
            <p>
              W przypadku poważnych uszkodzeń koszty naprawy mogą zostać
              potrącone z kaucji.
            </p>
          </div>

          <div className="pricing-block">
            <h2>6. Postanowienia końcowe</h2>
            <p>
              W sprawach nieuregulowanych niniejszym regulaminem zastosowanie
              mają przepisy Kodeksu cywilnego.
            </p>
            <p>
              ATLANTA zastrzega sobie prawo do aktualizacji niniejszego
              regulaminu.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
