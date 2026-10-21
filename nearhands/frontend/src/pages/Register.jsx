import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import { errMsg } from "../api";
import { homeFor } from "../utils";

export default function Register() {
  const { user, register } = useAuth();
  const { t } = useLang();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={homeFor(user)} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const u = await register(form.name, form.email, form.password, form.role);
      nav(homeFor(u));
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card auth-card" onSubmit={submit}>
        <h2>{t("createAccount")}</h2>
        {error && <div className="alert mt">{error}</div>}

        <div className="field mt">
          <label>{t("iAm")}</label>
          <div className="role-pick">
            <button type="button" className={form.role === "customer" ? "on" : ""} onClick={() => setForm({ ...form, role: "customer" })}>
              🔍 {t("customerRole")}
            </button>
            <button type="button" className={form.role === "worker" ? "on" : ""} onClick={() => setForm({ ...form, role: "worker" })}>
              🛠️ {t("workerRole")}
            </button>
          </div>
        </div>

        <div className="field">
          <label>{t("name")}</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="field">
          <label>{t("email")}</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="field">
          <label>{t("password")} (min 6)</label>
          <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? <span className="spinner sm" /> : t("register")}
        </button>
        <p className="muted center mt">
          {t("haveAccount")} <Link to="/login">{t("loginLink")}</Link>
        </p>
      </form>
    </div>
  );
}
