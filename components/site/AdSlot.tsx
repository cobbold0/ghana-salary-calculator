"use client";

import { useEffect, useRef, useState } from "react";
import { ADSENSE_CLIENT as client } from "@/lib/consent";

const defaultSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT || "1273092714";

interface AdSlotProps {
  variant?: "banner" | "sidebar" | "inline";
  className?: string;
  slot?: string;
  label?: string;
}

/**
 * Clearly labelled responsive Google AdSense unit for Ghana Salary Calculator.
 * Supports:
 * - "banner": leaderboard (top/bottom of pages)
 * - "sidebar": vertical skyscraper for left and right rails
 * - "inline": in-content rectangle
 *
 * Unfilled ads collapse cleanly without showing broken placeholder texts.
 */
export function AdSlot({
  variant = "inline",
  className = "",
  slot = defaultSlot,
  label = "Advertisement",
}: AdSlotProps) {
  const ref = useRef<HTMLModElement>(null);
  const activeClient = client || "ca-pub-5952797612434262";
  const activeSlot = slot || defaultSlot;
  const isConfigured = Boolean(activeClient && activeSlot);
  const [isUnfilled, setIsUnfilled] = useState(false);

  useEffect(() => {
    if (!isConfigured || !ref.current || ref.current.dataset.adsbygoogleStatus) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blockers or network failure
    }

    const ins = ref.current;
    if (!ins) return;
    const observer = new MutationObserver(() => {
      if (ins.getAttribute("data-ad-status") === "unfilled") {
        setIsUnfilled(true);
      }
    });
    observer.observe(ins, { attributes: true, attributeFilter: ["data-ad-status"] });
    return () => observer.disconnect();
  }, [isConfigured]);

  const variantStyles = {
    banner: "w-full my-6 min-h-[90px] sm:min-h-[100px] text-center",
    sidebar: "w-full min-h-[600px] flex flex-col items-center justify-start sticky top-20",
    inline: "w-full my-8 min-h-[250px] text-center",
  };

  if (!isConfigured || isUnfilled) {
    return null;
  }

  return (
    <aside
      aria-label={label}
      className={`print:hidden overflow-hidden transition-all duration-300 ${variantStyles[variant]} ${className}`}
    >
      <p className="mb-1 text-center text-[9px] font-medium tracking-wider text-muted uppercase select-none">
        {label}
      </p>
      <ins
        ref={ref}
        className="adsbygoogle block"
        style={{
          display: "block",
          minHeight: variant === "sidebar" ? 600 : variant === "banner" ? 90 : 250,
        }}
        data-ad-client={activeClient}
        data-ad-slot={activeSlot}
        data-ad-format={variant === "sidebar" ? "vertical" : "auto"}
        data-full-width-responsive={variant !== "sidebar" ? "true" : "false"}
      />
    </aside>
  );
}
