import { useEffect, useRef, useState } from "react";
import { MoreVertical, Users, Lock, Github } from "lucide-react";
import { Locale } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const GITHUB_URL = "https://github.com/andidev/iseveryonehere.com";

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
    <div ref={ref} className="flex items-center gap-1">
      {/* Language switcher inline on desktop */}
      <div className="hidden sm:block">
        <LanguageSwitcher currentLocale={currentLocale} onLocaleChange={onLocaleChange} />
      </div>

      {/* GitHub link — desktop only */}
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className="hidden sm:flex p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <Github className="w-4 h-4" />
      </a>

      {/* Three-dot menu */}
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="More options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-border bg-card shadow-lg overflow-hidden z-30">
            {/* Language row — mobile only */}
            <div className="flex items-center px-4 py-3 border-b border-border sm:hidden">
              <LanguageSwitcher
                currentLocale={currentLocale}
                onLocaleChange={(l) => { onLocaleChange(l); setOpen(false); }}
              />
            </div>

            {/* Participants row */}
            {onBackToSetup && (
              <button
                onClick={() => { onBackToSetup(); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors text-left"
              >
                <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                {backToSetupLabel}
              </button>
            )}

            {/* GitHub row — mobile only */}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="sm:hidden w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors border-t border-border"
            >
              <Github className="w-4 h-4 text-muted-foreground shrink-0" />
              GitHub
            </a>

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
    </div>
  );
}
