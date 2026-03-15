import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Translations } from "@/lib/i18n";

interface Props {
  t: Translations;
}

export default function ShareButton({ t }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: t.appName,
          text: t.common.shareText,
          url,
        });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available — do nothing
    }
  }

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative"
      aria-label={t.common.share}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Share2 className="w-4 h-4" />
      )}
      {copied && (
        <span className="absolute -bottom-7 right-0 text-xs text-green-600 font-medium whitespace-nowrap bg-background border border-border rounded px-1.5 py-0.5 shadow-sm">
          {t.common.copied}
        </span>
      )}
    </button>
  );
}
