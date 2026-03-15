import { useState, useEffect, useCallback } from "react";
import { AppState, getStateFromUrl, saveStateToUrl, createInitialState } from "@/lib/state";
import { detectLocale, translations } from "@/lib/i18n";
import SetupPage from "@/pages/SetupPage";
import CheckinPage from "@/pages/CheckinPage";
import CheckoutPage from "@/pages/CheckoutPage";

const locale = detectLocale();
const t = translations[locale];

function App() {
  const [state, setState] = useState<AppState>(() => {
    return getStateFromUrl() ?? createInitialState();
  });

  const handleStateChange = useCallback((newState: AppState) => {
    setState(newState);
    saveStateToUrl(newState);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const s = getStateFromUrl();
      if (s) setState(s);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  if (state.phase === "setup") {
    return <SetupPage state={state} t={t} onStateChange={handleStateChange} />;
  }
  if (state.phase === "checkin") {
    return <CheckinPage state={state} t={t} onStateChange={handleStateChange} />;
  }
  return <CheckoutPage state={state} t={t} onStateChange={handleStateChange} />;
}

export default App;
