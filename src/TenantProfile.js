// TenantProfile.js
import React, { useState, useEffect } from "react";

export default function TenantProfile() {
  const tenant = JSON.parse(sessionStorage.getItem("tenant") || "{}");

  const [profile, setProfile] = useState({
    email: tenant.email || "",
    firstName: tenant.firstName || "",
    lastName: tenant.lastName || "",
    phone: "",
    address: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    paymentReminders: true,
    maintenanceAlerts: true,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ================= POBIERANIE PROFILU =================
  useEffect(() => {
    if (!tenant.email) return;

    fetch(`http://127.0.0.1:5001/api/profile/${encodeURIComponent(tenant.email)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProfile({
            email: data.user.Email,
            firstName: data.user.FirstName || "",
            lastName: data.user.LastName || "",
            phone: data.user.Phone || "",
            address: data.user.Address || "",
          });
        }
      })
      .catch(err => console.error("Błąd pobierania profilu:", err));
  }, [tenant.email]);

  // ================= AKTUALIZACJA PROFILU =================
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5001/api/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem(
          "tenant",
          JSON.stringify({
            ...tenant,
            firstName: profile.firstName,
            lastName: profile.lastName,
          })
        );

        alert("Profil został zapisany w bazie danych!");
      } else {
        alert("Błąd zapisu danych.");
      }

    } catch (err) {
      console.error("Błąd zapisu:", err);
      alert("Serwer nie odpowiada.");
    }
  };

  // ================= ZMIANA HASŁA =================
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Nowe hasło i potwierdzenie nie są identyczne!");
      return;
    }

    if (passwords.newPassword.length < 8) {
      alert("Hasło musi mieć minimum 8 znaków!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5001/api/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Hasło zostało zmienione w bazie danych!");
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        alert(data.message || "Błąd zmiany hasła.");
      }

    } catch (err) {
      console.error("Błąd zmiany hasła:", err);
      alert("Serwer nie odpowiada.");
    }
  };

  // ================= USUWANIE KONTA =================
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "⚠️ Czy na pewno chcesz usunąć konto? Tej operacji nie można cofnąć!"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch("http://127.0.0.1:5001/api/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: profile.email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Konto zostało usunięte.");
        sessionStorage.clear();
        window.location.href = "/";
      } else {
        alert(data.message || "Błąd usuwania konta.");
      }

    } catch (err) {
      console.error("Błąd usuwania:", err);
      alert("Serwer nie odpowiada.");
    }
  };

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePhoneChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 12);
    setProfile({ ...profile, phone: onlyDigits });
  };

  return (
    <div>
      <div className="tenant-header">
        <div>
          <h1>Mój profil</h1>
          <p className="subtitle">Zarządzaj swoim kontem i ustawieniami</p>
        </div>
      </div>

      {/* ================= DANE OSOBOWE ================= */}
      <div className="tenant-card">
        <h3>Dane osobowe</h3>

        <form className="tenant-form" onSubmit={handleProfileUpdate}>
          <div className="form-grid">
            <div className="form-group">
              <label>Imię</label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) =>
                  setProfile({ ...profile, firstName: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Nazwisko</label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) =>
                  setProfile({ ...profile, lastName: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" value={profile.email} disabled />
          </div>

          <div className="form-group">
            <label>Telefon</label>
            <input
              type="tel"
              placeholder="Wpisz numer telefonu"
              value={profile.phone}
              onChange={handlePhoneChange}
              maxLength={12}
            />
          </div>

          <div className="form-group">
            <label>Adres zamieszkania</label>
            <textarea
              rows="3"
              placeholder="Wpisz pełny adres zamieszkania"
              value={profile.address}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
              style={{ resize: "vertical", minHeight: "70px", maxHeight: "150px" }}
            />
          </div>

          <button className="btn primary" type="submit">
            Zapisz zmiany
          </button>
        </form>
      </div>

      {/* ================= ZMIANA HASŁA ================= */}
      <div className="tenant-card">
        <h3>Zmiana hasła</h3>

        <form className="tenant-form" onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label>Obecne hasło</label>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, currentPassword: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Nowe hasło</label>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Potwierdź nowe hasło</label>
            <input
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
              required
            />
          </div>

          <button className="btn primary" type="submit">
            Zmień hasło
          </button>
        </form>
      </div>

      {/* ================= POWIADOMIENIA ================= */}
      <div className="tenant-card">
        <h3>Ustawienia powiadomień</h3>

        <div className="notification-list">
          <label><input type="checkbox" checked={notifications.emailNotifications} onChange={() => handleNotificationToggle("emailNotifications")} /> 📧 Powiadomienia email</label>
          <label><input type="checkbox" checked={notifications.smsNotifications} onChange={() => handleNotificationToggle("smsNotifications")} /> 📱 Powiadomienia SMS</label>
          <label><input type="checkbox" checked={notifications.paymentReminders} onChange={() => handleNotificationToggle("paymentReminders")} /> 💳 Przypomnienia o płatnościach</label>
          <label><input type="checkbox" checked={notifications.maintenanceAlerts} onChange={() => handleNotificationToggle("maintenanceAlerts")} /> 🔧 Powiadomienia o konserwacjach</label>
        </div>
      </div>

      {/* ================= INFORMACJE O KONCIE ================= */}
      <div className="tenant-card">
        <h3>Informacje o koncie</h3>

        <div className="meta"><strong>ID Najemcy:</strong> #{Math.floor(Math.random() * 900000) + 100000}</div>
        <div className="meta"><strong>Data rejestracji:</strong> 2025-01-15</div>
        <div className="meta"><strong>Status konta:</strong> <span className="badge approved">Aktywne</span></div>
        <div className="meta"><strong>Typ konta:</strong> Najemca standardowy</div>
      </div>

      {/* ================= ZARZĄDZANIE KONTEM ================= */}
      <div className="tenant-card">
        <h3>Zarządzanie kontem</h3>

        <div className="account-actions">
          <button className="btn light">📥 Eksportuj moje dane</button>
          <button className="btn light">💬 Kontakt z obsługą</button>
          <button className="btn danger" onClick={handleDeleteAccount}>
            🗑️ Usuń konto
          </button>
        </div>
      </div>
    </div>
  );
}
