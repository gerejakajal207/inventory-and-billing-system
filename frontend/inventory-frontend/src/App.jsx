import { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Customers from "./components/Customers";
import Products from "./components/Products";
import "./App.css";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard />;
      case "customers": return <Customers />;
      case "products": return <Products />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-shell">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main className="page-content">
        {renderPage()}
      </main>
    </div>
  );
}