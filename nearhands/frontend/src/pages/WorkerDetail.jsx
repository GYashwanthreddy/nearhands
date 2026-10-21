import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { errMsg } from "../api";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import Avatar from "../components/Avatar";
import ContactBox from "../components/ContactBox";
import { StarInput, Stars } from "../components/Stars";
import { fmtDate } from "../utils";

export default function WorkerDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t, trade, city, pickBio } = useLang();

  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [formMsg, setFormMsg] = useState({ type: "", text: "" });

  const load = useCallback(async () => {
    try {
      const [w, r] = await Promise.all([api.get(`/workers/${id}`), api.get(`/workers/${id}/reviews`)]);
      setWorker(w.data.worker);
      setReviews(r.data.reviews);
    } catch (e) {
      setError(errMsg(e));
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const submitReview = async (e) => {
    e.preventDefault();
    setBusy(true);
    setFormMsg({ type: "", text: "" });
    try {
      await api.post(`/workers/${id}/reviews`, { rating, comment });
      setRating(0);
      setComment("");
      setFormMsg({ type: "ok", text: t("thanks") });
      await load();
    } catch (err) {
      setFormMsg({ type: "error", text: errMsg(err) });
    } finally {
      setBusy(false);
    }
  };

  const removeReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      await load();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  if (error && !worker)
    return (
      <div className="container">
        <div className="alert">{error}</div>
        <Link to="/">← {t("back")}</Link>
      </div>
    );
  if (!worker) return <div className="center-screen"><div className="spinner" /></div>;

  return (
    <div className="container narrow">
      <Link to="/">← {t("back")}</Link>
      {error && <div className="alert">{error}</div>}

      <div className="card detail-head">
        <Avatar name={worker.name} photoUrl={worker.photoUrl} size={110} />
        <div className="detail-info">
          <h1>
            {worker.name} {worker.isSample && <span className="badge tiny">{t("sample")}</span>}
          </h1>
          <div className="chips">
            <span className="badge brand">{trade(worker.trade)}</span>
            <span className="badge">📍 {city(worker.city)}</span>
          </div>
          <div className="wcard-rating">
            {worker.ratingCount > 0 ? (
              <>
                <Stars value={worker.ratingAvg} />
                <strong>{worker.ratingAvg.toFixed(1)}</strong>
                <span className="muted small">({worker.ratingCount} {t("reviewsWord")})</span>
              </>
            ) : (
              <span className="muted small">{t("noRatings")}</span>
            )}
          </div>
          <div className="wcard-meta">
            <div>
              <span className="muted small">{t("expectedRate")} </span>
              <span className="rate">₹{worker.ratePerHour}</span>
              <span className="muted">{t("perHour")}</span>
            </div>
            <span className="muted small">{worker.experienceYears} {t("yrs")}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>{t("about")}</h2>
        <p className="bio">{pickBio(worker.bio)}</p>
        <div className="mt">
          <ContactBox workerId={worker._id} />
        </div>
      </div>

      <div className="card">
        <h2>{t("reviews")}</h2>
        {reviews.length === 0 ? (
          <p className="muted">{t("noReviews")}</p>
        ) : (
          <div className="list mt">
            {reviews.map((r) => (
              <div key={r._id} className="review">
                <div className="row-between">
                  <div>
                    <strong>{r.customerName}</strong> <Stars value={r.rating} />
                  </div>
                  <span className="muted small">{fmtDate(r.createdAt)}</span>
                </div>
                {r.comment && <p>{r.comment}</p>}
                {user?.role === "admin" && (
                  <button className="btn btn-ghost btn-sm" onClick={() => removeReview(r._id)}>
                    {t("del")}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2>{t("writeReview")}</h2>
        {!user && <p className="muted">{t("loginToReview")} <Link to="/login">{t("login")}</Link></p>}
        {user && user.role !== "customer" && <p className="muted">{t("onlyCustomers")}</p>}
        {user?.role === "customer" && (
          <form onSubmit={submitReview} className="mt">
            {formMsg.text && (
              <div className={formMsg.type === "ok" ? "notice" : "alert"}>{formMsg.text}</div>
            )}
            <div className="field">
              <label>{t("yourRating")}</label>
              <StarInput value={rating} onChange={setRating} />
            </div>
            <div className="field">
              <label>{t("comment")}</label>
              <textarea rows={3} maxLength={500} value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>
            <button className="btn btn-primary" disabled={busy || rating === 0}>
              {busy ? <span className="spinner sm" /> : t("submit")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
