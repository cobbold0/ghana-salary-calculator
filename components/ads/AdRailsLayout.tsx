import React from "react";
import { AdSlot } from "@/components/site/AdSlot";

interface AdRailsLayoutProps {
  children: React.ReactNode;
  showRails?: boolean;
}

/**
 * Three-column desktop layout that flanks the main content with
 * Left and Right sticky skyscraper Google Ads on xl+ screens (1280px+).
 * Gracefully hidden on mobile and tablet screens to ensure optimal user experience.
 */
export function AdRailsLayout({ children, showRails = true }: AdRailsLayoutProps) {
  if (!showRails) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1520px] justify-center gap-6 px-2 sm:px-4">
      {/* Left Skyscraper Rail (Desktop) */}
      <aside
        className="hidden xl:flex xl:w-[160px] 2xl:w-[180px] shrink-0 flex-col self-start sticky top-24 pt-2 print:hidden"
        aria-label="Left sidebar advertisement"
      >
        <AdSlot variant="sidebar" label="Sponsor" />
      </aside>

      {/* Main Content Area */}
      <div className="min-w-0 flex-1 max-w-4xl">
        {/* Top Leaderboard Banner */}
        <AdSlot variant="banner" className="mb-6" />

        {children}

        {/* Bottom Leaderboard Banner */}
        <AdSlot variant="banner" className="mt-12" />
      </div>

      {/* Right Skyscraper Rail (Desktop) */}
      <aside
        className="hidden xl:flex xl:w-[160px] 2xl:w-[180px] shrink-0 flex-col self-start sticky top-24 pt-2 print:hidden"
        aria-label="Right sidebar advertisement"
      >
        <AdSlot variant="sidebar" label="Sponsor" />
      </aside>
    </div>
  );
}
