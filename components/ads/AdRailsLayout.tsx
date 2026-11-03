import React from "react";
import { AdSlot } from "@/components/site/AdSlot";
import { AstraBanner } from "@/components/ads/AstraBanner";

interface AdRailsLayoutProps {
  children: React.ReactNode;
  showRails?: boolean;
}

/**
 * Three-column desktop layout that flanks salary calculator tools with
 * Left and Right sticky skyscraper ads (160x600) on xl+ screens (1280px+),
 * and responsive top/bottom leaderboard banners (728x90 desktop, 320x50 mobile).
 */
export function AdRailsLayout({ children, showRails = true }: AdRailsLayoutProps) {
  if (!showRails) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1540px] justify-center gap-6 px-2 sm:px-4">
      {/* Left Skyscraper Rail (Desktop 160x600) */}
      <aside
        className="hidden xl:flex xl:w-[160px] 2xl:w-[180px] shrink-0 flex-col self-start sticky top-24 pt-2 print:hidden items-center"
        aria-label="Left sidebar advertisement"
      >
        <AstraBanner size="160x600" />
        <AdSlot variant="sidebar" className="mt-4" />
      </aside>

      {/* Main Content Area */}
      <div className="min-w-0 flex-1 max-w-5xl">
        {/* Top Responsive Leaderboard Banner */}
        <div className="my-3 flex justify-center">
          <AstraBanner size="728x90" className="hidden sm:flex" />
          <AstraBanner size="320x50" className="flex sm:hidden" />
        </div>
        <AdSlot variant="banner" className="mb-4" />

        {children}

        {/* Bottom Responsive Leaderboard Banner */}
        <div className="mt-12 mb-6 flex justify-center">
          <AstraBanner size="728x90" className="hidden sm:flex" />
          <AstraBanner size="320x50" className="flex sm:hidden" />
        </div>
        <AdSlot variant="banner" className="mt-2" />
      </div>

      {/* Right Skyscraper Rail (Desktop 160x600) */}
      <aside
        className="hidden xl:flex xl:w-[160px] 2xl:w-[180px] shrink-0 flex-col self-start sticky top-24 pt-2 print:hidden items-center"
        aria-label="Right sidebar advertisement"
      >
        <AstraBanner size="160x600" />
        <AdSlot variant="sidebar" className="mt-4" />
      </aside>
    </div>
  );
}
