import { ArrowLeft } from "lucide-react";
import { Locale, Translations } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface Props {
  t: Translations;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

function goBack() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.hash = "";
  }
}

export default function PrivacyPage({ t, locale, onLocaleChange }: Props) {
  const p = t.privacy;
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center justify-between gap-3">
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {p.back}
        </button>
        <LanguageSwitcher currentLocale={locale} onLocaleChange={onLocaleChange} />
      </header>

      <main className="max-w-2xl mx-auto px-5 py-10 flex flex-col gap-8 text-foreground">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">{p.title}</h1>
          <p className="text-sm text-muted-foreground">{p.effectiveDate}</p>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">{p.overviewHeading}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{p.overviewBody}</p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">{p.dataStorageHeading}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{p.dataStorageBody1}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{p.dataStorageBody2}</p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">{p.dataSharingHeading}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{p.dataSharingBody}</p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">{p.analyticsHeading}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{p.analyticsBody}</p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">{p.thirdPartyHeading}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{p.thirdPartyBody}</p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">{p.childrensHeading}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{p.childrensBody}</p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">{p.changesHeading}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{p.changesBody}</p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">{p.contactHeading}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {p.contactBody.split("privacy@iseveryonehere.com")[0]}
            <a
              href="mailto:privacy@iseveryonehere.com"
              className="text-primary underline underline-offset-2"
            >
              privacy@iseveryonehere.com
            </a>
          </p>
        </section>
      </main>
    </div>
  );
}
