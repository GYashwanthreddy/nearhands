import { useCallback, useEffect, useState } from "react";
import api, { errMsg } from "../api";
import { useLang } from "../context/LangContext";
import Avatar from "../components/Avatar";
import { formatPhone } from "../utils";

const TABS = [
  ["pending", "tabPending"],
  ["approved", "tabApproved"],
  ["rejected", "tabRejected"],
];

export default function Admin() {
  const { t, trade, city } = useLang();
  const [tab, setTab] = useState("pending");
  const [stats, setStats] = useState(null);
  const [workers, setWorkers] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [s, w] = await Promise.all([api.get("/admin/stats"), api.get("/admin/workers", { params: { status: tab } })]);
      setStats(s.data);
      setWorkers(w.data.workers);
    } catch (e) {
      setError(errMsg(e));
    }
  }, [tab]);

  useEffect(() => {
    setWorkers(null);
    load();
  }, [load]);

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/admin/workers/${id}/status`, { status });
      await load();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  return (
    <div className="container narrow">
      <h1>{t("adminTitle")}</h1>
      {error && <div className="alert">{error}</div>}

      {stats && (
        <p className="muted">
          {stats.customers} {t("customersCount")} · {stats.reviews} {t("reviewsCount")}
        </p>
      )}

      <div className="tabs">
        {TABS.map(([key, label]) => (
          <button key={key} className={`tab ${tab === key ? "on" : ""}`} onClick={() => setTab(key)}>
            {t(label)} {stats && <span className="count">{stats[key]}</span>}
          </button>
        ))}
      </div>

      {!workers && <div className="center-screen short"><div className="spinner" /></div>}
      {workers && workers.length === 0 && <div className="card empty">{t("nothing")}</div>}

      <div className="list">
        {workers?.map((w) => (
          <div key={w._id} className="card admin-card">
            <Avatar name={w.name} photoUrl={w.photoUrl} size={56} />
            <div className="admin-info">
              <h3>{w.name}</h3>
              <p className="muted small">
                {trade(w.trade)} · {city(w.city)} · ₹{w.ratePerHour}{t("perHour")} · {w.experienceYears} {t("yrs")}
              </p>
              <p className="small">✉️ {w.email} · 📞 {formatPhone(w.phone)}</p>
              <p className="bio small"><strong>EN:</strong> {w.bio?.en || "—"}</p>
              <p className="bio small"><strong>తె:</strong> {w.bio?.te || "—"}</p>
            </div>
            <div className="admin-actions">
              {w.status !== "approved" && (
                <button className="btn btn-primary btn-sm" onClick={() => setStatus(w._id, "approved")}>{t("approve")}</button>
              )}
              {w.status !== "rejected" && (
                <button className="btn btn-ghost btn-sm" onClick={() => setStatus(w._id, "rejected")}>{t("reject")}</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
