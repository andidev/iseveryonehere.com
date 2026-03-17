import { useState, useEffect, useCallback } from "react";
import { AppState, getStateFromUrl, saveStateToUrl, createInitialState } from "@/lib/state";
import { detectLocale, translations } from "@/lib/i18n";
import SetupPage from "@/pages/SetupPage";
import CheckinPage from "@/pages/CheckinPage";
import CheckoutPage from "@/pages/CheckoutPage";
import PrivacyPage from "@/pages/PrivacyPage";

const locale = detectLocale();
const t = translations[locale];

function isPrivacyHash(hash: string) {
  return hash === "#privacy" || hash === "#privacy/";
}

function App() {
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
    return <PrivacyPage t={t} />;
  }

  if (state.phase === "setup") {
    return <SetupPage state={state} t={t} onStateChange={handleStateChange} />;
  }
  if (state.phase === "checkin") {
    return <CheckinPage state={state} t={t} onStateChange={handleStateChange} />;
  }
  return <CheckoutPage state={state} t={t} onStateChange={handleStateChange} />;
}

export default App;
