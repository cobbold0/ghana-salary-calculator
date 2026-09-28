import { GA_ID } from "./analytics";

export const CONSENT_KEY = "gsc:consent:v1";
export const CONSENT_EVENT = "gsc:open-consent";
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
/** The banner only matters when a Google tag that uses cookies is configured. */
export const CONSENT_NEEDED = Boolean(GA_ID || ADSENSE_CLIENT);

export type Consent = "granted" | "denied";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    adsbygoogle?: unknown[] & { requestNonPersonalizedAds?: 0 | 1 };
  }
}

/**
 * Google Consent Mode v2 defaults, run before any Google tag loads.
 * Ads always show: ad_storage stays granted so non-personalised ads work normally.
 * Personalised ads (ad_user_data, ad_personalization) and analytics cookies wait for consent.
 */
export const consentDefaultScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
var c = null; try { c = localStorage.getItem(${JSON.stringify(CONSENT_KEY)}); } catch (e) {}
var g = c === "granted" ? "granted" : "denied";
gtag("consent", "default", { ad_storage: "granted", ad_user_data: g, ad_personalization: g, analytics_storage: g });
(window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = g === "granted" ? 0 : 1;
`;

export function getConsent(): Consent | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function setConsent(consent: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, consent);
  } catch {
    // Storage blocked: the choice applies to this page view only.
  }
  window.gtag?.("consent", "update", { ad_user_data: consent, ad_personalization: consent, analytics_storage: consent });
  (window.adsbygoogle ||= []).requestNonPersonalizedAds = consent === "granted" ? 0 : 1;
}
