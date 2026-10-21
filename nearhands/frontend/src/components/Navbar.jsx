import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLang();
  const nav = useNavigate();

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="logo">N</span>
          NearHands
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end>{t("navFind")}</NavLink>
          {user?.role === "worker" && <NavLink to="/my-profile">{t("navProfile")}</NavLink>}
          {user?.role === "admin" && <NavLink to="/admin">{t("navAdmin")}</NavLink>}
        </nav>

        <div className="nav-right">
          <div className="lang-toggle" role="group" aria-label="Language">
            <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
            <button className={lang === "te" ? "on" : ""} onClick={() => setLang("te")}>తె</button>
          </div>

          {user ? (
            <>
              <span className="hide-sm nav-name">{user.name}</span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  logout();
                  nav("/");
                }}
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">{t("login")}</Link>
              <Link to="/register" className="btn btn-primary btn-sm">{t("register")}</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
