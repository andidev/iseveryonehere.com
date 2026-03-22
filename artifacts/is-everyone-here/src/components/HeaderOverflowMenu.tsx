import { useEffect, useRef, useState } from "react";
import { MoreVertical, Users, Lock, Bug, Lightbulb } from "lucide-react";
import { Locale } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const GITHUB_URL = "https://github.com/andidev/iseveryonehere.com";
const BUG_REPORT_URL = `${GITHUB_URL}/issues/new?template=bug_report.yml`;
const FEATURE_REQUEST_URL = `${GITHUB_URL}/issues/new?template=feature_request.yml`;

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className} fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
    </svg>
  );
}

interface Props {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onBackToSetup?: () => void;
  backToSetupLabel?: string;
  privacyLabel: string;
  githubLabel: string;
  reportBugLabel: string;
  requestFeatureLabel: string;
}

export default function HeaderOverflowMenu({
  currentLocale,
  onLocaleChange,
  onBackToSetup,
  backToSetupLabel,
  privacyLabel,
  githubLabel,
  reportBugLabel,
  requestFeatureLabel,
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
        <GitHubIcon className="w-4 h-4" />
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
              <GitHubIcon className="w-4 h-4 text-muted-foreground shrink-0" />
              {githubLabel}
            </a>

            {/* Report a Bug row */}
            <a
              href={BUG_REPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors border-t border-border"
            >
              <Bug className="w-4 h-4 text-muted-foreground shrink-0" />
              {reportBugLabel}
            </a>

            {/* Request a Feature row */}
            <a
              href={FEATURE_REQUEST_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors border-t border-border"
            >
              <Lightbulb className="w-4 h-4 text-muted-foreground shrink-0" />
              {requestFeatureLabel}
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
