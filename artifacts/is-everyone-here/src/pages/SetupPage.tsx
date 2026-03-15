import { useState, useRef } from "react";
import { Plus, Trash2, Users, ClipboardList, ChevronRight } from "lucide-react";
import { AppState, Person, generateId } from "@/lib/state";
import { Translations } from "@/lib/i18n";
import ResetMenu from "@/components/ResetMenu";

interface Props {
  state: AppState;
  t: Translations;
  onStateChange: (state: AppState) => void;
}

export default function SetupPage({ state, t, onStateChange }: Props) {
  const [pasteText, setPasteText] = useState("");
  const [singleName, setSingleName] = useState("");
  const [pasteError, setPasteError] = useState("");
  const singleInputRef = useRef<HTMLInputElement>(null);

  function addFromPaste() {
    const names = pasteText
      .split("\n")
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    if (names.length === 0) {
      setPasteError(t.setup.noNamesError);
      return;
    }
    setPasteError("");
    const existing = new Set(state.people.map((p) => p.name.toLowerCase()));
    const newPeople: Person[] = names
      .filter((n) => !existing.has(n.toLowerCase()))
      .map((name) => ({ id: generateId(), name, status: "pending" }));
    onStateChange({ ...state, people: [...state.people, ...newPeople] });
    setPasteText("");
  }

  function addSingle() {
    const name = singleName.trim();
    if (!name) return;
    const exists = state.people.some(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
    if (!exists) {
      const newPerson: Person = { id: generateId(), name, status: "pending" };
      onStateChange({ ...state, people: [...state.people, newPerson] });
    }
    setSingleName("");
    singleInputRef.current?.focus();
  }

  function removePerson(id: string) {
    onStateChange({
      ...state,
      people: state.people.filter((p) => p.id !== id),
    });
  }

  function startCheckin() {
    if (state.people.length === 0) return;
    onStateChange({ ...state, phase: "checkin", currentIndex: 0 });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">{t.appName}</h1>
        </div>
        <ResetMenu t={t} state={state} onStateChange={onStateChange} />
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
        {/* Paste section */}
        <section className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-foreground">
            {t.setup.pasteLabel}
          </label>
          <textarea
            className="w-full min-h-[120px] rounded-lg border border-border bg-card text-foreground px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder={t.setup.pastePlaceholder}
            value={pasteText}
            onChange={(e) => {
              setPasteText(e.target.value);
              setPasteError("");
            }}
          />
          {pasteError && (
            <p className="text-destructive text-xs">{pasteError}</p>
          )}
          <button
            onClick={addFromPaste}
            disabled={!pasteText.trim()}
            className="flex items-center gap-2 justify-center w-full py-2.5 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm disabled:opacity-40 active:opacity-80 transition-opacity"
          >
            <ClipboardList className="w-4 h-4" />
            {t.setup.addPasteButton}
          </button>
        </section>

        {/* Single add */}
        <section className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-foreground">
            {t.setup.addOneLabel}
          </label>
          <div className="flex gap-2">
            <input
              ref={singleInputRef}
              type="text"
              className="flex-1 rounded-lg border border-border bg-card text-foreground px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={t.setup.addOnePlaceholder}
              value={singleName}
              onChange={(e) => setSingleName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSingle()}
            />
            <button
              onClick={addSingle}
              disabled={!singleName.trim()}
              className="flex items-center gap-1 px-4 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm disabled:opacity-40 active:opacity-80 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              {t.setup.addOneButton}
            </button>
          </div>
        </section>

        {/* People list */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              {t.setup.peopleList}
            </h2>
            <span className="text-xs text-muted-foreground">
              {state.people.length} {state.people.length === 1 ? t.common.person : t.common.persons}
            </span>
          </div>

          {state.people.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
              <Users className="w-10 h-10 opacity-30" />
              <p className="text-sm">{t.setup.noPeople}</p>
              <p className="text-xs">{t.setup.noPeopleHint}</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-1">
              {state.people.map((person) => (
                <li
                  key={person.id}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-card border border-border"
                >
                  <span className="text-sm text-foreground">{person.name}</span>
                  <button
                    onClick={() => removePerson(person.id)}
                    className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors"
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
      <div className="sticky bottom-0 bg-background border-t border-border px-4 py-4">
        <button
          onClick={startCheckin}
          disabled={state.people.length === 0}
          className="w-full max-w-xl mx-auto flex items-center justify-center gap-2 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg disabled:opacity-40 active:opacity-80 transition-opacity"
        >
          {t.setup.startCheckin}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
