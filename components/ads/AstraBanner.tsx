"use client";

import React from "react";

export type AstraBannerSize = "160x300" | "160x600" | "728x90" | "300x250" | "320x50" | "468x60";

interface AstraBannerProps {
  size: AstraBannerSize;
  className?: string;
  label?: string;
}

const BANNER_CONFIG: Record<AstraBannerSize, { key: string; width: number; height: number }> = {
  "160x300": {
    key: "e993e4d2b74ba044e46d5fca879458d2",
    width: 160,
    height: 300,
  },
  "160x600": {
    // If 160x300 is provided, use 160x300 key or 160x600
    key: "e993e4d2b74ba044e46d5fca879458d2",
    width: 160,
    height: 300,
  },
  "728x90": {
    key: "f839241a26b9224c882f3df6008fb572",
    width: 728,
    height: 90,
  },
  "320x50": {
    key: "b7daa77eca6cdce7b3e9e08a61668b6b",
    width: 320,
    height: 50,
  },
  "300x250": {
    key: "5278df92957b951cf37de97e6a3d3d6d",
    width: 300,
    height: 250,
  },
  "468x60": {
    key: "33eaab05caec97d15f1d5cfe4540d4e8",
    width: 468,
    height: 60,
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
