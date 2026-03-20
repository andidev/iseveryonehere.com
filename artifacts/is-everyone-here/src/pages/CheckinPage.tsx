import { CheckCircle2, XCircle, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { AppState, PersonStatus } from "@/lib/state";
import { Locale, Translations } from "@/lib/i18n";
import ResetButton from "@/components/ResetButton";
import ShareButton from "@/components/ShareButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface Props {
  state: AppState;
  t: Translations;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onStateChange: (state: AppState) => void;
}

export default function CheckinPage({ state, t, locale, onLocaleChange, onStateChange }: Props) {
  const { people, currentIndex } = state;
  const current = people[currentIndex];
  const prev = currentIndex > 0 ? people[currentIndex - 1] : null;
  const next = currentIndex < people.length - 1 ? people[currentIndex + 1] : null;

  function markCurrent(status: PersonStatus) {
    const updated = people.map((p, i) =>
      i === currentIndex ? { ...p, status } : p
    );
    const allNowHandled = updated.every((p) => p.status !== "pending");
    if (allNowHandled) {
      onStateChange({ ...state, people: updated, phase: "checkout" });
      return;
    }
    const nextIndex =
      currentIndex < people.length - 1 ? currentIndex + 1 : currentIndex;
    onStateChange({ ...state, people: updated, currentIndex: nextIndex });
  }

  function goTo(index: number) {
    const currentHandled = people[currentIndex].status !== "pending";
    if (index > currentIndex && !currentHandled) return;
    if (index < 0 || index >= people.length) return;
    onStateChange({ ...state, currentIndex: index });
  }

  function backToSetup() {
    onStateChange({ ...state, phase: "setup" });
  }

  function handleReset() {
    const reset = people.map((p) => ({ ...p, status: "pending" as const }));
    onStateChange({ ...state, people: reset, currentIndex: 0 });
  }

  const handledCount = people.filter((p) => p.status !== "pending").length;

  const statusIcon = (status: PersonStatus) => {
    if (status === "here") return <CheckCircle2 className="w-4 h-4 text-primary" />;
    if (status === "not_here") return <XCircle className="w-4 h-4 text-red-500" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <button
          onClick={backToSetup}
          className="flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground transition-colors"
        >
          <Settings className="w-4 h-4" />
          {t.checkin.backToSetup}
        </button>
        <span className="text-xs text-muted-foreground font-medium">
          {handledCount} / {people.length}
        </span>
        <div className="flex items-center gap-1">
          <LanguageSwitcher currentLocale={locale} onLocaleChange={onLocaleChange} />
          <ShareButton t={t} state={state} />
          <ResetButton
            t={t}
            confirmMessage={t.checkin.resetConfirm}
            onConfirm={handleReset}
          />
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(handledCount / people.length) * 100}%` }}
        />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 gap-6 select-none">
        {/* Previous person */}
        {prev ? (
          <button
            onClick={() => goTo(currentIndex - 1)}
            className="w-full max-w-sm flex items-center justify-between px-5 py-3 rounded-xl bg-muted/50 border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <div className="flex items-center gap-2">
              {statusIcon(prev.status)}
              <span className="text-base font-medium">{prev.name}</span>
            </div>
            <ChevronLeft className="w-4 h-4 opacity-0" />
          </button>
        ) : (
          <div className="h-14 w-full max-w-sm" />
        )}

        {/* Current person */}
        <div className="w-full max-w-sm flex flex-col items-center gap-2">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
            {t.checkin.title}
          </p>
          <div className="w-full text-center px-4 py-6 rounded-2xl bg-card border-2 border-primary shadow-lg">
            <p className="text-4xl font-bold text-foreground leading-tight break-words">
              {current.name}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="w-full max-w-sm flex gap-3">
          <button
            onClick={() => markCurrent("not_here")}
            className={`flex-1 py-5 rounded-xl font-bold text-xl transition-all active:scale-95 flex flex-col items-center gap-1 text-white bg-[#9EA4A4]
              ${current.status === "not_here" ? "ring-4 ring-red-300" : ""}`}
          >
            <XCircle className="w-7 h-7" />
            {t.checkin.notHereButton}
          </button>
          <button
            onClick={() => markCurrent("here")}
            className={`flex-1 py-5 rounded-xl font-bold text-xl transition-all active:scale-95 flex flex-col items-center gap-1 text-white
              ${current.status === "here"
                ? "bg-primary ring-4 ring-primary/40"
                : "bg-primary/70 dark:bg-primary/50"
              }`}
          >
            <CheckCircle2 className="w-7 h-7" />
            {t.checkin.hereButton}
          </button>
        </div>

        {/* Next person */}
        {next ? (
          <button
            onClick={() => goTo(currentIndex + 1)}
            disabled={current.status === "pending"}
            className="w-full max-w-sm flex items-center justify-between px-5 py-3 rounded-xl bg-muted/50 border border-border text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4 opacity-0" />
            <div className="flex items-center gap-2">
              {statusIcon(next.status)}
              <span className="text-base font-medium">{next.name}</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="h-14 w-full max-w-sm" />
        )}
      </main>
    </div>
  );
}
