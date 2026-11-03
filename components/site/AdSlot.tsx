"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT as client } from "@/lib/consent";

const defaultSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT;
const showPlaceholders = process.env.NEXT_PUBLIC_AD_PLACEHOLDERS === "true" || process.env.NODE_ENV === "development";

interface AdSlotProps {
  variant?: "banner" | "sidebar" | "inline";
  className?: string;
  slot?: string;
  label?: string;
}

/**
 * A clearly labelled responsive Google AdSense unit.
 * Supports:
 * - "banner": leaderboard (top/bottom of pages)
 * - "sidebar": vertical skyscraper for left and right rails
 * - "inline": in-content rectangle
 */
export function AdSlot({
  variant = "inline",
  className = "",
  slot = defaultSlot,
  label = "Advertisement",
}: AdSlotProps) {
  const ref = useRef<HTMLModElement>(null);
  const isConfigured = Boolean(client && slot);

  useEffect(() => {
    if (!isConfigured || !ref.current || ref.current.dataset.adsbygoogleStatus) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blockers or script failure must never break the page
    }
  }, [isConfigured]);

  const variantStyles = {
    banner: "w-full my-6 min-h-[90px] sm:min-h-[100px] text-center",
    sidebar: "w-full min-h-[600px] flex flex-col items-center justify-start sticky top-20",
    inline: "w-full my-8 min-h-[250px] text-center",
  };

  if (isConfigured) {
    return (
      <aside
        aria-label={label}
        className={`print:hidden overflow-hidden ${variantStyles[variant]} ${className}`}
      >
        <p className="mb-1.5 text-center text-[10px] font-semibold tracking-wider text-muted uppercase">
          {label}
        </p>
        <ins
          ref={ref}
          className="adsbygoogle block"
          style={{
            display: "block",
            minHeight: variant === "sidebar" ? 600 : variant === "banner" ? 90 : 250,
          }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={variant === "sidebar" ? "vertical" : "auto"}
          data-full-width-responsive={variant !== "sidebar" ? "true" : "false"}
        />
      </aside>
    );
  }

  if (showPlaceholders) {
    return (
      <aside
        aria-label={`${label} Placeholder`}
        className={`print:hidden rounded-lg border border-dashed border-border/80 bg-muted/5 p-2 text-center ${variantStyles[variant]} ${className}`}
      >
        <p className="mb-1 text-[10px] font-semibold tracking-wider text-muted uppercase">
          {label} {variant === "sidebar" ? "(Skyscraper)" : variant === "banner" ? "(Leaderboard)" : "(In-Content)"}
        </p>
        <div
          className={`flex w-full items-center justify-center rounded bg-muted/10 text-xs font-medium text-muted/80 ${
            variant === "sidebar" ? "h-[560px]" : variant === "banner" ? "h-[80px]" : "h-[220px]"
          }`}
        >
          Google AdSense Slot
        </div>
      </aside>
    );
  }

  return null;
}
