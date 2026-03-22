import { useEffect, useRef, useState } from "react";
import { ChevronLeft, CheckCircle2, LogOut, RefreshCw, CalendarDays, Pencil } from "lucide-react";
import { AppState } from "@/lib/state";
import { Locale, Translations } from "@/lib/i18n";
import { formatEventDate, todayISO } from "@/lib/dateUtils";
import ResetButton from "@/components/ResetButton";
import ShareButton from "@/components/ShareButton";
import HeaderOverflowMenu from "@/components/HeaderOverflowMenu";
import ExportButton from "@/components/ExportButton";

interface Props {
  state: AppState;
  t: Translations;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onStateChange: (state: AppState) => void;
}

export default function CheckoutPage({ state, t, locale, onLocaleChange, onStateChange }: Props) {
  const herePeople = state.people.filter((p) => p.status === "here");
  const leftPeople = state.people.filter((p) => p.status === "left");
  const notHerePeople = state.people.filter((p) => p.status === "not_here");
  const allLeft = herePeople.length === 0 && leftPeople.length > 0;
  const [restartModal, setRestartModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const displayISO = state.eventDate ?? todayISO();
  const formattedDate = formatEventDate(displayISO, locale, t.common.lastWeekday);

  useEffect(() => {
    if (showDatePicker && dateInputRef.current) {
      dateInputRef.current.focus();
      try { dateInputRef.current.showPicker(); } catch {}
    }
  }, [showDatePicker]);

  function markLeft(id: string) {
    const updated = state.people.map((p) =>
      p.id === id ? { ...p, status: "left" as const } : p
    );
    onStateChange({ ...state, people: updated });
  }

  function markBackHere(id: string) {
    const updated = state.people.map((p) =>
      p.id === id ? { ...p, status: "here" as const } : p
    );
    onStateChange({ ...state, people: updated });
  }

  function backToCheckin() {
    onStateChange({ ...state, phase: "checkin" });
  }

  function backToSetup() {
    onStateChange({ ...state, phase: "setup" });
  }

  function handleReset() {
    const reset = state.people.map((p) =>
      p.status === "left" ? { ...p, status: "here" as const } : p
    );
    onStateChange({ ...state, people: reset });
  }

  function handleRestart() {
    const reset = state.people.map((p) => ({ ...p, status: "pending" as const }));
    onStateChange({ phase: "checkin", people: reset, currentIndex: 0, eventDate: undefined });
    setRestartModal(false);
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setShowDatePicker(false);
    if (val) onStateChange({ ...state, eventDate: val });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header + progress bar */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <header className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={backToCheckin}
            className="flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t.checkout.backToCheckin}</span>
          </button>
          <span className="text-sm font-semibold text-foreground">{t.checkout.title}</span>
          <div className="flex items-center gap-1">
            <ShareButton t={t} state={state} />
            <ResetButton
              t={t}
              confirmMessage={t.checkout.resetConfirm}
              onConfirm={handleReset}
              disabled={leftPeople.length === 0}
            />
            <HeaderOverflowMenu
              currentLocale={locale}
              onLocaleChange={onLocaleChange}
              onBackToSetup={backToSetup}
              backToSetupLabel={t.setup.peopleList}
              privacyLabel={t.privacy.title}
            />
          </div>
        </header>
        <div className="w-full h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(herePeople.length + leftPeople.length) > 0 ? (leftPeople.length / (herePeople.length + leftPeople.length)) * 100 : 0}%` }}
          />
        </div>

        {/* Date bar */}
        <div className="flex items-center justify-center py-1.5 border-b border-border/50">
          {showDatePicker ? (
            <input
              ref={dateInputRef}
              type="date"
              className="text-sm text-foreground bg-transparent border border-border rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-primary"
              value={displayISO}
              onChange={handleDateChange}
              onBlur={() => setShowDatePicker(false)}
            />
          ) : (
            <button
              onClick={() => setShowDatePicker(true)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span className="capitalize">{formattedDate}</span>
              <Pencil className="w-3 h-3 opacity-40" />
            </button>
          )}
        </div>
      </div>

      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
        {/* All gone banner */}
        {allLeft && (
          <div className="flex flex-col items-center gap-3 py-6 px-4 rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
            <p className="text-lg font-bold text-green-800 dark:text-green-300">
              {t.checkout.everyoneLeft}
            </p>
            <p className="text-sm text-green-700 dark:text-green-400">
              {t.checkout.everyoneLeftHint}
            </p>
            <div className="flex items-center gap-3 mt-1 flex-wrap justify-center">
              <ExportButton people={state.people} t={t} appName={t.appName} eventDate={state.eventDate} />
              <button
                onClick={() => setRestartModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-colors active:opacity-80"
              >
                <RefreshCw className="w-4 h-4" />
                {t.checkout.restart}
              </button>
            </div>
          </div>
        )}

        {/* Restart confirm modal */}
        {restartModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setRestartModal(false)}
            />
            <div className="relative z-10 bg-card border border-border rounded-2xl shadow-xl max-w-sm w-full p-6 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-foreground">{t.reset.confirmTitle}</h2>
              <p className="text-sm text-muted-foreground">{t.checkout.restartConfirm}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setRestartModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
                >
                  {t.reset.cancel}
                </button>
                <button
                  onClick={handleRestart}
                  className="flex-1 py-2.5 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  {t.reset.confirmYes}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Here section — primary, large tap targets */}
        {herePeople.length > 0 && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">
                {t.checkout.hereLabel}
              </h2>
              <span className="text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5 font-medium">
                {herePeople.length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground -mt-1">
              {t.checkout.tapToMarkLeft}
            </p>
            <ul className="flex flex-col gap-2">
              {herePeople.map((person) => (
                <li key={person.id}>
                  <button
                    onClick={() => markLeft(person.id)}
                    className="w-full flex items-center justify-between px-4 py-4 rounded-xl bg-card border border-border shadow-sm active:scale-98 active:opacity-80 hover:bg-muted/50 transition-all text-left"
                  >
                    <span className="text-lg font-semibold text-foreground">
                      {person.name}
                    </span>
                    <LogOut className="w-4 h-4 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Left section — subtle */}
        {leftPeople.length > 0 && (
          <section className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-muted-foreground">
                {t.checkout.leftLabel}
              </h2>
              <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium">
                {leftPeople.length}
              </span>
            </div>
            <ul className="flex flex-col gap-1">
              {leftPeople.map((person) => (
                <li key={person.id}>
                  <button
                    onClick={() => markBackHere(person.id)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-muted/20 border border-border/40 hover:bg-muted/40 transition-colors text-left opacity-60 hover:opacity-100"
                  >
                    <span className="text-sm text-muted-foreground line-through">
                      {person.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Not here section — always at the bottom */}
        {notHerePeople.length > 0 && (
          <section className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-muted-foreground">
                {t.checkout.notHereLabel}
              </h2>
              <span className="text-xs bg-red-400/20 text-red-500 dark:text-red-400 rounded-full px-2 py-0.5 font-medium">
                {notHerePeople.length}
              </span>
            </div>
            <ul className="flex flex-col gap-1">
              {notHerePeople.map((person) => (
                <li
                  key={person.id}
                  className="flex items-center px-3 py-2.5 rounded-lg bg-muted/30 border border-border/50"
                >
                  <span className="text-sm text-muted-foreground">{person.name}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Empty state */}
        {herePeople.length === 0 && leftPeople.length === 0 && notHerePeople.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
            <LogOut className="w-12 h-12 opacity-20" />
            <p className="text-sm">{t.checkout.noOneLeft}</p>
          </div>
        )}
      </main>
    </div>
  );
}
