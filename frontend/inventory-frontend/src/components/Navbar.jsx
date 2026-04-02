import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

export default function Navbar({ activePage, setActivePage, onLogout }) {
  const [lowStock, setLowStock] = useState(0);

  useEffect(() => {
    fetch(`${API}/products/low-stock`)
      .then(r => r.json())
      .then(d => setLowStock(d.length))
      .catch(() => {});
  }, []);

  const nav = (page) => setActivePage(page);

  const items = [
    { id: "dashboard", label: "Dashboard",  icon: "⊞" },
    { id: "customers", label: "Customers",  icon: "👤" },
    { id: "products",  label: "Products",   icon: "📦", badge: lowStock || null },
    { id: "invoices",  label: "Invoices",   icon: "🧾" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <div className="nav-logo-icon">📦</div>
        Inventra
      </div>

      <span className="nav-section-label">Menu</span>

      {items.map(item => (
        <button
          key={item.id}
          className={`nav-item ${activePage === item.id ? "active" : ""}`}
          onClick={() => nav(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          {item.label}
          {item.badge && <span className="nav-badge">{item.badge}</span>}
        </button>
      ))}

      <div className="nav-footer">
        <div className="nav-avatar">A</div>
        <div className="nav-user-info">
          <div className="nav-user-name">Admin</div>
          <div className="nav-user-role">Administrator</div>
        </div>
        <button className="nav-logout" onClick={onLogout} title="Logout">⇥</button>
      </div>
    </nav>
  );
}