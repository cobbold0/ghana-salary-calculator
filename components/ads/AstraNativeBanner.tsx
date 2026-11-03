"use client";

import React, { useEffect } from "react";
import { MONETIZATION } from "@/lib/monetization";

interface AstraNativeBannerProps {
  className?: string;
  label?: string;
}

export function AstraNativeBanner({
  className = "",
  label = "Sponsored Recommendation",
}: AstraNativeBannerProps) {
  const containerId = MONETIZATION.astraNativeBannerContainer;
  const scriptSrc = MONETIZATION.astraNativeBannerScript;

  useEffect(() => {
    if (!scriptSrc || !containerId) return;

    const scriptId = `astra-native-${containerId}`;
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = scriptSrc;
      document.body.appendChild(script);
    }
  }, [scriptSrc, containerId]);

  if (!containerId) return null;

  return (
    <div className={`w-full my-4 overflow-hidden rounded-xl border border-border bg-surface p-2 text-center ${className}`}>
      {label && (
        <p className="mb-2 text-center text-[9px] font-medium tracking-wider text-muted uppercase select-none">
          {label}
        </p>
      )}
      <div id={containerId} className="w-full min-h-[120px] flex items-center justify-center" />
    </div>
  );
}
