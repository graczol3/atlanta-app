import React, { useMemo, useState } from "react";
import "./ReportsAnalytics.css";

const contractsSeed = [
  { id: "U-5007", tenant: "Jan Kowalski", flat: "A-07", start: "2025-01-01", end: "2025-12-31", rent: 2900, status: "active" },
  { id: "U-5006", tenant: "Anna Nowak",   flat: "B-12", start: "2024-11-01", end: "2025-10-31", rent: 3200, status: "active" },
  { id: "U-5005", tenant: "Piotr Wiśn.",  flat: "C-03", start: "2024-01-01", end: "2024-12-31", rent: 2500, status: "ended" },
];

const paymentsSeed = [
  { id: "P-9005", contractId: "U-5007", date: "2025-11-05", amount: 2900, method: "transfer", status: "paid" },
  { id: "P-9004", contractId: "U-5006", date: "2025-11-03", amount: 3200, method: "transfer", status: "paid" },
  { id: "P-9003", contractId: "U-5007", date: "2025-10-05", amount: 2900, method: "transfer", status: "paid" },
  { id: "P-9002", contractId: "U-5006", date: "2025-10-03", amount: 3200, method: "transfer", status: "paid" },
  { id: "P-9001", contractId: "U-5005", date: "2024-12-03", amount: 2500, method: "cash",     status: "paid" },
];

function toYM(d) {
  const [y, m] = d.split("-"); 
  return `${y}-${m}`;
}

function exportCSV(filename, rows) {
  const head = Object.keys(rows[0] || {});
  const esc = v => {
    if (v === null || v === undefined) return "";
    const s = String(v).replace(/"/g, '""');
    return /[",\n;]/.test(s) ? `"${s}"` : s;
  };
  const csv = [head.join(","), ...rows.map(r => head.map(h => esc(r[h])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsAnalytics() {
  const [contracts] = useState(contractsSeed);
  const [payments] = useState(paymentsSeed);

  // filtry
  const [q, setQ] = useState("");
  const [period, setPeriod] = useState("2025-11"); // YYYY-MM

  // metryki
  const kpis = useMemo(() => {
    const active = contracts.filter(c => c.status === "active").length;
    const mPayments = payments.filter(p => toYM(p.date) === period);
    const income = mPayments.reduce((s, p) => s + p.amount, 0);
    const arpu = active ? Math.round(income / active) : 0;
    const byTenant = new Set(contracts.map(c => c.tenant)).size;
    return { active, income, arpu, tenants: byTenant };
  }, [contracts, payments, period]);

  // tabele filtrowane
  const filteredContracts = useMemo(() => {
    return contracts.filter(c =>
      (!q || c.id.toLowerCase().includes(q.toLowerCase()) || c.tenant.toLowerCase().includes(q.toLowerCase()) || c.flat.toLowerCase().includes(q.toLowerCase()))
    );
  }, [contracts, q]);

  const filteredPayments = useMemo(() => {
    return payments.filter(p =>
      (!q || p.id.toLowerCase().includes(q.toLowerCase()) || p.contractId.toLowerCase().includes(q.toLowerCase())) &&
      (!period || toYM(p.date) === period)
    );
  }, [payments, q, period]);

  // agregacje miesiąc po miesiącu (pod wykres lub tabelę)
  const monthly = useMemo(() => {
    const map = new Map();
    payments.forEach(p => {
      const ym = toYM(p.date);
      map.set(ym, (map.get(ym) || 0) + p.amount);
    });
    return [...map.entries()]
      .sort(([a],[b]) => a.localeCompare(b))
      .map(([month, total]) => ({ month, total }));
  }, [payments]);

  return (
    <div className="reports">
      <h2>Raporty i analityka</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Szukaj: ID umowy, najemca, lokal, ID płatności…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <input
          type="month"
          value={period}
          onChange={e => setPeriod(e.target.value)}
        />
        <button
          className="btn primary"
          onClick={() => exportCSV(`payments_${period}.csv`, filteredPayments)}
        >
          Eksport płatności CSV
        </button>
        <button
          className="btn light"
          onClick={() => exportCSV(`contracts_all.csv`, filteredContracts)}
        >
          Eksport umów CSV
        </button>
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="kpi-label">Aktywne umowy</div>
          <div className="kpi-value">{kpis.active}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Przychód {period}</div>
          <div className="kpi-value">{kpis.income.toLocaleString()} zł</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Śr. na umowę</div>
          <div className="kpi-value">{kpis.arpu.toLocaleString()} zł</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Najemcy</div>
          <div className="kpi-value">{kpis.tenants}</div>
        </div>
      </div>

      <div className="panel">
        <h3>Przychody miesięczne</h3>
        <div className="table head">
          <div>Miesiąc</div>
          <div>Przychód</div>
        </div>
        {monthly.map(m => (
          <div className="table row" key={m.month}>
            <div>{m.month}</div>
            <div>{m.total.toLocaleString()} zł</div>
          </div>
        ))}
      </div>

      <div className="grid">
        <div className="panel">
          <h3>Umowy ({filteredContracts.length})</h3>
          <div className="table head">
            <div>ID</div>
            <div>Najemca</div>
            <div>Lokal</div>
            <div>Okres</div>
            <div>Czynsz</div>
            <div>Status</div>
          </div>
          {filteredContracts.map(c => (
            <div className="table row" key={c.id}>
              <div>{c.id}</div>
              <div>{c.tenant}</div>
              <div>{c.flat}</div>
              <div>{c.start} → {c.end}</div>
              <div>{c.rent.toLocaleString()} zł</div>
              <div><span className={`badge ${c.status}`}>{c.status}</span></div>
            </div>
          ))}
        </div>

        <div className="panel">
          <h3>Płatności ({filteredPayments.length})</h3>
          <div className="table head">
            <div>ID</div>
            <div>Umowa</div>
            <div>Data</div>
            <div>Kwota</div>
            <div>Metoda</div>
            <div>Status</div>
          </div>
          {filteredPayments.map(p => (
            <div className="table row" key={p.id}>
              <div>{p.id}</div>
              <div>{p.contractId}</div>
              <div>{p.date}</div>
              <div>{p.amount.toLocaleString()} zł</div>
              <div>{p.method}</div>
              <div><span className={`badge ${p.status}`}>{p.status}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
