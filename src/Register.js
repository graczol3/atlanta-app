import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; 
import "./App.css";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const API_URL = "https://atlanta-app.onrender.com"; // 🔥 BACKEND URL

  const handleNameChange = (val, setter) => {
    const onlyLetters = val.replace(/[^a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]/g, "");
    setter(onlyLetters);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (firstName.length < 2 || lastName.length < 2) {
      return Swal.fire('Błąd', 'Imię i nazwisko muszą mieć min. 2 litery', 'warning');
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return Swal.fire({
        title: 'Słabe hasło!',
        html: `<div style="text-align: left;">Hasło musi zawierać:<br>
               • Minimum 8 znaków<br>
               • Przynajmniej jedną dużą literę<br>
               • Przynajmniej jedną cyfrę<br>
               • Przynajmniej jeden znak specjalny (@$!%*?&)</div>`,
        icon: 'warning'
      });
    }

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Swal.fire('Sukces!', 'Konto utworzone pomyślnie.', 'success');
        navigate("/login"); 
      } else {
        Swal.fire('Błąd', data.message || 'Rejestracja nie powiodła się', 'error');
      }
    } catch (err) {
      console.error("Błąd rejestracji:", err);
      Swal.fire('Błąd', 'Brak połączenia z serwerem', 'error');
    }
  };

  return (
    <div className="tenant-container">

      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          padding: "10px 16px",
          background: "#ffffff",
          border: "1px solid #cbd5e1",
          borderRadius: "8px",
          fontWeight: "600",
          color: "#1e3a8a",
          cursor: "pointer",
          transition: "0.2s ease"
        }}
        onMouseOver={e => e.currentTarget.style.background = "#f1f5f9"}
        onMouseOut={e => e.currentTarget.style.background = "#ffffff"}
      >
        ← Powrót
      </button>

      <div className="tenant-form-wrapper">

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img 
            src="/atlanta.png" 
            alt="Atlanta Logo" 
            style={{ width: '280px', height: 'auto' }} 
          />
        </div>

        <h2 style={{ textAlign: 'center', color: '#00234c' }}>
          Załóż konto najemcy
        </h2>
        
        <form className="tenant-form" onSubmit={handleRegister}>
          <input 
            placeholder="Imię" 
            type="text" 
            value={firstName} 
            onChange={e => handleNameChange(e.target.value, setFirstName)}
            required
          />
          <input 
            placeholder="Nazwisko" 
            type="text" 
            value={lastName} 
            onChange={e => handleNameChange(e.target.value, setLastName)}
            required
          />
          
          <input 
            placeholder="E-mail" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input 
            placeholder="Hasło" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            required
          />
          
          <p style={{ fontSize: '11px', color: '#666', marginTop: '-10px' }}>
            Hasło: min. 8 znaków, duża litera, cyfra i znak specjalny.
          </p>

          <button className="btn primary" type="submit">
            Zarejestruj się
          </button>
          
          <button
            type="button"
            className="back-link"
            onClick={() => navigate("/login")}
          >
            Masz już konto? Zaloguj się
          </button>
        </form>
      </div>
    </div>
  );
}
