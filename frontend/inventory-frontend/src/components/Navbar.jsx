export default function Navbar({ activePage, setActivePage }) {
  const links = [
    { id: "dashboard", label: "Dashboard", icon: "▦" },
    { id: "customers", label: "Customers", icon: "◉" },
    { id: "products",  label: "Products",  icon: "⬡" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <span>📦</span>
        InvenBill
      </div>

      <div className="nav-label">Menu</div>

      {links.map(({ id, label, icon }) => (
        <button
          key={id}
          className={`nav-item ${activePage === id ? "active" : ""}`}
          onClick={() => setActivePage(id)}
        >
          <span className="nav-icon">{icon}</span>
          {label}
        </button>
      ))}
    </nav>
  );
}