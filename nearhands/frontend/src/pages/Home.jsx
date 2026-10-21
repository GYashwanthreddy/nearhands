import { useEffect, useState } from "react";
import api, { errMsg } from "../api";
import { useLang } from "../context/LangContext";
import { CITIES, TRADES } from "../i18n";
import WorkerCard from "../components/WorkerCard";

const SORTS = [
  ["rating", "sortRating"],
  ["rate_low", "sortLow"],
  ["rate_high", "sortHigh"],
  ["experience", "sortExp"],
];

export default function Home() {
  const { t, trade, city } = useLang();
  const [filters, setFilters] = useState({ city: "", trade: "", sort: "rating" });
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Reload the list whenever a filter or the page changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    api
      .get("/workers", { params: { ...filters, page } })
      .then((r) => !cancelled && setData(r.data))
      .catch((e) => !cancelled && setError(errMsg(e)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [filters, page]);

  const update = (key, value) => {
    setPage(1);
    setFilters((f) => ({ ...f, [key]: value }));
  };

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <h1>{t("heroTitle")}</h1>
          <p>{t("heroSub")}</p>
        </div>
      </section>

      <div className="container">
        <div className="card filters">
          <div className="filter-row">
            <div className="field">
              <label>{t("city")}</label>
              <select value={filters.city} onChange={(e) => update("city", e.target.value)}>
                <option value="">{t("allCities")}</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{city(c)}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>{t("sortBy")}</label>
              <select value={filters.sort} onChange={(e) => update("sort", e.target.value)}>
                {SORTS.map(([value, key]) => (
                  <option key={value} value={value}>{t(key)}</option>
                ))}
              </select>
            </div>
          </div>

          <label className="chips-label">{t("workType")}</label>
          <div className="chips scroll">
            <button className={`chip ${filters.trade === "" ? "on" : ""}`} onClick={() => update("trade", "")}>
              {t("all")}
            </button>
            {TRADES.map((k) => (
              <button
                key={k}
                className={`chip ${filters.trade === k ? "on" : ""}`}
                onClick={() => update("trade", k)}
              >
                {trade(k)}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="alert">{error}</div>}

        {!data && loading && (
          <div className="center-screen short"><div className="spinner" /></div>
        )}

        {data && (
          <>
            <p className="muted">{data.total} {t("found")}</p>

            {data.workers.length === 0 ? (
              <div className="card empty">{t("noResults")}</div>
            ) : (
              <div className={`grid ${loading ? "dim" : ""}`}>
                {data.workers.map((w) => (
                  <WorkerCard key={w._id} w={w} />
                ))}
              </div>
            )}

            {data.pages > 1 && (
              <div className="pager">
                <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  ← {t("prev")}
                </button>
                <span className="muted">{t("page")} {data.page} / {data.pages}</span>
                <button className="btn btn-ghost btn-sm" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>
                  {t("next")} →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
