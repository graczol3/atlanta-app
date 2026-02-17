import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./App.css";

export default function TenantLogin() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const primaryBlue = "#00234c";

  const submit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://atlanta-app.onrender.com/api/loginTEST", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: pass }),
      });

      const data = await response.json();
      console.log("LOGIN RESPONSE:", data);

      if (!response.ok || !data.success) {
        Swal.fire({
          imageUrl: "/atlanta.png",
          imageWidth: 100,
          title: "Błąd logowania",
          text: data.message || "Nieprawidłowy e-mail lub hasło!",
          confirmButtonColor: primaryBlue,
          backdrop: "rgba(0, 35, 76, 0.6)",
        });
        return;
      }

      sessionStorage.setItem(
        "tenant",
        JSON.stringify({
          email: data.user.email,
          role: data.user.role,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
        })
      );

      Swal.fire({
        imageUrl: "/atlanta.png",
        imageWidth: 120,
        title: "Zalogowano pomyślnie!",
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => navigate("/tenant/my-places"), 1500);
    } catch (error) {
      Swal.fire({
        imageUrl: "/atlanta.png",
        imageWidth: 100,
        title: "Błąd połączenia",
        text: "Serwer nie odpowiada!",
      });
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{
          position: "fixed",
          top: "25px",
          left: "25px",
          padding: "10px 18px",
          background: "rgba(255,255,255,0.9)",
          border: "1px solid #e2e8f0",
          borderRadius: "10px",
          fontWeight: "600",
          color: "#1e3a8a",
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          backdropFilter: "blur(6px)",
          zIndex: 9999,
        }}
      >
        ← Powrót
      </button>

      <div className="tenant-container">
        <div className="tenant-form-wrapper">
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <img src="/atlanta.png" alt="Atlanta Logo" style={{ width: "280px" }} />
          </div>

          <h2
            style={{
              textAlign: "center",
              marginBottom: "25px",
              color: primaryBlue,
            }}
          >
            Logowanie najemcy
          </h2>

          <form className="tenant-form" onSubmit={submit}>
            <input
              placeholder="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              placeholder="Hasło"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
              style={{ marginTop: "15px" }}
            />

            <button
              className="btn primary"
              type="submit"
              style={{ marginTop: "25px" }}
            >
              Zaloguj
            </button>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="back-link"
            >
              Nie masz konta? Zarejestruj się
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
