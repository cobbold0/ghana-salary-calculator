"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { compareOffers } from "@/lib/calculations/compare";
import type { Frequency, PeriodSummary } from "@/lib/calculations/salary";
import { formatGHS, formatPercent } from "@/lib/money";
import { DEFAULT_RULESET_ID } from "@/lib/tax";
import { parseSalaryForm, type SalaryFormErrors, type SalaryFormValues } from "@/lib/validation/salary-input";
import { AmountField, FrequencyField, RULESETS } from "./SalaryCalculator";
import { ViewToggle } from "./SalaryResults";

type OfferForm = Required<Omit<SalaryFormValues, "rulesetId">>;

const EMPTY: OfferForm = { basicSalary: "", frequency: "monthly", allowances: "", annualBonus: "" };
const NAMES = ["Offer A", "Offer B"] as const;

export function SalaryComparison() {
  const [offers, setOffers] = useState<[OfferForm, OfferForm]>([EMPTY, EMPTY]);
  const [rulesetId, setRulesetId] = useState(DEFAULT_RULESET_ID);
  const [view, setView] = useState<Frequency>("annual");
  const id = useId();

  const parsed = useMemo(() => offers.map((o) => parseSalaryForm({ ...o, rulesetId })), [offers, rulesetId]);
  const [pa, pb] = parsed;
  const comparison = useMemo(() => (pa.ok && pb.ok ? compareOffers(pa.input, pb.input) : null), [pa, pb]);

  const reported = useRef(false);
  useEffect(() => {
    if (!comparison || reported.current) return;
    reported.current = true;
    track({ name: "comparison_completed", params: { tax_rules: rulesetId } });
  }, [comparison, rulesetId]);

  const update = (index: 0 | 1, patch: Partial<OfferForm>) =>
    setOffers((prev) => {
      const next: [OfferForm, OfferForm] = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });

  return (
    <section aria-label="Compare two salary offers" className="grid min-w-0 gap-6 [&>*]:min-w-0">
      <div className="grid gap-6 md:grid-cols-2">
        {([0, 1] as const).map((i) => {
          const p = parsed[i];
          const errors: SalaryFormErrors = p.ok ? {} : { ...p.errors };
          if (offers[i].basicSalary.trim() === "") delete errors.basicSalary;
          const per = offers[i].frequency === "monthly" ? "a month" : "a year";
          const fid = `${id}-${i}`;
          return (
            <form key={i} className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6" onSubmit={(e) => e.preventDefault()} noValidate>
              <fieldset>
                <legend className="mb-5 text-xl font-bold">{NAMES[i]}</legend>
                <AmountField
                  id={`${fid}-basic`}
                  label={`${NAMES[i]} basic salary`}
                  hint={`Before any deductions, ${per}.`}
                  value={offers[i].basicSalary}
                  error={errors.basicSalary}
                  onChange={(v) => update(i, { basicSalary: v })}
                />
                <FrequencyField name={`${fid}-frequency`} value={offers[i].frequency} onChange={(f) => update(i, { frequency: f })} />
                <details className="group mt-5 rounded-xl border border-border">
                  <summary className="cursor-pointer list-none rounded-xl px-4 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-brand">
                    <span className="flex items-center justify-between">
                      Allowances &amp; bonus
                      <span aria-hidden className="text-muted transition-transform group-open:rotate-180">
                        ▾
                      </span>
                    </span>
                  </summary>
                  <div className="grid gap-5 border-t border-border px-4 pb-4 pt-4">
                    <AmountField
                      id={`${fid}-allowances`}
                      label={`${NAMES[i]} taxable allowances`}
                      hint={`Cash allowances, ${per}.`}
                      value={offers[i].allowances}
                      error={errors.allowances}
                      onChange={(v) => update(i, { allowances: v })}
                    />
                    <AmountField
                      id={`${fid}-bonus`}
                      label={`${NAMES[i]} bonus (once a year)`}
                      hint="Total bonus paid in the year."
                      value={offers[i].annualBonus}
                      error={errors.annualBonus}
                      onChange={(v) => update(i, { annualBonus: v })}
                    />
                  </div>
                </details>
              </fieldset>
            </form>
          );
        })}
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <label htmlFor={`${id}-year`} className="mb-1.5 block text-sm font-medium">
            Tax rules for both offers
          </label>
          <select
            id={`${id}-year`}
            value={rulesetId}
            onChange={(e) => setRulesetId(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2.5 text-base focus:outline-2 focus:outline-brand"
          >
            {RULESETS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <p className="text-xs text-muted">Calculated in your browser. Nothing is sent or stored.</p>
      </div>

      <div aria-live="polite">
        {comparison ? (
          <ComparisonResult comparison={comparison} view={view} onViewChange={setView} />
        ) : (
          <div className="grid min-h-32 place-items-center rounded-2xl border border-dashed border-border p-6 text-center text-muted">
            <p>Enter a basic salary for both offers to compare take-home pay.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function ComparisonResult({
  comparison: c,
  view,
  onViewChange,
}: {
  comparison: ReturnType<typeof compareOffers>;
  view: Frequency;
  onViewChange: (v: Frequency) => void;
}) {
  const a = view === "monthly" ? c.a.monthly : c.a.annual;
  const b = view === "monthly" ? c.b.monthly : c.b.annual;
  const winner = c.higher === "a" ? NAMES[0] : NAMES[1];
  const monthlyWinner = c.monthlyNetDifference > 0 ? NAMES[1] : NAMES[0];
  const money = (k: keyof PeriodSummary) => (s: PeriodSummary) => s[k] as number;
  const rows: { label: string; get: (s: PeriodSummary) => number; deduction?: boolean; strong?: boolean; show?: boolean }[] = [
    { label: "Basic salary", get: money("basicSalary") },
    { label: "Taxable allowances", get: money("allowances"), show: a.allowances + b.allowances > 0 },
    { label: "Bonus", get: money("bonus"), show: a.bonus + b.bonus > 0 },
    { label: "Gross salary", get: money("gross"), strong: true },
    { label: "SSNIT", get: money("ssnit"), deduction: true },
    { label: "PAYE income tax", get: money("paye"), deduction: true },
    { label: "Tax on bonus", get: money("bonusTax"), deduction: true, show: a.bonusTax + b.bonusTax > 0 },
    { label: "Estimated take-home pay", get: money("net"), strong: true },
  ];
  const signed = (v: number) => (v === 0 ? "—" : `${v > 0 ? "+" : "−"}${formatGHS(Math.abs(v))}`);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
      <div className="rounded-xl bg-brand-soft p-4" data-testid="comparison-summary">
        {c.higher === null ? (
          <p className="text-lg font-bold">Both offers give the same take-home pay over a year.</p>
        ) : (
          <p className="text-lg font-bold">
            {winner} gives <span className="text-brand">{formatGHS(Math.abs(c.annualNetDifference))}</span> more take-home pay a year.
          </p>
        )}
        {c.monthlyNetDifference !== 0 && (
          <p className="mt-1 text-sm">
            In a regular month (excluding bonuses), {monthlyWinner} gives {formatGHS(Math.abs(c.monthlyNetDifference))} more.
          </p>
        )}
        {c.a.monthly.ssnit !== c.b.monthly.ssnit && (
          <p className="mt-1 text-sm text-muted">
            {c.a.monthly.ssnit > c.b.monthly.ssnit ? NAMES[0] : NAMES[1]} pays{" "}
            {formatGHS(Math.abs(c.a.monthly.ssnit - c.b.monthly.ssnit))} more a month into your SSNIT pension, because its basic salary is higher.
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Side by side</h2>
        <ViewToggle view={view} onViewChange={onViewChange} />
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-xs tabular-nums sm:text-sm">
          <caption className="sr-only">Offer A and Offer B {view === "monthly" ? "per month" : "per year"}</caption>
          <thead className="text-left text-muted">
            <tr className="border-b border-border">
              <th scope="col" className="py-2 pr-2 font-medium">
                {view === "monthly" ? "Per month" : "Per year"}
              </th>
              <th scope="col" className="py-2 pr-2 text-right font-medium">{NAMES[0]}</th>
              <th scope="col" className="py-2 pr-2 text-right font-medium">{NAMES[1]}</th>
              <th scope="col" className="py-2 text-right font-medium">B − A</th>
            </tr>
          </thead>
          <tbody>
            {rows
              .filter((r) => r.show !== false)
              .map((r) => {
                const va = r.get(a);
                const vb = r.get(b);
                const fmt = (v: number) => (r.deduction ? `−${formatGHS(v)}` : formatGHS(v));
                return (
                  <tr key={r.label} className={`border-b border-border last:border-0 ${r.strong ? "font-semibold" : ""}`}>
                    <th scope="row" className="py-2 pr-2 text-left font-[inherit]">
                      {r.label}
                    </th>
                    <td className="py-2 pr-2 text-right">{fmt(va)}</td>
                    <td className="py-2 pr-2 text-right">{fmt(vb)}</td>
                    <td className="py-2 text-right">{signed(r.deduction ? va - vb : vb - va)}</td>
                  </tr>
                );
              })}
            <tr className="text-muted">
              <th scope="row" className="py-2 pr-2 text-left font-normal">
                Effective tax rate
              </th>
              <td className="py-2 pr-2 text-right">{formatPercent(a.effectiveTaxRate)}</td>
              <td className="py-2 pr-2 text-right">{formatPercent(b.effectiveTaxRate)}</td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">
        B − A for deductions shows how much more (+) or less (−) Offer B leaves you after that deduction.
        {view === "monthly" && " The monthly view shows a regular month and excludes bonuses."}
      </p>

      <div className="mt-5 rounded-xl border border-notice-border bg-notice-bg p-4 text-sm">
        <p>
          <strong>Tax rules: {c.a.ruleset.label}.</strong> {c.a.ruleset.notice}
        </p>
        <p className="mt-2">
          Estimates only. The comparison covers SSNIT and PAYE — not benefits such as medical cover, transport or pension top-ups, which can matter
          as much as pay.
        </p>
      </div>
    </div>
  );
}
