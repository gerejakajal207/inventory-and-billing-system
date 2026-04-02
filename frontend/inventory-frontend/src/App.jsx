import { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Customers from "./components/Customers";
import Products from "./components/Products";
import Invoices from "./components/Invoices";
import Login from "./components/Login";
import "./App.css";

export default function App() {
  const [token, setToken]           = useState(localStorage.getItem("token") || "");
  const [activePage, setActivePage] = useState("dashboard");

  const handleLogin = (t) => {
    localStorage.setItem("token", t);
    setToken(t);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  if (!token) return <Login onLogin={handleLogin} />;

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard />;
      case "customers": return <Customers />;
      case "products":  return <Products />;
      case "invoices":  return <Invoices />;
      default:          return <Dashboard />;
    }
  };

  return (
    <div className="app-shell">
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
      />
      <main className="page-content fade-in">
        {renderPage()}
      </main>
    </div>
  );
}