import { ChevronLeft, CheckCircle2, LogOut, AlertTriangle } from "lucide-react";
import { AppState } from "@/lib/state";
import { Translations } from "@/lib/i18n";
import ResetMenu from "@/components/ResetMenu";

interface Props {
  state: AppState;
  t: Translations;
  onStateChange: (state: AppState) => void;
}

export default function CheckoutPage({ state, t, onStateChange }: Props) {
  const herePeople = state.people.filter((p) => p.status === "here");
  const leftPeople = state.people.filter((p) => p.status === "left");
  const notHerePeople = state.people.filter((p) => p.status === "not_here");
  const allLeft = herePeople.length === 0;

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <button
          onClick={backToCheckin}
          className="flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {t.checkout.backToCheckin}
        </button>
        <span className="text-sm font-semibold text-foreground">{t.appName}</span>
        <ResetMenu t={t} state={state} onStateChange={onStateChange} />
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
        {/* All gone banner */}
        {allLeft && herePeople.length === 0 && leftPeople.length > 0 && (
          <div className="flex flex-col items-center gap-2 py-6 px-4 rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
            <p className="text-lg font-bold text-green-800 dark:text-green-300">
              {t.checkout.everyoneLeft}
            </p>
            <p className="text-sm text-green-700 dark:text-green-400">
              {t.checkout.everyoneLeftHint}
            </p>
          </div>
        )}

        {/* Here section — primary, large tap targets */}
        {herePeople.length > 0 && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">
                {t.checkout.hereLabel}
              </h2>
              <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium">
                {herePeople.length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground -mt-1">
              Tap a name to mark them as left
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
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <LogOut className="w-4 h-4" />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Not here section */}
        {notHerePeople.length > 0 && (
          <section className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-semibold text-muted-foreground">
                {t.checkout.notHereLabel}
              </h2>
              <span className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full px-2 py-0.5 font-medium">
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

        {/* Left section — subtle */}
        {leftPeople.length > 0 && (
          <section className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-muted-foreground">
                {t.checkout.leftLabel}
              </h2>
              <span className="text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5 font-medium">
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
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </button>
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
