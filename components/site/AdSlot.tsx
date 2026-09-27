"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT;

/**
 * A clearly labelled ad unit. Renders nothing until AdSense is configured.
 * Only place this in content areas — never inside or between calculator inputs and results.
 */
export function AdSlot() {
  useEffect(() => {
    if (!client || !slot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blockers or a missing script must never break the page.
    }
  }, []);

  if (!client || !slot) return null;
  return (
    <aside aria-label="Advertisement" className="my-10 border-y border-border py-4">
      <p className="mb-2 text-center text-xs uppercase tracking-wide text-muted">Advertisement</p>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: 100 }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
