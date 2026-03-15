import { ArrowLeft } from "lucide-react";

function goBack() {
  window.location.hash = "";
  window.history.back();
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-10 flex flex-col gap-8 text-foreground">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">
            Effective date: June 2025 &nbsp;·&nbsp; iseveryonehere.com
          </p>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">Overview</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Is Everyone Here is a client-side web application. It runs entirely in your
            browser and has no server backend. No data you enter is ever transmitted to,
            stored on, or processed by any server. Your data never leaves your device
            unless you explicitly choose to share the URL.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">Data storage</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All information you add to the application — participant names, attendance
            statuses, and the current phase of the event — is stored exclusively in the
            URL of your browser window (specifically in the URL fragment, also called the
            hash). This data is compressed and encoded directly into the URL and exists
            only in the address bar of your browser. It is not written to cookies, local
            storage, session storage, or any external database.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            When you close or navigate away from the page, the data is gone unless you
            have saved or shared the URL.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">Data sharing</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We do not collect, share, sell, or have access to any data you enter. The
            only way data can leave your device is if you use the Share button to send the
            URL to another person. In that case, you are choosing to share the URL — and
            with it, the encoded data — directly with the recipient. That sharing happens
            entirely outside our control, through your device's own messaging or sharing
            features.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">Analytics and tracking</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This application does not use any analytics, tracking scripts, advertising
            networks, or third-party services that collect personal data. No cookies are
            set by this application.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">Third-party services</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The application loads the Inter typeface from Google Fonts. This request is
            made directly from your browser to Google's servers and is subject to
            Google's own privacy policy. No other third-party services are used.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">Children's privacy</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Because we collect no personal data whatsoever, this application is safe for
            use in any context, including by or on behalf of children.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">Changes to this policy</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If this policy changes in the future, the updated version will be published at
            this same page with a new effective date.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">Contact</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Questions about this policy can be sent to{" "}
            <a
              href="mailto:privacy@iseveryonehere.com"
              className="text-primary underline underline-offset-2"
            >
              privacy@iseveryonehere.com
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
