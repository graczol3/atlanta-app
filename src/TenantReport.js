// TenantReport.js
import React, { useRef, useState } from "react";
import "./Tenant.css";
import TenantNav from "./TenantNav";

export default function TenantReport() {
  const [flat, setFlat] = useState("");
  const [desc, setDesc] = useState("");
  const [photoName, setPhotoName] = useState("");
  const fileRef = useRef(null);

  const submit = e => {
    e.preventDefault();
    if (!flat || !desc) return alert("Uzupełnij lokal i opis.");
    const payload = { flat, desc, photoName, priority: "medium" };
    console.log("Send ticket:", payload);
    alert("Zgłoszenie wysłane.");
    // TODO: wyślij FormData na POST /api/tickets
    setFlat(""); setDesc(""); setPhotoName(""); if (fileRef.current) fileRef.current.value="";
  };

  return (
    <div className="tenant-container">
      <h2>Zgłoś usterkę</h2>
      <form className="tenant-form" onSubmit={submit}>
        <input placeholder="Lokal (np. A-07)" value={flat} onChange={e=>setFlat(e.target.value)} />
        <textarea rows={4} placeholder="Opis usterki" value={desc} onChange={e=>setDesc(e.target.value)} />
        <label className="upload">
          <input ref={fileRef} type="file" accept="image/*"
                 onChange={e=>setPhotoName(e.target.files?.[0]?.name || "")} />
          Dodaj zdjęcie
        </label>
        {photoName && <div className="hint">Wybrano: {photoName}</div>}
        <button className="btn primary" type="submit">Wyślij</button>
      </form>
    </div>
  );
}
