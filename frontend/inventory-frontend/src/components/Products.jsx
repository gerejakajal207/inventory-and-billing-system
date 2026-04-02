import { useEffect, useState } from "react";

const API   = "http://127.0.0.1:8000";
const empty = { prod_name: "", category: "", brand: "", unit_price: "", stock_qty: 0, min_stock: 10 };

const StockBar = ({ qty, min }) => {
  const pct   = min > 0 ? Math.min((qty / (min * 2)) * 100, 100) : 100;
  const color = qty <= min ? "#ef4444" : qty <= min * 1.5 ? "#f59e0b" : "#10b981";
  return (
    <div className="stock-bar-wrap">
      <div className="stock-bar">
        <div className="stock-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span style={{ fontSize: 12, color: qty <= min ? "var(--red)" : "var(--muted)", fontFamily: "var(--mono)" }}>
        {qty}
      </span>
    </div>
  );
};

export default function Products() {
  const [products, setProducts]   = useState([]);
  const [search, setSearch]       = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(empty);

  const load = () => {
    setLoading(true);
    fetch(`${API}/products/?search=${search}&category=${catFilter}`)
      .then(r => r.json())
      .then(d => { setProducts(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, catFilter]);

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const openCreate = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit   = (p)  => { setEditing(p.product_id); setForm({ prod_name: p.prod_name, category: p.category, brand: p.brand, unit_price: p.unit_price, stock_qty: p.stock_qty, min_stock: p.min_stock }); setModal(true); };
  const closeModal = ()   => setModal(false);
  const handle     = (e)  => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    const url    = editing ? `${API}/products/${editing}` : `${API}/products/`;
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    closeModal(); load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`${API}/products/${id}`, { method: "DELETE" });
    load();
  };

  const exportCSV = () => {
    const header = "ID,Name,Category,Brand,Price,Stock,Min Stock";
    const rows   = products.map(p =>
      `${p.product_id},"${p.prod_name}","${p.category}","${p.brand}",${p.unit_price},${p.stock_qty},${p.min_stock}`
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const a    = document.createElement("a");
    a.href     = URL.createObjectURL(blob);
    a.download = "products.csv";
    a.click();
  };

  const lowCount = products.filter(p => p.stock_qty <= p.min_stock).length;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <p className="page-sub">Manage your product catalog and stock</p>
      </div>

      {lowCount > 0 && (
        <div className="alert-banner">
          ⚠️ <strong>{lowCount} product{lowCount > 1 ? "s" : ""}</strong> at or below minimum stock level.
        </div>
      )}

      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Search products…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="btn btn-outline" onClick={exportCSV}>⬇ Export CSV</button>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Product</button>
      </div>

      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title">All Products</span>
          <span className="table-count">{products.length} records</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Category</th><th>Brand</th><th>Price</th><th>Stock</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="loading-row"><td colSpan={7}><div className="spinner" />Loading…</td></tr>
            ) : products.length === 0 ? (
              <tr className="empty-row"><td colSpan={7}>No products found</td></tr>
            ) : products.map(p => (
              <tr key={p.product_id}>
                <td className="td-mono">#{p.product_id}</td>
                <td className="td-bold">{p.prod_name}</td>
                <td>
                  <span className="status-pill badge-blue">{p.category}</span>
                </td>
                <td>{p.brand}</td>
                <td className="td-mono">₹{Number(p.unit_price).toFixed(2)}</td>
                <td><StockBar qty={p.stock_qty || 0} min={p.min_stock || 10} /></td>
                <td>
                  <div className="td-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>✏ Edit</button>
                    <button className="btn btn-danger btn-sm"  onClick={() => remove(p.product_id)}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{editing ? "Edit Product" : "New Product"}</div>
            <div className="form-grid">
              {[
                ["prod_name","Product Name","e.g. Office Chair"],
                ["category","Category","e.g. Furniture"],
                ["brand","Brand","e.g. Herman Miller"],
                ["unit_price","Unit Price","0.00"],
                ["stock_qty","Stock Quantity","0"],
                ["min_stock","Minimum Stock","10"],
              ].map(([name, label, ph]) => (
                <div className="form-group" key={name}>
                  <label className="form-label">{label}</label>
                  <input className="form-input" name={name} placeholder={ph}
                    value={form[name]} onChange={handle}
                    type={["unit_price","stock_qty","min_stock"].includes(name) ? "number" : "text"} />
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>{editing ? "Save Changes" : "Create"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}