import { useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle, Users, ChevronRight } from "lucide-react";
import { AppState, PersonStatus } from "@/lib/state";
import { Locale, Translations } from "@/lib/i18n";
import ResetButton from "@/components/ResetButton";
import ShareButton from "@/components/ShareButton";
import HeaderOverflowMenu from "@/components/HeaderOverflowMenu";

interface Props {
  state: AppState;
  t: Translations;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onStateChange: (state: AppState) => void;
}

export default function CheckinPage({ state, t, locale, onLocaleChange, onStateChange }: Props) {
  const { people } = state;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});

  const handledCount = people.filter((p) => p.status !== "pending").length;
  const allDone = people.every((p) => p.status !== "pending");

  useEffect(() => {
    const first = people.find((p) => p.status === "pending");
    const id = first?.id ?? null;
    setSelectedId(id);
  }, []);

  useEffect(() => {
    if (selectedId && itemRefs.current[selectedId]) {
      itemRefs.current[selectedId]!.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedId]);

  function mark(id: string, status: PersonStatus) {
    const updated = people.map((p) => (p.id === id ? { ...p, status } : p));
    const nowAllDone = updated.every((p) => p.status !== "pending");
    if (nowAllDone) {
      onStateChange({ ...state, people: updated });
      setSelectedId(null);
      return;
    }
    const nextPending = updated.find((p) => p.status === "pending");
    onStateChange({ ...state, people: updated });
    setSelectedId(nextPending?.id ?? null);
  }

  function goToCheckout() {
    onStateChange({ ...state, phase: "checkout" });
  }

  function backToSetup() {
    onStateChange({ ...state, phase: "setup" });
  }

  function handleReset() {
    const reset = people.map((p) => ({ ...p, status: "pending" as const }));
    onStateChange({ ...state, people: reset, currentIndex: 0 });
    setSelectedId(reset[0]?.id ?? null);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">{t.appName}</h1>
        </div>
        <div className="flex items-center gap-1">
          <ShareButton t={t} state={state} />
          <ResetButton
            t={t}
            confirmMessage={t.checkin.resetConfirm}
            onConfirm={handleReset}
          />
          <HeaderOverflowMenu
            currentLocale={locale}
            onLocaleChange={onLocaleChange}
            onBackToSetup={backToSetup}
            backToSetupLabel={t.setup.peopleList}
          />
        </div>
      </header>

      <div className="w-full h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(handledCount / people.length) * 100}%` }}
        />
      </div>

      <div className="px-4 pt-3 pb-1 flex justify-between items-center max-w-xl mx-auto w-full">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
          {t.checkin.title}
        </p>
        <span className="text-xs text-muted-foreground font-medium tabular-nums">
          {handledCount} / {people.length}
        </span>
      </div>

      <main className="max-w-xl mx-auto w-full px-4 pt-[40vh] pb-[50vh]">
        <ul className="flex flex-col gap-2">
          {people.map((person) => {
            const isSelected = person.id === selectedId;

            return (
              <li
                key={person.id}
                ref={(el) => { itemRefs.current[person.id] = el; }}
              >
                {isSelected ? (
                  <div className="rounded-2xl bg-card border-2 border-primary shadow-lg p-4 flex flex-col gap-3">
                    <p className="text-2xl font-bold text-foreground text-center leading-tight break-words">
                      {person.name}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => mark(person.id, "not_here")}
                        className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all active:scale-95 flex flex-col items-center gap-1 text-white
                          ${person.status === "not_here"
                            ? "bg-red-400 ring-2 ring-red-300/60"
                            : "bg-red-400/80 dark:bg-red-500/60"
                          }`}
                      >
                        <XCircle className="w-6 h-6" />
                        {t.checkin.notHereButton}
                      </button>
                      <button
                        onClick={() => mark(person.id, "here")}
                        className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all active:scale-95 flex flex-col items-center gap-1 text-white
                          ${person.status === "here"
                            ? "bg-primary ring-4 ring-primary/40"
                            : "bg-primary/70 dark:bg-primary/50"
                          }`}
                      >
                        <CheckCircle2 className="w-6 h-6" />
                        {t.checkin.hereButton}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedId(person.id)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors text-left"
                  >
                    <span className="text-base font-medium text-foreground">
                      {person.name}
                    </span>
                    {(person.status === "here" || person.status === "left") && (
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    )}
                    {person.status === "not_here" && (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    {person.status === "pending" && (
                      <span className="w-4 h-4 shrink-0" />
                    )}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </main>

      {allDone && (
        <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-background via-background to-transparent pb-6">
          <div className="max-w-xl mx-auto">
            <button
              onClick={goToCheckout}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg transition-colors active:opacity-80 shadow-lg"
            >
              {t.checkin.goToCheckout}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
