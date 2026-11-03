"use client";

import React from "react";

export type AstraBannerSize = "160x600" | "728x90" | "300x250" | "320x50";

interface AstraBannerProps {
  size: AstraBannerSize;
  className?: string;
  label?: string;
}

const BANNER_CONFIG: Record<AstraBannerSize, { key: string; width: number; height: number }> = {
  "160x600": {
    key: "3f7f4bfed4336e5bee560436a03b3b7b",
    width: 160,
    height: 600,
  },
  "728x90": {
    key: "04b46be57c8cbc8354f72ea99016791f",
    width: 728,
    height: 90,
  },
  "300x250": {
    key: "ddc7513063f0687a87212faf79c05e3c",
    width: 300,
    height: 250,
  },
  "320x50": {
    key: "6c514193a9c4781dc2637fbfcdf1ffe0",
    width: 320,
    height: 50,
  },
};

export function AstraBanner({ size, className = "", label = "Sponsored" }: AstraBannerProps) {
  const config = BANNER_CONFIG[size];
  if (!config) return null;

  const htmlContent = `<!DOCTYPE html><html><head><meta charset="utf-8"/><base target="_blank"/><style>body{margin:0;padding:0;overflow:hidden;background:transparent;display:flex;justify-content:center;align-items:center;}</style></head><body><script>atOptions = {'key' : '${config.key}','format' : 'iframe','height' : ${config.height},'width' : ${config.width},'params' : {}};</script><script type="text/javascript" src="https://bauval.org/22/${config.key}"></script></body></html>`;

  return (
    <aside
      aria-label={label}
      className={`print:hidden flex flex-col items-center justify-center overflow-hidden ${className}`}
    >
      {label && (
        <p className="mb-1 text-center text-[9px] font-medium tracking-wider text-muted uppercase select-none">
          {label}
        </p>
      )}
      <iframe
        title={`${label} ${size}`}
        srcDoc={htmlContent}
        width={config.width}
        height={config.height}
        style={{
          width: `${config.width}px`,
          height: `${config.height}px`,
          border: "none",
          overflow: "hidden",
        }}
        scrolling="no"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      />
    </aside>
  );
}
