import { useEffect, useState } from "react";

const BASE = "http://127.0.0.1:8000";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    fetch(`${BASE}/customers/`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => { setCustomers(data); setLoading(false); })
      .catch(err  => { setError(err.message); setLoading(false); });
  }, []);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Customers</h1>
        <p className="page-sub">All registered customers</p>
      </div>

      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title">Customer List</span>
          {!loading && !error && (
            <span className="table-count">{customers.length} total</span>
          )}
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr className="loading-row">
                <td colSpan={5}>
                  <div className="spinner" />
                  Loading customers…
                </td>
              </tr>
            )}

            {error && (
              <tr className="empty-row">
                <td colSpan={5} style={{ color: "var(--red)" }}>
                  ⚠ {error}
                </td>
              </tr>
            )}

            {!loading && !error && customers.length === 0 && (
              <tr className="empty-row">
                <td colSpan={5}>No customers found</td>
              </tr>
            )}

            {!loading && !error && customers.map((c, i) => (
              <tr key={c.customer_id}>
                <td className="td-mono">{i + 1}</td>
                <td className="td-bold">{c.name}</td>
                <td className="td-mono">{c.email}</td>
                <td>{c.phone}</td>
                <td style={{ color: "var(--muted)" }}>{c.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}