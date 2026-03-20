import { Globe } from "lucide-react";
import { Locale } from "@/lib/i18n";

const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  sv: "Svenska",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
  nl: "Nederlands",
  pl: "Polski",
  cs: "Čeština",
  hu: "Magyar",
  ro: "Română",
  bg: "Български",
  hr: "Hrvatski",
  el: "Ελληνικά",
  fi: "Suomi",
  da: "Dansk",
  no: "Norsk",
  uk: "Українська",
  ru: "Русский",
  tr: "Türkçe",
  sk: "Slovenčina",
  sl: "Slovenščina",
  lt: "Lietuvių",
  lv: "Latviešu",
  et: "Eesti",
  sr: "Srpski",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  hi: "हिन्दी",
  ar: "العربية",
  th: "ภาษาไทย",
  vi: "Tiếng Việt",
  id: "Bahasa Indonesia",
  ms: "Bahasa Melayu",
  bn: "বাংলা",
  tl: "Filipino",
};

interface Props {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export default function LanguageSwitcher({ currentLocale, onLocaleChange }: Props) {
  return (
    <div className="relative flex items-center">
      <Globe className="pointer-events-none absolute left-2 w-4 h-4 text-muted-foreground" />
      <select
        value={currentLocale}
        onChange={(e) => onLocaleChange(e.target.value as Locale)}
        className="appearance-none pl-7 pr-2 py-1.5 text-sm rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer max-w-[7rem]"
        aria-label="Select language"
      >
        {(Object.keys(LOCALE_NAMES) as Locale[])
          .sort((a, b) =>
            LOCALE_NAMES[a].localeCompare(LOCALE_NAMES[b], undefined, { sensitivity: "base" })
          )
          .map((locale) => (
            <option key={locale} value={locale}>
              {LOCALE_NAMES[locale]}
            </option>
          ))}
      </select>
    </div>
  );
}
