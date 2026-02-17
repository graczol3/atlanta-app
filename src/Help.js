import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Help.css";

export default function Help() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Jak założyć konto w systemie?",
      answer:
        "Kliknij przycisk „Zarejestruj się” na stronie głównej i wypełnij formularz rejestracyjny. Po zatwierdzeniu będziesz mógł zalogować się do panelu użytkownika."
    },
    {
      question: "Jak zarezerwować lokal?",
      answer:
        "Po zalogowaniu przejdź do sekcji „Rezerwacje”, wybierz interesujący lokal i kliknij „Zarezerwuj lokal”. Status rezerwacji możesz śledzić w swoim panelu."
    },
    {
      question: "Jak zgłosić usterkę?",
      answer:
        "W panelu najemcy przejdź do zakładki „Zgłoszenia usterek”, opisz problem i wyślij formularz. Administracja otrzyma powiadomienie."
    },
    {
      question: "Gdzie znajdę swoje dokumenty?",
      answer:
        "Dokumenty dostępne są w zakładce „Ogłoszenia i dokumenty” w panelu najemcy. Znajdziesz tam umowy, aneksy i komunikaty od administracji."
    },
    {
      question: "Jak skontaktować się z administracją?",
      answer:
        "Możesz skorzystać z formularza kontaktowego w zakładce „Kontakt” lub wysłać wiadomość bezpośrednio na adres kontakt@atlanta.pl."
    }
  ];

  return (
    <div className="help-page">

      {/* PRZYCISK POWROTU */}
      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Powrót
      </button>

      {/* HERO */}
      <section className="help-hero">
        <h1>Centrum pomocy</h1>
        <p>
          Znajdź odpowiedzi na najczęściej zadawane pytania
          dotyczące systemu Atlanta.
        </p>
      </section>

      {/* FAQ */}
      <section className="help-faq">
        <div className="help-container">
          <h2>Najczęściej zadawane pytania</h2>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => toggle(index)}
                >
                  {faq.question}
                  <span>{openIndex === index ? "−" : "+"}</span>
                </button>

                {openIndex === index && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KONTAKT */}
      <section className="help-contact">
        <div className="help-container">
          <h2>Nadal potrzebujesz pomocy?</h2>
          <p>
            Skontaktuj się z naszym zespołem wsparcia — odpowiemy
            tak szybko, jak to możliwe.
          </p>

          <button
            className="btn primary"
            onClick={() => navigate("/kontakt")}
          >
            Przejdź do kontaktu
          </button>
        </div>
      </section>

    </div>
  );
}
