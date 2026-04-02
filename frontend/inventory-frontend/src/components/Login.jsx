import { useState } from "react";

const API = "http://127.0.0.1:8000";

export default function Login({ onLogin }) {
  const [mode, setMode]       = useState("login");
  const [form, setForm]       = useState({ username: "", email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const body     = mode === "login"
        ? { email: form.email, password: form.password }
        : form;

      const res  = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Something went wrong");
      onLogin(data.access_token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">📦</div>
          <span className="auth-logo-text">Inventra</span>
        </div>

        <h1 className="auth-title">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>
        <p className="auth-sub">
          {mode === "login" ? "Sign in to your workspace" : "Get started for free"}
        </p>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-form">
          {mode === "register" && (
            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-input" name="username" placeholder="johndoe"
                value={form.username} onChange={handle} />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" name="email" type="email" placeholder="you@example.com"
              value={form.email} onChange={handle} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" name="password" type="password" placeholder="••••••••"
              value={form.password} onChange={handle} />
          </div>

          <button className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
            onClick={submit} disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </div>

        <p className="auth-divider">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span className="auth-link"
            onClick={() => setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Sign up" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}