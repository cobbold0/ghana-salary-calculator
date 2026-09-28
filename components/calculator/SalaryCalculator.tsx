"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { calculateSalary, type Frequency } from "@/lib/calculations/salary";
import { DEFAULT_RULESET_ID, listRulesets } from "@/lib/tax";
import { parseSalaryForm, type SalaryFormErrors, type SalaryFormValues } from "@/lib/validation/salary-input";
import { SalaryResults } from "./SalaryResults";

const RULESETS = listRulesets().map(({ id, label }) => ({ id, label }));

type FormState = Required<SalaryFormValues>;

const INITIAL: FormState = { basicSalary: "", frequency: "monthly", allowances: "", annualBonus: "", rulesetId: DEFAULT_RULESET_ID };

export function SalaryCalculator({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [view, setView] = useState<Frequency>("monthly");
  const id = useId();

  const parsed = useMemo(() => parseSalaryForm(form), [form]);
  const result = useMemo(() => (parsed.ok ? calculateSalary(parsed.input) : null), [parsed]);

  useEffect(() => track({ name: "calculator_opened" }), []);
  // Results update on every keystroke; report only the first completed calculation per visit.
  const reported = useRef(false);
  useEffect(() => {
    if (!parsed.ok || reported.current) return;
    reported.current = true;
    const { frequency, allowances, annualBonus, rulesetId } = parsed.input;
    track({
      name: "calculation_completed",
      params: { period: frequency, has_allowances: !!allowances, has_bonus: !!annualBonus, tax_rules: rulesetId ?? "" },
    });
  }, [parsed]);
  // An empty salary is the starting state, not an error worth shouting about.
  const errors: SalaryFormErrors = parsed.ok ? {} : { ...parsed.errors };
  if (form.basicSalary.trim() === "") delete errors.basicSalary;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));
  const per = form.frequency === "monthly" ? "a month" : "a year";
  const Heading = headingLevel;

  return (
    <section aria-labelledby={`${id}-title`} className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start">
      <form
        className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <Heading id={`${id}-title`} className="mb-5 text-xl font-bold">
          Your salary
        </Heading>

        <AmountField
          id={`${id}-basic`}
          label="Basic salary"
          hint={`Before any deductions, ${per}.`}
          value={form.basicSalary}
          error={errors.basicSalary}
          onChange={(v) => set("basicSalary", v)}
          autoFocus={headingLevel === "h1"}
        />

        <fieldset className="mt-5">
          <legend className="mb-2 text-sm font-medium">Salary is paid</legend>
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-background p-1">
            {(["monthly", "annual"] as const).map((f) => (
              <label
                key={f}
                className="cursor-pointer rounded-lg px-3 py-2.5 text-center text-sm font-medium text-muted has-checked:bg-surface has-checked:text-foreground has-checked:shadow-sm has-focus-visible:outline-2 has-focus-visible:outline-brand"
              >
                <input
                  type="radio"
                  name={`${id}-frequency`}
                  value={f}
                  checked={form.frequency === f}
                  onChange={() => {
                    set("frequency", f);
                    setView(f);
                    track({ name: "salary_period_selected", params: { period: f } });
                  }}
                  className="sr-only"
                />
                {f === "monthly" ? "Monthly" : "Annually"}
              </label>
            ))}
          </div>
        </fieldset>

        <details className="group mt-5 rounded-xl border border-border">
          <summary className="cursor-pointer list-none rounded-xl px-4 py-3 text-sm font-medium marker:hidden focus-visible:outline-2 focus-visible:outline-brand">
            <span className="flex items-center justify-between">
              Allowances, bonus &amp; tax year
              <span aria-hidden className="text-muted transition-transform group-open:rotate-180">
                ▾
              </span>
            </span>
          </summary>
          <div className="grid gap-5 border-t border-border px-4 pb-4 pt-4">
            <AmountField
              id={`${id}-allowances`}
              label="Taxable allowances"
              hint={`Cash allowances such as transport or housing, ${per}. Not included in SSNIT.`}
              value={form.allowances}
              error={errors.allowances}
              onChange={(v) => set("allowances", v)}
            />
            <AmountField
              id={`${id}-bonus`}
              label="Bonus (once a year)"
              hint="Total bonus paid in the year."
              value={form.annualBonus}
              error={errors.annualBonus}
              onChange={(v) => set("annualBonus", v)}
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

      <div aria-live="polite">
        {result ? (
          <SalaryResults result={result} view={view} onViewChange={setView} />
        ) : (
          <div className="grid min-h-48 place-items-center rounded-2xl border border-dashed border-border p-6 text-center text-muted">
            <p>Enter your basic salary to see your estimated take-home pay.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function AmountField(props: {
  id: string;
  label: string;
  hint: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}) {
  const { id, label, hint, value, error, onChange, autoFocus } = props;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <span aria-hidden className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
          GH₵
        </span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0.00"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={autoFocus}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-hint${error ? ` ${id}-error` : ""}`}
          className="w-full rounded-lg border border-border bg-surface py-3 pl-14 pr-3 text-lg tabular-nums focus:outline-2 focus:outline-brand aria-invalid:border-danger"
        />
      </div>
      <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
        {hint}
      </p>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
