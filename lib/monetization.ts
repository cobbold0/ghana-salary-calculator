/**
 * Monetization configuration for Ghana Salary Calculator.
 * Supports Google AdSense and Adsterra (Astra) multi-tier monetization.
 */
export const MONETIZATION = {
  // Google AdSense
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-5952797612434262",
  adsenseSlot: process.env.NEXT_PUBLIC_ADSENSE_SLOT || "1273092714",

  // Adsterra (Astra) Smartlink / Direct Link
  astraDirectLink1:
    process.env.NEXT_PUBLIC_ASTRA_DIRECT_LINK_1 ||
    "https://araplhn.org/4/4daf06e24d31c08f4af48d4a94592621",
  astraDirectLink2:
    process.env.NEXT_PUBLIC_ASTRA_DIRECT_LINK_2 ||
    "https://araplhn.org/4/4daf06e24d31c08f4af48d4a94592621",

  // Adsterra Popunder Script URL
  astraPopunderUrl:
    process.env.NEXT_PUBLIC_ASTRA_POPUNDER_URL ||
    "https://abscloud.org/1/e85a0153eed3acc7504ef6ea87b6f593",

  // Adsterra Native Banner
  astraNativeBannerScript:
    process.env.NEXT_PUBLIC_ASTRA_NATIVE_SCRIPT ||
    "https://bauval.org/21/319126d518cb130f5df9ad9e471a16ba",
  astraNativeBannerContainer:
    process.env.NEXT_PUBLIC_ASTRA_NATIVE_CONTAINER ||
    "container-319126d518cb130f5df9ad9e471a16ba",
};
