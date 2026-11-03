/**
 * Monetization configuration for Ghana Salary Calculator.
 * Supports Google AdSense and Adsterra (Astra) multi-tier monetization.
 */
export const MONETIZATION = {
  // Google AdSense
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-5952797612434262",
  adsenseSlot: process.env.NEXT_PUBLIC_ADSENSE_SLOT || "1273092714",

  // Adsterra (Astra) Direct Links for multi-click download redirection
  // When user clicks Download Payslip:
  // Click 1 -> Opens astraDirectLink1 in a new tab
  // Click 2 -> Opens astraDirectLink2 in a new tab
  // Click 3 -> Displays Ad-Gated Download Modal with Banner Ad + Final Download Button
  astraDirectLink1:
    process.env.NEXT_PUBLIC_ASTRA_DIRECT_LINK_1 ||
    process.env.NEXT_PUBLIC_AD_REDIRECT_1 ||
    "https://cobbold.dev/sponsor",
  astraDirectLink2:
    process.env.NEXT_PUBLIC_ASTRA_DIRECT_LINK_2 ||
    process.env.NEXT_PUBLIC_AD_REDIRECT_2 ||
    "https://cobbold.dev/sponsor",

  // Optional Adsterra Popunder / Social Bar Script URL or Zone ID
  astraPopunderUrl: process.env.NEXT_PUBLIC_ASTRA_POPUNDER_URL || "",
  astraBannerZoneId: process.env.NEXT_PUBLIC_ASTRA_BANNER_ZONE_ID || "",
};
