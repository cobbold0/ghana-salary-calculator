"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

interface AddThisProps {
  pubId?: string;
  url?: string;
  title?: string;
  className?: string;
  inline?: boolean;
}

/**
 * AddThis social share bar with an integrated high-converting native share fallback.
 * Works out-of-the-box with WhatsApp, X, Facebook, LinkedIn and Copy Link.
 * Automatically enables AddThis tools once the pubId or script is configured.
 */
export function AddThis({
  pubId = process.env.NEXT_PUBLIC_ADDTHIS_PUB_ID,
  url,
  title,
  className = "",
  inline = true,
}: AddThisProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState(url || "");
  const [shareTitle, setShareTitle] = useState(title || "");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(url || window.location.href);
      setShareTitle(title || document.title);
    }
  }, [url, title]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);

  return (
    <div className={`my-6 rounded-xl border border-border/60 bg-surface/50 p-4 shadow-sm print:hidden ${className}`}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-muted uppercase">Share this tool</span>
        {copied && <span className="text-xs font-medium text-emerald-600">Link copied to clipboard!</span>}
      </div>

      {pubId ? (
        <>
          <Script
            src={`https://s7.addthis.com/js/300/addthis_widget.js#pubid=${pubId}`}
            strategy="lazyOnload"
          />
          <div className="addthis_inline_share_toolbox" data-url={shareUrl} data-title={shareTitle} />
        </>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {/* WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366]/10 px-3 py-1.5 text-xs font-semibold text-[#128C7E] transition hover:bg-[#25D366]/20"
            aria-label="Share on WhatsApp"
          >
            <span>WhatsApp</span>
          </a>

          {/* Twitter / X */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-foreground/5 px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-foreground/10"
            aria-label="Share on X"
          >
            <span>X / Twitter</span>
          </a>

          {/* LinkedIn */}
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A66C2]/10 px-3 py-1.5 text-xs font-semibold text-[#0A66C2] transition hover:bg-[#0A66C2]/20"
            aria-label="Share on LinkedIn"
          >
            <span>LinkedIn</span>
          </a>

          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1877F2]/10 px-3 py-1.5 text-xs font-semibold text-[#1877F2] transition hover:bg-[#1877F2]/20"
            aria-label="Share on Facebook"
          >
            <span>Facebook</span>
          </a>

          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted/10 cursor-pointer"
            aria-label="Copy page link"
          >
            <span>{copied ? "Copied!" : "Copy Link"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
