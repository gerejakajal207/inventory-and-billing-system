import { useEffect, useState } from "react";

const API   = "http://127.0.0.1:8000";
const empty = { customer_id: "", inv_date: "", due_date: "", total_amt: "", status: "Unpaid" };

const STATUS_STYLES = {
  Paid:    { background: "var(--green-soft)",  color: "var(--green)" },
  Unpaid:  { background: "var(--yellow-soft)", color: "var(--yellow)" },
  Overdue: { background: "var(--red-soft)",    color: "var(--red)" },
};

export default function Invoices() {
  const [invoices, setInvoices]   = useState([]);
  const [status, setStatus]       = useState("");
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(empty);

  const load = () => {
    setLoading(true);
    fetch(`${API}/invoices/?status=${status}`)
      .then(r => r.json())
      .then(d => { setInvoices(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [status]);

  const openCreate = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit   = (inv) => {
    setEditing(inv.invoice_id);
    setForm({
      customer_id: inv.customer_id,
      inv_date:    inv.inv_date,
      due_date:    inv.due_date,
      total_amt:   inv.total_amt,
      status:      inv.status,
    });
    setModal(true);
  };
  const closeModal = () => setModal(false);
  const handle     = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    const url    = editing ? `${API}/invoices/${editing}` : `${API}/invoices/`;
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    closeModal(); load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this invoice?")) return;
    await fetch(`${API}/invoices/${id}`, { method: "DELETE" });
    load();
  };

  const exportCSV = () => {
    const header = "ID,Customer ID,Date,Due Date,Amount,Status";
    const rows   = invoices.map(i =>
      `${i.invoice_id},${i.customer_id},${i.inv_date},${i.due_date},${i.total_amt},${i.status}`
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const a    = document.createElement("a");
    a.href     = URL.createObjectURL(blob);
    a.download = "invoices.csv";
    a.click();
  };

  const totalRevenue = invoices
    .filter(i => i.status === "Paid")
    .reduce((sum, i) => sum + Number(i.total_amt), 0);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Invoices</h1>
        <p className="page-sub">Track and manage billing</p>
      </div>

      {/* Mini stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Total Invoices</div>
          <div className="stat-value">{invoices.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Collected</div>
          <div className="stat-value" style={{ color: "var(--green)" }}>
            ₹{totalRevenue.toLocaleString()}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value" style={{ color: "var(--yellow)" }}>
            {invoices.filter(i => i.status === "Unpaid").length}
          </div>
        </div>
      </div>

      <div className="toolbar">
        <select className="filter-select" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Overdue">Overdue</option>
        </select>
        <button className="btn btn-outline" onClick={exportCSV}>⬇ Export CSV</button>
        <button className="btn btn-primary" onClick={openCreate}>+ New Invoice</button>
      </div>

      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title">All Invoices</span>
          <span className="table-count">{invoices.length} records</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Invoice ID</th><th>Customer ID</th><th>Date</th><th>Due Date</th><th>Amount</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="loading-row"><td colSpan={7}><div className="spinner" />Loading…</td></tr>
            ) : invoices.length === 0 ? (
              <tr className="empty-row"><td colSpan={7}>No invoices found</td></tr>
            ) : invoices.map(inv => (
              <tr key={inv.invoice_id}>
                <td className="td-mono td-bold">#INV-{String(inv.invoice_id).padStart(4,"0")}</td>
                <td className="td-mono">#{inv.customer_id}</td>
                <td>{inv.inv_date}</td>
                <td>{inv.due_date}</td>
                <td className="td-bold td-mono">₹{Number(inv.total_amt).toLocaleString()}</td>
                <td>
                  <span className="status-pill" style={STATUS_STYLES[inv.status] || {}}>
                    {inv.status}
                  </span>
                </td>
                <td>
                  <div className="td-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(inv)}>✏ Edit</button>
                    <button className="btn btn-danger btn-sm"  onClick={() => remove(inv.invoice_id)}>🗑</button>
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
            <div className="modal-title">{editing ? "Edit Invoice" : "New Invoice"}</div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Customer ID</label>
                <input className="form-input" name="customer_id" type="number" placeholder="1"
                  value={form.customer_id} onChange={handle} />
              </div>
              <div className="form-group">
                <label className="form-label">Invoice Date</label>
                <input className="form-input" name="inv_date" type="date"
                  value={form.inv_date} onChange={handle} />
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input className="form-input" name="due_date" type="date"
                  value={form.due_date} onChange={handle} />
              </div>
              <div className="form-group">
                <label className="form-label">Total Amount</label>
                <input className="form-input" name="total_amt" type="number" placeholder="0.00"
                  value={form.total_amt} onChange={handle} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-input filter-select" name="status" value={form.status} onChange={handle}>
                  <option>Unpaid</option>
                  <option>Paid</option>
                  <option>Overdue</option>
                </select>
              </div>
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