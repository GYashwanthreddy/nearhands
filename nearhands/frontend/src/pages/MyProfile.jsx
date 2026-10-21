import { useEffect, useState } from "react";
import api, { errMsg } from "../api";
import { useLang } from "../context/LangContext";
import { CITIES, TRADES } from "../i18n";
import Avatar from "../components/Avatar";

const EMPTY = {
  trade: "plumber",
  city: "Hyderabad",
  phone: "",
  ratePerHour: 300,
  experienceYears: 1,
  bioLang: "en",
  bioText: "",
};

export default function MyProfile() {
  const { t, trade, city } = useLang();
  const [profile, setProfile] = useState(null); // what is saved on the server
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    api
      .get("/workers/me/profile")
      .then(({ data }) => {
        const p = data.profile;
        if (p) {
          setProfile(p);
          setForm({
            trade: p.trade,
            city: p.city,
            phone: p.phone,
            ratePerHour: p.ratePerHour,
            experienceYears: p.experienceYears,
            bioLang: p.bioLang,
            bioText: p.bio?.[p.bioLang] || "",
          });
        }
      })
      .catch((e) => setMsg({ type: "error", text: errMsg(e) }))
      .finally(() => setLoading(false));
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg({ type: "", text: "" });
    try {
      const { data } = await api.put("/workers/me/profile", form);
      setProfile(data.profile);
      setMsg(
        data.translationOk
          ? { type: "ok", text: t("saved") }
          : { type: "warn", text: t("translationFail") }
      );
    } catch (err) {
      setMsg({ type: "error", text: errMsg(err) });
    } finally {
      setBusy(false);
    }
  };

  const uploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const body = new FormData();
    body.append("photo", file);
    setUploading(true);
    setMsg({ type: "", text: "" });
    try {
      const { data } = await api.post("/workers/me/photo", body);
      setProfile((p) => ({ ...p, photoUrl: data.photoUrl }));
    } catch (err) {
      setMsg({ type: "error", text: errMsg(err) });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (loading) return <div className="center-screen"><div className="spinner" /></div>;

  return (
    <div className="container narrow">
      <div>
        <h1>{t("profileTitle")}</h1>
        <p className="muted">{t("profileSub")}</p>
      </div>

      {profile && (
        <div className={`status-banner ${profile.status}`}>
          <strong>{t("status")}:</strong> {t(profile.status)}
        </div>
      )}

      {msg.text && (
        <div className={msg.type === "ok" ? "notice" : msg.type === "warn" ? "warn-box" : "alert"}>
          {msg.text}
        </div>
      )}

      <div className="card photo-card">
        <Avatar name={profile?.name || "?"} photoUrl={profile?.photoUrl} size={90} />
        <div>
          <h3>{t("photo")}</h3>
          <p className="muted small">{t("photoHelp")}</p>
          <label className={`btn btn-ghost btn-sm file-btn ${!profile || uploading ? "disabled" : ""}`}>
            {uploading ? t("uploading") : t("uploadPhoto")}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadPhoto} disabled={!profile || uploading} hidden />
          </label>
        </div>
      </div>

      <form className="card" onSubmit={save}>
        <div className="two-col">
          <div className="field">
            <label>{t("workType")}</label>
            <select value={form.trade} onChange={set("trade")}>
              {TRADES.map((k) => <option key={k} value={k}>{trade(k)}</option>)}
            </select>
          </div>
          <div className="field">
            <label>{t("city")}</label>
            <select value={form.city} onChange={set("city")}>
              {CITIES.map((c) => <option key={c} value={c}>{city(c)}</option>)}
            </select>
          </div>
        </div>

        <div className="field">
          <label>{t("phone")}</label>
          <input required value={form.phone} onChange={set("phone")} placeholder="9876543210" inputMode="tel" />
        </div>

        <div className="two-col">
          <div className="field">
            <label>{t("rate")}</label>
            <input type="number" min="50" max="10000" required value={form.ratePerHour} onChange={set("ratePerHour")} />
          </div>
          <div className="field">
            <label>{t("experience")}</label>
            <input type="number" min="0" max="60" required value={form.experienceYears} onChange={set("experienceYears")} />
          </div>
        </div>

        <div className="field">
          <label>{t("bioLang")}</label>
          <div className="pills">
            <button type="button" className={`pill ${form.bioLang === "en" ? "on" : ""}`} onClick={() => setForm({ ...form, bioLang: "en" })}>English</button>
            <button type="button" className={`pill ${form.bioLang === "te" ? "on" : ""}`} onClick={() => setForm({ ...form, bioLang: "te" })}>తెలుగు</button>
          </div>
        </div>

        <div className="field">
          <label>{t("bio")}</label>
          <textarea rows={5} required minLength={20} maxLength={600} value={form.bioText} onChange={set("bioText")} />
          <p className="muted small">{t("bioHelp")}</p>
        </div>

        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? <><span className="spinner sm" /> {t("saving")}</> : t("save")}
        </button>
      </form>

      {profile && (profile.bio?.en || profile.bio?.te) && (
        <div className="two-col">
          <div className="card">
            <h3>{t("englishVersion")}</h3>
            <p className="bio">{profile.bio.en || "—"}</p>
          </div>
          <div className="card">
            <h3>{t("teluguVersion")}</h3>
            <p className="bio">{profile.bio.te || "—"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
