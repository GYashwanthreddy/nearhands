import { useState } from "react";
import { Link } from "react-router-dom";
import api, { errMsg } from "../api";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import { formatPhone, waLink } from "../utils";

// The phone number is NOT in the search results. It is fetched only after a logged-in
// user clicks "Show number", and the server rate-limits those requests.
export default function ContactBox({ workerId }) {
  const { user } = useAuth();
  const { t } = useLang();
  const [info, setInfo] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!user)
    return (
      <Link to="/login" className="btn btn-ghost btn-block">
        🔒 {t("loginToView")}
      </Link>
    );

  const reveal = async () => {
    setBusy(true);
    setError("");
    try {
      const { data } = await api.get(`/workers/${workerId}/contact`);
      setInfo(data);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  if (info)
    return (
      <div className="contact-open">
        <strong className="phone">{formatPhone(info.phone)}</strong>
        {info.isSample ? (
          <p className="muted small">{t("sampleNote")}</p>
        ) : (
          <div className="row-gap">
            <a className="btn btn-primary btn-sm" href={`tel:${info.phone}`}>📞 {t("call")}</a>
            <a className="btn btn-wa btn-sm" href={waLink(info.phone)} target="_blank" rel="noreferrer">
              💬 {t("whatsapp")}
            </a>
          </div>
        )}
      </div>
    );

  return (
    <div>
      {error && <div className="alert">{error}</div>}
      <button className="btn btn-primary btn-block" onClick={reveal} disabled={busy}>
        {busy ? <span className="spinner sm" /> : `📞 ${t("showNumber")}`}
      </button>
    </div>
  );
}
