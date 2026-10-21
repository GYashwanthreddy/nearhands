import { Link } from "react-router-dom";
import { useLang } from "../context/LangContext";
import Avatar from "./Avatar";
import { Stars } from "./Stars";
import ContactBox from "./ContactBox";

// The search result card: photo, name, trade, city, rating, rate and contact
export default function WorkerCard({ w }) {
  const { t, trade, city, pickBio } = useLang();

  return (
    <article className="card wcard">
      <div className="wcard-top">
        <Avatar name={w.name} photoUrl={w.photoUrl} size={64} />
        <div className="wcard-id">
          <h3>
            {w.name} {w.isSample && <span className="badge tiny">{t("sample")}</span>}
          </h3>
          <div className="chips">
            <span className="badge brand">{trade(w.trade)}</span>
            <span className="badge">📍 {city(w.city)}</span>
          </div>
        </div>
      </div>

      <div className="wcard-rating">
        {w.ratingCount > 0 ? (
          <>
            <Stars value={w.ratingAvg} />
            <strong>{w.ratingAvg.toFixed(1)}</strong>
            <span className="muted small">({w.ratingCount} {t("reviewsWord")})</span>
          </>
        ) : (
          <span className="muted small">{t("noRatings")}</span>
        )}
      </div>

      <div className="wcard-meta">
        <div>
          <span className="rate">₹{w.ratePerHour}</span>
          <span className="muted">{t("perHour")}</span>
        </div>
        <span className="muted small">{w.experienceYears} {t("yrs")}</span>
      </div>

      <p className="wcard-bio">{pickBio(w.bio)}</p>

      <ContactBox workerId={w._id} />
      <Link to={`/worker/${w._id}`} className="link-center">{t("viewProfile")} →</Link>
    </article>
  );
}
