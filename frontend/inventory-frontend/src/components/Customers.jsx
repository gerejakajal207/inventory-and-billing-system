import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

const empty = { name: "", email: "", phone: "", address: "" };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);
  const [editing, setEditing]     = useState(null); // null = create
  const [form, setForm]           = useState(empty);

  const load = (q = "") => {
    setLoading(true);
    fetch(`${API}/customers/?search=${q}`)
      .then(r => r.json())
      .then(d => { setCustomers(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit   = (c)  => { setEditing(c.customer_id); setForm({ name: c.name, email: c.email, phone: c.phone, address: c.address }); setModal(true); };
  const closeModal = ()   => setModal(false);
  const handle     = (e)  => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    const url    = editing ? `${API}/customers/${editing}` : `${API}/customers/`;
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    closeModal(); load(search);
  };

  const remove = async (id) => {
    if (!confirm("Delete this customer?")) return;
    await fetch(`${API}/customers/${id}`, { method: "DELETE" });
    load(search);
  };

  const exportCSV = () => {
    const header = "ID,Name,Email,Phone,Address";
    const rows   = customers.map(c => `${c.customer_id},"${c.name}","${c.email}","${c.phone}","${c.address}"`);
    const blob   = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const a      = document.createElement("a");
    a.href       = URL.createObjectURL(blob);
    a.download   = "customers.csv";
    a.click();
  };

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Customers</h1>
        <p className="page-sub">Manage your customer list</p>
      </div>

      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Search by name or email…"
            value={search} onChange={e => { setSearch(e.target.value); load(e.target.value); }} />
        </div>
        <button className="btn btn-outline" onClick={exportCSV}>⬇ Export CSV</button>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Customer</button>
      </div>

      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title">All Customers</span>
          <span className="table-count">{filtered.length} records</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="loading-row"><td colSpan={6}><div className="spinner" />Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr className="empty-row"><td colSpan={6}>No customers found</td></tr>
            ) : filtered.map(c => (
              <tr key={c.customer_id}>
                <td className="td-mono">#{c.customer_id}</td>
                <td className="td-bold">{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.address}</td>
                <td>
                  <div className="td-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(c)}>✏ Edit</button>
                    <button className="btn btn-danger btn-sm"  onClick={() => remove(c.customer_id)}>🗑</button>
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
            <div className="modal-title">{editing ? "Edit Customer" : "New Customer"}</div>
            <div className="form-grid">
              {[["name","Name","Jane Doe"],["email","Email","jane@example.com"],["phone","Phone","+91 9000000000"],["address","Address","123 Main St"]].map(([name, label, ph]) => (
                <div className="form-group" key={name}>
                  <label className="form-label">{label}</label>
                  <input className="form-input" name={name} placeholder={ph} value={form[name]} onChange={handle} />
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