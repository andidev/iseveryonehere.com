import { useState } from "react";
import { Share2, Users, ListChecks, X } from "lucide-react";
import { AppState, encodeState } from "@/lib/state";
import { Translations } from "@/lib/i18n";

interface Props {
  t: Translations;
  state: AppState;
}

function buildUrl(state: AppState): string {
  const encoded = encodeState(state);
  return `${window.location.origin}${window.location.pathname}#${encoded}`;
}

export default function ShareButton({ t, state }: Props) {
  const [open, setOpen] = useState(false);

  async function shareList() {
    const listState: AppState = {
      phase: "setup",
      currentIndex: 0,
      people: state.people.map((p) => ({ ...p, status: "pending" })),
    };
    try {
      await navigator.share({ title: t.appName, url: buildUrl(listState) });
      setOpen(false);
    } catch (e) {
      if (e instanceof Error && e.name !== "AbortError") throw e;
    }
  }

  async function shareWithStatus() {
    try {
      await navigator.share({ title: t.appName, url: buildUrl(state) });
      setOpen(false);
    } catch (e) {
      if (e instanceof Error && e.name !== "AbortError") throw e;
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label={t.common.share}
      >
        <Share2 className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm mx-4 mb-4 sm:mb-0 bg-background rounded-2xl shadow-xl border border-border overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title bar */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <p className="text-base font-semibold text-foreground">
                {t.common.shareModalTitle}
              </p>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2 px-4 pb-5">
              <button
                onClick={shareList}
                className="flex items-start gap-4 px-4 py-4 rounded-xl bg-muted/50 hover:bg-muted active:opacity-80 transition-colors text-left"
              >
                <Users className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-foreground">
                    {t.common.shareList}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t.common.shareListHint}
                  </span>
                </div>
              </button>

              <button
                onClick={shareWithStatus}
                className="flex items-start gap-4 px-4 py-4 rounded-xl bg-muted/50 hover:bg-muted active:opacity-80 transition-colors text-left"
              >
                <ListChecks className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-foreground">
                    {t.common.shareWithStatus}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t.common.shareWithStatusHint}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setOpen(false)}
                className="mt-1 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                {t.reset.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
