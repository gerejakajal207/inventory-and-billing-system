import { useEffect, useState } from "react";

const BASE = "http://127.0.0.1:8000";

const categoryColor = (cat) => {
  const map = {
    Electronics: "badge-blue",
    Furniture:   "badge-green",
    Stationery:  "badge-yellow",
  };
  return map[cat] ?? "badge-blue";
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    fetch(`${BASE}/products/`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => { setProducts(data); setLoading(false); })
      .catch(err  => { setError(err.message); setLoading(false); });
  }, []);

  const fmt = (n) =>
    "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <p className="page-sub">Product catalog and pricing</p>
      </div>

      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title">Product List</span>
          {!loading && !error && (
            <span className="table-count">{products.length} items</span>
          )}
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Unit Price</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr className="loading-row">
                <td colSpan={5}>
                  <div className="spinner" />
                  Loading products…
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

            {!loading && !error && products.length === 0 && (
              <tr className="empty-row">
                <td colSpan={5}>No products found</td>
              </tr>
            )}

            {!loading && !error && products.map((p, i) => (
              <tr key={p.product_id}>
                <td className="td-mono">{i + 1}</td>
                <td className="td-bold">{p.prod_name}</td>
                <td>
                  <span className={`status-pill ${categoryColor(p.category)}`}>
                    {p.category}
                  </span>
                </td>
                <td style={{ color: "var(--muted)" }}>{p.brand}</td>
                <td className="td-mono">{fmt(p.unit_price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}