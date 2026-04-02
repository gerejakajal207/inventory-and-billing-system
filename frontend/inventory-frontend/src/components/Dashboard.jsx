import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const API    = "http://127.0.0.1:8000";
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const COLORS  = ["#4f63e7","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4"];

const fmt = (n) => n >= 1000 ? `₹${(n/1000).toFixed(1)}k` : `₹${n}`;

export default function Dashboard() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/dashboard/`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: "grid", placeItems: "center", height: 300 }}>
      <div className="spinner" />
    </div>
  );

  if (!data) return <p style={{ color: "var(--muted)" }}>Failed to load dashboard.</p>;

  const monthlyChart = (data.monthly_data || []).map(r => ({
    name: MONTHS[r.month - 1],
    revenue: r.total,
  }));

  const pieData = (data.categories || []).map(r => ({
    name: r.category || "Uncategorized",
    value: r.count,
  }));

  const stats = [
    { label: "Total Revenue",  value: fmt(data.revenue),   badge: "All time",     badgeClass: "badge-blue",   icon: "💰", iconBg: "#eef0fd", },
    { label: "Total Invoices", value: data.invoices,        badge: "Total",        badgeClass: "badge-blue",   icon: "🧾", iconBg: "#eef0fd", },
    { label: "Paid",           value: data.paid,            badge: "Invoices",     badgeClass: "badge-green",  icon: "✅", iconBg: "#d1fae5", },
    { label: "Unpaid",         value: data.unpaid,          badge: "Pending",      badgeClass: "badge-yellow", icon: "⏳", iconBg: "#fef3c7", },
    { label: "Customers",      value: data.customers,       badge: "Registered",   badgeClass: "badge-blue",   icon: "👤", iconBg: "#eef0fd", },
    { label: "Products",       value: data.products,        badge: "In catalog",   badgeClass: "badge-blue",   icon: "📦", iconBg: "#eef0fd", },
  ];

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-sub">Your business at a glance</p>
      </div>

      {data.low_stock > 0 && (
        <div className="alert-banner">
          ⚠️ <strong>{data.low_stock} product{data.low_stock > 1 ? "s" : ""}</strong>
          &nbsp;below minimum stock level — check the Products page.
        </div>
      )}

      <div className="stats-grid">
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-card-top">
              <div className="stat-icon" style={{ background: s.iconBg }}>{s.icon}</div>
              <span className={`stat-badge ${s.badgeClass}`}>{s.badge}</span>
            </div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-title">Monthly Revenue</div>
          {monthlyChart.length === 0
            ? <p style={{ color: "var(--muted)", fontSize: 14 }}>No invoice data yet.</p>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyChart} barSize={28}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9aa3be" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#9aa3be" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                  <Tooltip
                    formatter={(v) => [`₹${v}`, "Revenue"]}
                    contentStyle={{ border: "1px solid #e4e7f0", borderRadius: 8, fontSize: 13 }}
                  />
                  <Bar dataKey="revenue" fill="#4f63e7" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )
          }
        </div>

        <div className="chart-card">
          <div className="chart-title">Products by Category</div>
          {pieData.length === 0
            ? <p style={{ color: "var(--muted)", fontSize: 14 }}>No product data yet.</p>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name"
                    cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={3}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend iconSize={10} iconType="circle"
                    formatter={(v) => <span style={{ fontSize: 12, color: "#4b5675" }}>{v}</span>} />
                  <Tooltip contentStyle={{ border: "1px solid #e4e7f0", borderRadius: 8, fontSize: 13 }} />
                </PieChart>
              </ResponsiveContainer>
            )
          }
        </div>
      </div>
    </div>
  );
}