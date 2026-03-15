import { useState } from "react";
import { Plus, Trash2, Users, ChevronRight } from "lucide-react";
import { AppState, Person, generateId } from "@/lib/state";
import { Translations } from "@/lib/i18n";
import ResetButton from "@/components/ResetButton";

interface Props {
  state: AppState;
  t: Translations;
  onStateChange: (state: AppState) => void;
}

export default function SetupPage({ state, t, onStateChange }: Props) {
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState("");

  function addPersons() {
    const names = inputText
      .split("\n")
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    if (names.length === 0) {
      setError(t.setup.noNamesError);
      return;
    }
    setError("");
    const existing = new Set(state.people.map((p) => p.name.toLowerCase()));
    const newPeople: Person[] = names
      .filter((n) => !existing.has(n.toLowerCase()))
      .map((name) => ({ id: generateId(), name, status: "pending" }));
    onStateChange({ ...state, people: [...state.people, ...newPeople] });
    setInputText("");
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

  function handleReset() {
    onStateChange({ phase: "setup", people: [], currentIndex: 0 });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">{t.appName}</h1>
        </div>
        <ResetButton
          t={t}
          confirmMessage={t.setup.resetConfirm}
          onConfirm={handleReset}
          disabled={state.people.length === 0}
        />
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
            <span className="text-xs text-muted-foreground">
              {state.people.length}{" "}
              {state.people.length === 1 ? t.common.person : t.common.persons}
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
