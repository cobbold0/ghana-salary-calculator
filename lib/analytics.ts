import { sendGAEvent } from "@next/third-parties/google";

export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * The only events the app may send. Parameters are deliberately limited to
 * non-monetary values — salary, allowance and bonus amounts must never be sent.
 */
type AnalyticsEvent =
  | { name: "calculator_opened" }
  | { name: "salary_period_selected"; params: { period: "monthly" | "annual" } }
  | { name: "calculation_completed"; params: { period: "monthly" | "annual"; has_allowances: boolean; has_bonus: boolean; tax_rules: string } };

export function track(event: AnalyticsEvent) {
  if (!GA_ID) return;
  sendGAEvent("event", event.name, "params" in event ? event.params : {});
}
