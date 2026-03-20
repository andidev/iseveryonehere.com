import { useState, useRef } from "react";
import { Plus, Trash2, Users, ChevronRight, ArrowUpAZ, GripVertical } from "lucide-react";
import { AppState, Person, generateId } from "@/lib/state";
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

function capitalizeName(name: string): string {
  return name
    .split(" ")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function isSorted(people: Person[]): boolean {
  for (let i = 1; i < people.length; i++) {
    if (people[i].name.localeCompare(people[i - 1].name) < 0) return false;
  }
  return true;
}

export default function SetupPage({ state, t, locale, onLocaleChange, onStateChange }: Props) {
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState("");
  const [dupMessage, setDupMessage] = useState("");
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragIndexRef = useRef<number | null>(null);

  function showDup(names: string[]) {
    if (dupTimerRef.current) clearTimeout(dupTimerRef.current);
    setDupMessage(`${t.setup.alreadyAdded}: ${names.join(", ")}`);
    dupTimerRef.current = setTimeout(() => setDupMessage(""), 3000);
  }

  function addPersons() {
    const names = inputText
      .split("\n")
      .map((n) => capitalizeName(n.trim()))
      .filter((n) => n.length > 0);
    if (names.length === 0) {
      setError(t.setup.noNamesError);
      return;
    }
    setError("");
    const existing = new Set(state.people.map((p) => p.name.toLowerCase()));
    const dups = names.filter((n) => existing.has(n.toLowerCase()));
    const newPeople: Person[] = names
      .filter((n) => !existing.has(n.toLowerCase()))
      .map((name) => ({ id: generateId(), name, status: "pending" }));

    if (dups.length > 0) showDup(dups);
    onStateChange({ ...state, people: [...state.people, ...newPeople] });
    setInputText("");
  }

  function removePerson(id: string) {
    onStateChange({
      ...state,
      people: state.people.filter((p) => p.id !== id),
    });
  }

  function sortPeople() {
    const sorted = [...state.people].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    onStateChange({ ...state, people: sorted });
  }

  const checkedCount = state.people.filter((p) => p.status !== "pending").length;
  const allChecked = state.people.length > 0 && checkedCount === state.people.length;
  const someChecked = checkedCount > 0 && !allChecked;

  const buttonLabel = allChecked
    ? t.setup.continueCheckout
    : someChecked
    ? t.setup.continueCheckin
    : t.setup.startCheckin;

  function startCheckin() {
    if (state.people.length === 0) return;
    if (allChecked) {
      onStateChange({ ...state, phase: "checkout" });
    } else {
      const firstPendingIndex = state.people.findIndex((p) => p.status === "pending");
      onStateChange({ ...state, phase: "checkin", currentIndex: Math.max(0, firstPendingIndex) });
    }
  }

  function handleReset() {
    onStateChange({ phase: "setup", people: [], currentIndex: 0 });
  }

  // Drag-and-drop handlers
  function onDragStart(index: number) {
    dragIndexRef.current = index;
  }

  function onDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    setDragOverIndex(index);
  }

  function onDrop(targetIndex: number) {
    const fromIndex = dragIndexRef.current;
    if (fromIndex === null || fromIndex === targetIndex) {
      setDragOverIndex(null);
      return;
    }
    const people = [...state.people];
    const [moved] = people.splice(fromIndex, 1);
    people.splice(targetIndex, 0, moved);
    dragIndexRef.current = null;
    setDragOverIndex(null);
    onStateChange({ ...state, people });
  }

  function onDragEnd() {
    dragIndexRef.current = null;
    setDragOverIndex(null);
  }

  const sorted = state.people.length < 2 || isSorted(state.people);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">{t.appName}</h1>
        </div>
        <div className="flex items-center gap-1">
          <HeaderOverflowMenu currentLocale={locale} onLocaleChange={onLocaleChange} />
          <ShareButton t={t} state={state} />
          <ResetButton
            t={t}
            confirmMessage={t.setup.resetConfirm}
            onConfirm={handleReset}
            disabled={state.people.length === 0}
          />
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
        {/* Add persons section */}
        <section className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-foreground">
            {t.setup.addPersonsLabel}
          </label>
          <textarea
            className="w-full min-h-[120px] rounded-lg border border-border bg-card text-foreground px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder={t.setup.addPersonsPlaceholder}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !inputText.includes("\n")) {
                e.preventDefault();
                addPersons();
              }
            }}
          />
          {error && <p className="text-destructive text-xs">{error}</p>}
          {dupMessage && (
            <p className="text-amber-600 dark:text-amber-400 text-xs">{dupMessage}</p>
          )}
          <button
            onClick={addPersons}
            disabled={!inputText.trim()}
            className="flex items-center gap-2 justify-center w-full py-3 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm disabled:opacity-40 active:opacity-80 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            {t.setup.addButton}
          </button>
        </section>

        {/* People list */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              {t.setup.peopleList}
            </h2>
            <div className="flex items-center gap-2">
              {!sorted && (
                <button
                  onClick={sortPeople}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowUpAZ className="w-3.5 h-3.5" />
                  {t.setup.sortByName}
                </button>
              )}
              <span className="text-xs text-muted-foreground">
                {state.people.length}{" "}
                {state.people.length === 1 ? t.common.person : t.common.persons}
              </span>
            </div>
          </div>

          {state.people.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
              <Users className="w-10 h-10 opacity-30" />
              <p className="text-sm">{t.setup.noPeople}</p>
              <p className="text-xs">{t.setup.noPeopleHint}</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-1">
              {state.people.map((person, index) => (
                <li
                  key={person.id}
                  draggable
                  onDragStart={() => onDragStart(index)}
                  onDragOver={(e) => onDragOver(e, index)}
                  onDrop={() => onDrop(index)}
                  onDragEnd={onDragEnd}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg bg-card border transition-colors cursor-grab active:cursor-grabbing select-none
                    ${dragOverIndex === index && dragIndexRef.current !== index
                      ? "border-primary bg-primary/5"
                      : "border-border"
                    }`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <GripVertical className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                    <span className="text-sm text-foreground truncate">{person.name}</span>
                  </div>
                  <button
                    onClick={() => removePerson(person.id)}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                    aria-label={t.setup.removePerson}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* Start button */}
      <div className="sticky bottom-0 bg-background border-t border-border px-4 py-4 flex flex-col items-center gap-3">
        <button
          onClick={startCheckin}
          disabled={state.people.length === 0}
          className="w-full max-w-xl mx-auto flex items-center justify-center gap-2 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg disabled:opacity-40 active:opacity-80 transition-opacity"
        >
          {buttonLabel}
          <ChevronRight className="w-5 h-5" />
        </button>
        <a
          href="#privacy"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {t.privacy.title}
        </a>
      </div>
    </div>
  );
}
