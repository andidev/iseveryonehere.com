import { useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle, ChevronRight, LogOut, CalendarDays, Pencil } from "lucide-react";
import { AppState, PersonStatus } from "@/lib/state";
import { Locale, Translations } from "@/lib/i18n";
import { todayISO, formatEventDate } from "@/lib/dateUtils";
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
  const [liveDate, setLiveDate] = useState(todayISO);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handledCount = people.filter((p) => p.status !== "pending").length;
  const allDone = people.every((p) => p.status !== "pending");
  const checkoutStarted = people.some((p) => p.status === "left");

  const displayISO = state.eventDate ?? liveDate;
  const formattedDate = formatEventDate(displayISO, locale, t.common.lastWeekday);

  // Update live date at midnight
  useEffect(() => {
    const id = setInterval(() => setLiveDate(todayISO()), 60_000);
    return () => clearInterval(id);
  }, []);

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

  // Auto-focus date input when shown
  useEffect(() => {
    if (showDatePicker && dateInputRef.current) {
      dateInputRef.current.focus();
      try { dateInputRef.current.showPicker(); } catch {}
    }
  }, [showDatePicker]);

  function mark(id: string, status: PersonStatus) {
    const current = people.find((p) => p.id === id);
    const newStatus: PersonStatus = current?.status === status ? "pending" : status;
    const updated = people.map((p) => (p.id === id ? { ...p, status: newStatus } : p));

    // Auto-set eventDate when the first person is marked (if not already set)
    const wasAllPending = people.every((p) => p.status === "pending");
    const autoDate = !state.eventDate && newStatus !== "pending" && wasAllPending
      ? liveDate
      : state.eventDate;

    const nowAllDone = updated.every((p) => p.status !== "pending");
    if (nowAllDone) {
      onStateChange({ ...state, people: updated, eventDate: autoDate });
      setSelectedId(null);
      return;
    }
    const nextPending = updated.find((p) => p.status === "pending");
    onStateChange({ ...state, people: updated, eventDate: autoDate });
    if (newStatus === "pending") return;
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
    onStateChange({ ...state, people: reset, currentIndex: 0, eventDate: undefined });
    setSelectedId(reset[0]?.id ?? null);
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setShowDatePicker(false);
    if (val) onStateChange({ ...state, eventDate: val });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <header className="relative px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="w-6 h-6 rounded-md" />
            <h1 className="text-lg font-bold text-foreground">{t.appName}</h1>
          </div>
          <span className="hidden sm:block absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-foreground pointer-events-none">
            {t.checkin.title}
          </span>
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
              privacyLabel={t.privacy.title}
            />
          </div>
        </header>
        <div className="w-full h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(handledCount / people.length) * 100}%` }}
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
                  <div
                    className="rounded-2xl bg-card border-2 border-border shadow-lg p-4 flex flex-col gap-3 cursor-pointer"
                    onClick={() => setSelectedId(null)}
                  >
                    <p
                      className={`text-2xl font-bold text-center leading-tight break-words ${person.status === "left" ? "line-through" : "text-foreground"}`}
                      style={person.status === "left" ? { color: "#adafb4" } : undefined}
                    >
                      {person.name}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); mark(person.id, "not_here"); }}
                        className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all active:scale-95 flex flex-col items-center gap-1 text-white
                          ${person.status === "not_here"
                            ? "bg-red-400 ring-4 ring-red-300/60"
                            : "bg-red-400/80 dark:bg-red-500/60"
                          }`}
                      >
                        <XCircle className="w-6 h-6" />
                        {t.checkin.notHereButton}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); mark(person.id, "here"); }}
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
                    <span
                      className={`text-base font-medium ${person.status === "left" ? "line-through" : "text-foreground"}`}
                      style={person.status === "left" ? { color: "#adafb4" } : undefined}
                    >
                      {person.name}
                    </span>
                    {person.status === "here" && (
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    )}
                    {person.status === "left" && (
                      <LogOut className="w-4 h-4 shrink-0" style={{ color: "#adafb4" }} />
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

      <div className="fixed bottom-0 left-0 right-0 z-20 p-4 pb-6 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-xl mx-auto">
          {allDone ? (
            <button
              onClick={goToCheckout}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg transition-colors active:opacity-80 shadow-lg"
            >
              {checkoutStarted ? t.setup.continueCheckout : t.checkin.goToCheckout}
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-muted text-muted-foreground font-semibold text-base">
              <span className="tabular-nums">{handledCount} / {people.length}</span>
              <span>{t.checkin.checkedIn}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
