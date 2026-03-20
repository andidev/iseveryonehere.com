import { useEffect, useRef, useState } from "react";
import { MoreVertical, Users, Lock } from "lucide-react";
import { Locale } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface Props {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onBackToSetup?: () => void;
  backToSetupLabel?: string;
  privacyLabel: string;
}

export default function HeaderOverflowMenu({
  currentLocale,
  onLocaleChange,
  onBackToSetup,
  backToSetupLabel,
  privacyLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <>
      {/* Inline on sm+ screens */}
      <div className="hidden sm:flex items-center gap-1">
        <LanguageSwitcher currentLocale={currentLocale} onLocaleChange={onLocaleChange} />
        {onBackToSetup && (
          <button
            onClick={onBackToSetup}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label={backToSetupLabel}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>{backToSetupLabel}</span>
          </button>
        )}
        <a
          href="#privacy"
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Lock className="w-4 h-4 shrink-0" />
          <span>{privacyLabel}</span>
        </a>
      </div>

      {/* Overflow menu on mobile */}
      <div ref={ref} className="relative sm:hidden">
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="More options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-border bg-card shadow-lg overflow-hidden z-30">
            {/* Language row */}
            <div className="flex items-center px-4 py-3 border-b border-border">
              <LanguageSwitcher
                currentLocale={currentLocale}
                onLocaleChange={(l) => { onLocaleChange(l); setOpen(false); }}
              />
            </div>

            {/* Back to Setup row */}
            {onBackToSetup && (
              <button
                onClick={() => { onBackToSetup(); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors text-left"
              >
                <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                {backToSetupLabel}
              </button>
            )}

            {/* Privacy Policy row */}
            <a
              href="#privacy"
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors border-t border-border"
            >
              <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
              {privacyLabel}
            </a>
          </div>
        )}
      </div>
    </>
  );
}
