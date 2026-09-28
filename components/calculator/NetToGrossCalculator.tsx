"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { netToGross } from "@/lib/calculations/net-to-gross";
import type { Frequency } from "@/lib/calculations/salary";
import { formatGHS } from "@/lib/money";
import { DEFAULT_RULESET_ID } from "@/lib/tax";
import { parseNetToGrossForm, type NetToGrossFormErrors, type NetToGrossFormValues } from "@/lib/validation/salary-input";
import { AmountField, FrequencyField, RULESETS } from "./SalaryCalculator";
import { SalaryResults } from "./SalaryResults";

type FormState = Required<NetToGrossFormValues>;

const INITIAL: FormState = { targetNet: "", frequency: "monthly", allowances: "", rulesetId: DEFAULT_RULESET_ID };

export function NetToGrossCalculator() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [view, setView] = useState<Frequency>("monthly");
  const id = useId();

  const parsed = useMemo(() => parseNetToGrossForm(form), [form]);
  const solved = useMemo(() => (parsed.ok ? netToGross(parsed.input) : null), [parsed]);
  const errors: NetToGrossFormErrors = parsed.ok ? {} : { ...parsed.errors };
  if (form.targetNet.trim() === "") delete errors.targetNet;

  // Results update on every keystroke; report only the first completed calculation per visit.
  const reported = useRef(false);
  useEffect(() => {
    if (!parsed.ok || reported.current) return;
    reported.current = true;
    const { frequency, allowances, rulesetId } = parsed.input;
    track({ name: "net_to_gross_completed", params: { period: frequency, has_allowances: !!allowances, tax_rules: rulesetId ?? "" } });
  }, [parsed]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));
  const per = form.frequency === "monthly" ? "a month" : "a year";
  const p = solved && (view === "monthly" ? solved.result.monthly : solved.result.annual);

  return (
    <section aria-labelledby={`${id}-title`} className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start">
      <form className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6" onSubmit={(e) => e.preventDefault()} noValidate>
        <h2 id={`${id}-title`} className="mb-5 text-xl font-bold">
          Take-home pay you want
        </h2>
        <AmountField
          id={`${id}-target`}
          label="Take-home pay"
          hint={`After SSNIT and PAYE, ${per}.`}
          value={form.targetNet}
          error={errors.targetNet}
          onChange={(v) => set("targetNet", v)}
        />
        <FrequencyField
          name={`${id}-frequency`}
          legend="Take-home pay is"
          value={form.frequency}
          onChange={(f) => {
            set("frequency", f);
            setView(f);
          }}
        />
        <details className="group mt-5 rounded-xl border border-border">
          <summary className="cursor-pointer list-none rounded-xl px-4 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-brand">
            <span className="flex items-center justify-between">
              Allowances &amp; tax year
              <span aria-hidden className="text-muted transition-transform group-open:rotate-180">
                ▾
              </span>
            </span>
          </summary>
          <div className="grid gap-5 border-t border-border px-4 pb-4 pt-4">
            <AmountField
              id={`${id}-allowances`}
              label="Taxable allowances you will also receive"
              hint={`Fixed cash allowances, ${per}. The calculator works out the basic salary needed on top.`}
              value={form.allowances}
              error={errors.allowances}
              onChange={(v) => set("allowances", v)}
            />
            <div>
              <label htmlFor={`${id}-year`} className="mb-1.5 block text-sm font-medium">
                Tax rules
              </label>
              <select
                id={`${id}-year`}
                value={form.rulesetId}
                onChange={(e) => set("rulesetId", e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-base focus:outline-2 focus:outline-brand"
              >
                {RULESETS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </details>
        <p className="mt-5 text-xs text-muted">Calculated in your browser. Your salary is not sent or stored anywhere.</p>
      </form>

      <div aria-live="polite" className="space-y-4">
        {solved && p ? (
          <>
            <div className="rounded-2xl border border-brand bg-brand-soft p-5 sm:p-6">
              <h2 className="text-sm font-medium text-muted">Basic salary needed</h2>
              <p className="mt-2 text-4xl font-bold tabular-nums text-brand sm:text-5xl" data-testid="required-basic">
                {formatGHS(p.basicSalary)}
              </p>
              <p className="mt-1 text-sm text-muted">
                {view === "monthly" ? "per month" : "per year"} · gross salary {formatGHS(p.gross)}
                {p.allowances > 0 && " including allowances"}
              </p>
              {solved.monthlyBasic === 0 && <p className="mt-2 text-sm">Your allowances alone already give this take-home pay.</p>}
              {form.frequency === "annual" && (
                <p className="mt-2 text-xs text-muted">Worked out month by month; the annual take-home pay may be a few pesewas above your target.</p>
              )}
            </div>
            <SalaryResults result={solved.result} view={view} onViewChange={setView} />
          </>
        ) : (
          <div className="grid min-h-48 place-items-center rounded-2xl border border-dashed border-border p-6 text-center text-muted">
            <p>Enter the take-home pay you want to see the gross salary you need.</p>
          </div>
        )}
      </div>
    </section>
  );
}
