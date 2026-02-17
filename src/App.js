import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import "./App.css";

import {
  getAllProperties,
  saveProperties,
  getAllReservations
} from "./db";

/* --- ADMIN --- */
import Login from "./Login";
import AdminPanel from "./AdminPanel";

/* --- PUBLIC + NAJEMCA --- */
import TenantLogin from "./TenantLogin";
import TenantPanel from "./TenantPanel";
import Entry from "./Entry";
import Register from "./Register";
import Offers from "./Offers";
import PropertyShowcase from "./PropertyShowcase";

/* --- PUBLIC PAGES --- */
import Pricing from "./Pricing";
import About from "./About";
import Contact from "./Contact";
import Help from "./Help";

function AppLayout({
  properties,
  setProperties,
  reservations,
  setReservations
}) {
  return (
    <div className="container">
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Entry />} />
        <Route path="/login" element={<TenantLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/offers" element={<Offers properties={properties} />} />

        {/* PODSTRONY Z NAVBARA */}
        <Route path="/cennik" element={<Pricing />} />
        <Route path="/o-nas" element={<About />} />
        <Route path="/kontakt" element={<Contact />} />
        <Route path="/pomoc" element={<Help />} />

        <Route
          path="/property-showcase"
          element={
            <PropertyShowcase
              properties={properties}
              reservations={reservations}
            />
          }
        />

        {/* ================= ADMIN ================= */}
        <Route path="/admin/login" element={<Login />} />

        <Route
          path="/admin/*"
          element={
            <AdminPanel
              properties={properties}
              setProperties={setProperties}
              reservations={reservations}
              setReservations={setReservations}
            />
          }
        />

        {/* ================= TENANT ================= */}
        <Route
          path="/tenant/*"
          element={
            <TenantPanel
              properties={properties}
              setProperties={setProperties}
              reservations={reservations}
              setReservations={setReservations}
            />
          }
        />

      </Routes>
    </div>
  );
}

export default function App() {
  const [properties, setProperties] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loaded, setLoaded] = useState(false);

  /* ===== LOAD Z INDEXEDDB ===== */
  useEffect(() => {
    Promise.all([
      getAllProperties(),
      getAllReservations()
    ]).then(([props, res]) => {
      setProperties(props || []);
      setReservations(res || []);
      setLoaded(true);
    });
  }, []);

  /* ===== AUTO SAVE PROPERTIES ===== */
  useEffect(() => {
    if (loaded) {
      saveProperties(properties);
    }
  }, [properties, loaded]);

  return (
    <Router>
      <AppLayout
        properties={properties}
        setProperties={setProperties}
        reservations={reservations}
        setReservations={setReservations}
      />
    </Router>
  );
}
