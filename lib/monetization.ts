/**
 * Monetization configuration for Ghana Salary Calculator (ghanasalary.cobbold.dev).
 * Supports Google AdSense and Adsterra (Astra) multi-tier monetization.
 */
export const MONETIZATION = {
  // Google AdSense
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-5952797612434262",
  adsenseSlot: process.env.NEXT_PUBLIC_ADSENSE_SLOT || "1273092714",

  // Adsterra (Astra) Smartlink / Direct Link
  astraDirectLink1:
    process.env.NEXT_PUBLIC_ASTRA_DIRECT_LINK_1 ||
    "https://araplhn.org/4/a8ec2ac008eaedadf8a791344c704cc6",
  astraDirectLink2:
    process.env.NEXT_PUBLIC_ASTRA_DIRECT_LINK_2 ||
    "https://araplhn.org/4/a8ec2ac008eaedadf8a791344c704cc6",

  // Adsterra Popunder Script URL
  astraPopunderUrl:
    process.env.NEXT_PUBLIC_ASTRA_POPUNDER_URL ||
    "https://abscloud.org/1/5217f25a1615ab37e08893e9e1caf15b",

  // Adsterra Social Bar Script URL
  astraSocialBarUrl:
    process.env.NEXT_PUBLIC_ASTRA_SOCIAL_BAR_URL ||
    "https://bauval.org/14/0ba2ed2b59b233b2cf3daa80df3fd52c",

  // Adsterra Native Banner
  astraNativeBannerScript:
    process.env.NEXT_PUBLIC_ASTRA_NATIVE_SCRIPT ||
    "https://bauval.org/21/e80daaec597c6e2a27305cf77f176e43",
  astraNativeBannerContainer:
    process.env.NEXT_PUBLIC_ASTRA_NATIVE_CONTAINER ||
    "container-e80daaec597c6e2a27305cf77f176e43",
};
