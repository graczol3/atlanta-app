import React, { useEffect, useMemo, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { getAllTickets } from "./db";
import "./Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard({ reservations = [] }) {
  /* ===============================
     STATY (jak było)
  =============================== */
  const [stats] = useState({
    buildings: 12,
    apartments: 85,
    tenants: 73,
    income: 124500,
  });

  /* ===============================
     ZGŁOSZENIA TECHNICZNE 🔥
  =============================== */
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    const data = await getAllTickets();
    setTickets(data || []);
  };

  const lastTickets = useMemo(() => {
    return tickets
      .sort(
        (a, b) =>
          Number(b.id.replace(/\D/g, "")) -
          Number(a.id.replace(/\D/g, ""))
      )
      .slice(0, 5);
  }, [tickets]);

  /* ===============================
     OSTATNIE OPŁACONE REZERWACJE
  =============================== */
  const lastPaidReservations = useMemo(() => {
    return reservations
      .filter(r => r.status === "paid" || r.paid === true)
      .sort(
        (a, b) =>
          Number(b.id.replace(/\D/g, "")) -
          Number(a.id.replace(/\D/g, ""))
      )
      .slice(0, 5);
  }, [reservations]);

  /* ===============================
     WYKRESY
  =============================== */
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 10, font: { size: 11 } },
      },
    },
  };

  const lineData = {
    labels: ["Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"],
    datasets: [
      {
        label: "Przychody (PLN)",
        data: [98000, 105000, 110000, 108000, 120000, 124500],
        borderColor: "#4e73df",
        backgroundColor: "rgba(78, 115, 223, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const doughnutData = {
    labels: ["Zajęte", "Wolne"],
    datasets: [
      {
        data: [stats.tenants, stats.apartments - stats.tenants],
        backgroundColor: ["#28a745", "#eaecf4"],
        borderWidth: 1,
      },
    ],
  };

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className="dashboard-outer-wrapper">
      <div className="dashboard-container">

        <div className="dashboard-header">
          <h2>Aktualności</h2>
        </div>

        {/* STATY */}
        <div className="stats-grid">
          <div className="stat-tile tile-blue">
            <h3>Budynki</h3>
            <p>{stats.buildings}</p>
          </div>
          <div className="stat-tile tile-green">
            <h3>Mieszkania</h3>
            <p>{stats.apartments}</p>
          </div>
          <div className="stat-tile tile-orange">
            <h3>Najemcy</h3>
            <p>{stats.tenants}</p>
          </div>
          <div className="stat-tile tile-purple">
            <h3>Przychody</h3>
            <p>{stats.income.toLocaleString()} zł</p>
          </div>
        </div>

        {/* WYKRESY */}
        <div className="main-content-row">
          <div className="panel chart-wide">
            <h3>Trend Przychodów</h3>
            <div className="chart-wrapper">
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>

          <div className="panel chart-small">
            <h3>Obłożenie Lokali</h3>
            <div className="chart-wrapper">
              <Doughnut data={doughnutData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* LISTY */}
        <div className="main-content-row">
          <div className="panel">
            <h3>Ostatnie rezerwacje</h3>

            {lastPaidReservations.length === 0 ? (
              <p style={{ opacity: 0.6 }}>
                Brak opłaconych rezerwacji
              </p>
            ) : (
              <ul className="list">
                {lastPaidReservations.map(r => (
                  <li key={r.id}>
                    <span>
                      {r.id} • {r.user?.email} • {r.flat}
                    </span>
                    <span className="badge approved">ZAPŁACONO</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 🔥 ZGŁOSZENIA TECHNICZNE */}
          <div className="panel">
            <h3>Zgłoszenia techniczne</h3>

            {lastTickets.length === 0 ? (
              <p style={{ opacity: 0.6 }}>
                Brak zgłoszeń
              </p>
            ) : (
              <ul className="list">
                {lastTickets.map(t => (
                  <li key={t.id}>
                    <span>
                      {t.id} • {t.title}
                    </span>
                    <span className={`badge ${t.priority}`}>
                      {t.priority === "high"
                        ? "Wysoki"
                        : t.priority === "medium"
                        ? "Średni"
                        : "Niski"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
