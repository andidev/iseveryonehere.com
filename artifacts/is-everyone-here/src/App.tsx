import { useState, useEffect, useCallback } from "react";
import { AppState, getStateFromUrl, saveStateToUrl, createInitialState } from "@/lib/state";
import {
  Locale,
  detectLocale,
  translations,
  getBrowserLocale,
  setStoredLocale,
} from "@/lib/i18n";
import SetupPage from "@/pages/SetupPage";
import CheckinPage from "@/pages/CheckinPage";
import CheckoutPage from "@/pages/CheckoutPage";
import PrivacyPage from "@/pages/PrivacyPage";

function isPrivacyHash(hash: string) {
  return hash === "#privacy" || hash === "#privacy/";
}

function App() {
  const [locale, setLocale] = useState<Locale>(detectLocale);
  const t = translations[locale];

  const [showPrivacy, setShowPrivacy] = useState(() =>
    isPrivacyHash(window.location.hash)
  );

  const [state, setState] = useState<AppState>(() => {
    if (isPrivacyHash(window.location.hash)) return createInitialState();
    return getStateFromUrl() ?? createInitialState();
  });

  const handleStateChange = useCallback((newState: AppState) => {
    setState(newState);
    saveStateToUrl(newState);
  }, []);

  const handleLocaleChange = useCallback((newLocale: Locale) => {
    const browserLocale = getBrowserLocale();
    setStoredLocale(newLocale === browserLocale ? null : newLocale);
    setLocale(newLocale);
  }, []);

  useEffect(() => {
    function onHashChange() {
      if (isPrivacyHash(window.location.hash)) {
        setShowPrivacy(true);
      } else {
        setShowPrivacy(false);
        const s = getStateFromUrl();
        if (s) setState(s);
      }
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (showPrivacy) {
    return <PrivacyPage t={t} locale={locale} onLocaleChange={handleLocaleChange} />;
  }

  if (state.phase === "setup") {
    return (
      <SetupPage
        state={state}
        t={t}
        locale={locale}
        onLocaleChange={handleLocaleChange}
        onStateChange={handleStateChange}
      />
    );
  }
  if (state.phase === "checkin") {
    return (
      <CheckinPage
        state={state}
        t={t}
        locale={locale}
        onLocaleChange={handleLocaleChange}
        onStateChange={handleStateChange}
      />
    );
  }
  return (
    <CheckoutPage
      state={state}
      t={t}
      locale={locale}
      onLocaleChange={handleLocaleChange}
      onStateChange={handleStateChange}
    />
  );
}

export default App;
