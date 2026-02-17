import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; 
import "./App.css";

export default function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const navigate = useNavigate();

const handleLogin = async (e) => {
e.preventDefault();
try {
const response = await fetch('https://atlanta-app.onrender.com', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ email, password }),
});

const data = await response.json();

if (response.ok && data.success) {
// Zapisujemy dane do sesji ZANIM wyskoczy alert
sessionStorage.setItem("admin", JSON.stringify(data.admin));

// Używamy .then(), aby przekierować DOPIERO GDY alert zniknie
Swal.fire({
imageUrl: '/atlanta.png',
imageWidth: 120,
title: 'Witaj Administratorze!',
text: 'Logowanie powiodło się.',
showConfirmButton: false,
timer: 1500
}).then(() => {
console.log("Alert zamknięty, przekierowuję do /admin...");
navigate("/admin"); 
});

} else {
Swal.fire({
title: 'Błąd',
text: data.message || 'Nieprawidłowe dane',
icon: 'error'
});
}
} catch (err) {
console.error("Błąd logowania:", err);
Swal.fire({ title: 'Błąd', text: 'Serwer nie odpowiada', icon: 'error' });
}
};

return (
<div className="tenant-container">
<div className="tenant-form-wrapper">
<div style={{ textAlign: 'center', marginBottom: '40px' }}>
<img 
src="/atlanta.png" 
alt="Atlanta Logo" 
style={{ width: '280px', height: 'auto' }} 
/>
</div>

<h2 style={{ textAlign: 'center', marginBottom: '10px', fontWeight: '800', color: '#1e3a8a' }}>
PANEL ADMINISTRATORA
</h2>
<p style={{ textAlign: 'center', marginBottom: '25px', color: '#666' }}>
Zarządzanie nieruchomościami ATLANTA
</p>

<form className="tenant-form" onSubmit={handleLogin}>
<input 
placeholder="Login / E-mail" 
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
<button className="btn primary" type="submit">
Zaloguj do systemu
</button>

<button 
type="button" 
className="back-link" 
onClick={() => navigate("/")}
style={{ marginTop: '20px', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
>
← Wróć do strony głównej
</button>
</form>
</div>
</div>
);
}