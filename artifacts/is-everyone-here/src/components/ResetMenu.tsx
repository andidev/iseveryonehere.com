import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { AppState, createInitialState, generateId } from "@/lib/state";
import { Translations } from "@/lib/i18n";

interface Props {
  t: Translations;
  state: AppState;
  onStateChange: (state: AppState) => void;
}

type ModalType = "full" | "state" | null;

export default function ResetMenu({ t, state, onStateChange }: Props) {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);

  function confirmFull() {
    onStateChange(createInitialState());
    setModal(null);
    setOpen(false);
  }

  function confirmState() {
    const reset = state.people.map((p) => ({
      ...p,
      id: generateId(),
      status: "pending" as const,
    }));
    onStateChange({ phase: "setup", people: reset, currentIndex: 0 });
    setModal(null);
    setOpen(false);
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Reset options"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {open && (
          <>
            <div
              className="fixed inset-0 z-20"
              onClick={() => setOpen(false)}
            />
            <div className="absolute right-0 top-10 z-30 min-w-[200px] bg-card border border-border rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => { setModal("state"); setOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors border-b border-border"
              >
                {t.reset.resetStateButton}
              </button>
              <button
                onClick={() => { setModal("full"); setOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                {t.reset.button}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setModal(null)}
          />
          <div className="relative z-10 bg-card border border-border rounded-2xl shadow-xl max-w-sm w-full p-6 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-foreground">
              {t.reset.confirmTitle}
            </h2>
            <p className="text-sm text-muted-foreground">
              {modal === "full" ? t.reset.confirmFull : t.reset.confirmState}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
              >
                {t.reset.cancel}
              </button>
              <button
                onClick={modal === "full" ? confirmFull : confirmState}
                className="flex-1 py-2.5 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {t.reset.confirmYes}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
