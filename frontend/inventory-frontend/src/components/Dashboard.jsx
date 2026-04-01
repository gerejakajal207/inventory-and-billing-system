import { useEffect, useState } from "react";

const BASE = "http://127.0.0.1:8000";

export default function Dashboard() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    fetch(`${BASE}/dashboard/`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(d => { setData(d); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const fmt = (n) =>
    n != null
      ? "₹" + Number(n).toLocaleString("en-IN")
      : "—";

  const stats = data
    ? [
        { label: "Total Revenue",  value: fmt(data.revenue),  badge: "↑ Live",   cls: "badge-green"  },
        { label: "Total Invoices", value: data.invoices ?? "—", badge: "Invoices", cls: "badge-blue"  },
        { label: "Paid Invoices",  value: data.paid    ?? "—", badge: "Cleared",  cls: "badge-green"  },
        { label: "Pending",        value: data.unpaid  ?? "—", badge: "Unpaid",   cls: "badge-yellow" },
      ]
    : [];

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-sub">Business overview at a glance</p>
      </div>

      {loading && (
        <div className="stats-grid">
          {[0,1,2,3].map(i => (
            <div className="stat-card" key={i} style={{ opacity: 0.4 }}>
              <div className="stat-label">Loading…</div>
              <div className="stat-value">—</div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="table-wrap" style={{ padding: "32px 24px", color: "var(--red)", fontSize: 14 }}>
          ⚠ Could not load dashboard: {error}
        </div>
      )}

      {!loading && !error && (
        <div className="stats-grid">
          {stats.map(({ label, value, badge, cls }) => (
            <div className="stat-card" key={label}>
              <div className="stat-label">{label}</div>
              <div className="stat-value">{value}</div>
              <span className={`stat-badge ${cls}`}>{badge}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}