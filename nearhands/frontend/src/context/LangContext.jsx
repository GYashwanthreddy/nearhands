import { createContext, useContext, useEffect, useState } from "react";
import { UI, TRADE_LABELS, CITY_LABELS } from "../i18n";

const LangContext = createContext(null);
export const useLang = () => useContext(LangContext);

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem("lang") === "te" ? "te" : "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {
      /* storage can be blocked, the app still works */
    }
  };

  const t = (key) => UI[lang][key] ?? UI.en[key] ?? key;
  const trade = (k) => TRADE_LABELS[lang][k] || k;
  const city = (c) => CITY_LABELS[lang][c] || c;
  // Show the bio in the chosen language, fall back to whichever version exists
  const pickBio = (bio) => bio?.[lang] || bio?.en || bio?.te || "";

  return (
    <LangContext.Provider value={{ lang, setLang, t, trade, city, pickBio }}>
      {children}
    </LangContext.Provider>
  );
}
