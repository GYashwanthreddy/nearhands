import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import { errMsg } from "../api";
import { homeFor } from "../utils";

export default function Login() {
  const { user, login } = useAuth();
  const { t } = useLang();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={homeFor(user)} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const u = await login(form.email, form.password);
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
        <h2>{t("welcomeBack")}</h2>
        <p className="muted">{t("loginSub")}</p>
        {error && <div className="alert mt">{error}</div>}
        <div className="field mt">
          <label>{t("email")}</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="field">
          <label>{t("password")}</label>
          <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? <span className="spinner sm" /> : t("login")}
        </button>
        <p className="muted center mt">
          {t("newHere")} <Link to="/register">{t("createOne")}</Link>
        </p>
      </form>
    </div>
  );
}
