import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Translations } from "@/lib/i18n";

interface Props {
  t: Translations;
  confirmMessage: string;
  onConfirm: () => void;
  disabled?: boolean;
}

export default function ResetButton({ t, confirmMessage, onConfirm, disabled }: Props) {
  const [modal, setModal] = useState(false);

  function handleConfirm() {
    onConfirm();
    setModal(false);
  }

  return (
    <>
      <button
        onClick={() => setModal(true)}
        disabled={disabled}
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Reset"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setModal(false)}
          />
          <div className="relative z-10 bg-card border border-border rounded-2xl shadow-xl max-w-sm w-full p-6 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-foreground">
              {t.reset.confirmTitle}
            </h2>
            <p className="text-sm text-muted-foreground">{confirmMessage}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setModal(false)}
                className="flex-1 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
              >
                {t.reset.cancel}
              </button>
              <button
                onClick={handleConfirm}
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
