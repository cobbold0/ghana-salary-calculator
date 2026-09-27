import type { Frequency, SalaryResult } from "@/lib/calculations/salary";
import { formatGHS, formatPercent } from "@/lib/money";

const STATUS_TEXT = {
  "verified-official": "Checked against official GRA/SSNIT publications.",
  "secondary-sources": "Based on published secondary sources; not yet checked against official GRA/SSNIT publications.",
} as const;

export function SalaryResults({ result, view, onViewChange }: { result: SalaryResult; view: Frequency; onViewChange: (v: Frequency) => void }) {
  const p = view === "monthly" ? result.monthly : result.annual;
  const per = view === "monthly" ? "per month" : "per year";
  const segments = [
    { label: "Take-home", value: p.net, className: "bg-brand" },
    { label: "SSNIT", value: p.ssnit, className: "bg-ssnit" },
    { label: "PAYE", value: p.paye, className: "bg-paye" },
    { label: "Tax on bonus", value: p.bonusTax, className: "bg-bonus-tax" },
  ].filter((s) => s.value > 0);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-muted">Estimated take-home pay</h2>
        <div role="group" aria-label="Show amounts" className="grid grid-cols-2 gap-1 rounded-lg bg-background p-1 text-sm">
          {(["monthly", "annual"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => onViewChange(v)}
              className="rounded-md px-3 py-1.5 font-medium text-muted aria-pressed:bg-surface aria-pressed:text-foreground aria-pressed:shadow-sm focus-visible:outline-2 focus-visible:outline-brand"
            >
              {v === "monthly" ? "Monthly" : "Annual"}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 text-4xl font-bold tabular-nums text-brand sm:text-5xl" data-testid="net-pay">
        {formatGHS(p.net)}
      </p>
      <p className="mt-1 text-sm text-muted">
        {per} · {formatPercent(p.effectiveDeductionRate)} of gross goes to deductions
      </p>

      {p.gross > 0 && (
        <div className="mt-5">
          <div aria-hidden className="flex h-3 overflow-hidden rounded-full bg-background">
            {segments.map((s) => (
              <div key={s.label} className={s.className} style={{ width: `${(s.value / p.gross) * 100}%` }} />
            ))}
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted" aria-hidden>
            {segments.map((s) => (
              <li key={s.label} className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${s.className}`} />
                {s.label} {formatPercent(s.value / p.gross)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <table className="mt-6 w-full text-sm">
        <caption className="sr-only">Salary breakdown {per}</caption>
        <tbody className="[&_td]:py-2 [&_td:last-child]:text-right [&_td:last-child]:tabular-nums">
          <Row label="Basic salary" value={p.basicSalary} />
          {p.allowances > 0 && <Row label="Taxable allowances" value={p.allowances} />}
          {p.bonus > 0 && <Row label="Bonus" value={p.bonus} />}
          <tr className="border-t border-border font-semibold">
            <td>Gross salary</td>
            <td>{formatGHS(p.gross)}</td>
          </tr>
          <Row label={`SSNIT (employee ${result.ssnit.rateBp / 100}%)`} value={-p.ssnit} />
          <Row label="PAYE income tax" value={-p.paye} />
          {p.bonusTax > 0 && <Row label="Tax on bonus" value={-p.bonusTax} />}
          <tr className="border-t border-border text-muted">
            <td>Total deductions</td>
            <td>−{formatGHS(p.totalDeductions)}</td>
          </tr>
          <tr className="border-t-2 border-foreground/20 text-base font-bold">
            <td>Estimated take-home pay</td>
            <td>{formatGHS(p.net)}</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-2 text-xs text-muted">
        Effective tax rate {formatPercent(p.effectiveTaxRate)} · Taxable income {formatGHS(p.taxableIncome)} {per}
        {view === "monthly" && result.bonus && " · Monthly view excludes your bonus"}
      </p>

      <div className="mt-6 space-y-2">
        <Disclosure title="How PAYE was worked out (one month)">
          <p className="mb-3 text-muted">
            Taxable income of {formatGHS(result.paye.chargeableIncome)} = basic salary + allowances − SSNIT. Each slice is taxed at its own rate.
          </p>
          <table className="w-full text-xs sm:text-sm">
            <thead className="text-left text-muted">
              <tr>
                <th scope="col" className="pb-1 font-medium">Band</th>
                <th scope="col" className="pb-1 font-medium">Rate</th>
                <th scope="col" className="pb-1 text-right font-medium">Taxed</th>
                <th scope="col" className="pb-1 text-right font-medium">Tax</th>
              </tr>
            </thead>
            <tbody className="tabular-nums [&_td]:py-1 [&_td]:pr-2 [&_td:last-child]:pr-0">
              {result.paye.bands.map((b) => (
                <tr key={b.from} className={b.taxableInBand === 0 ? "text-muted" : undefined}>
                  <td>{b.to === null ? `Above ${formatGHS(b.from)}` : `${formatGHS(b.from)} – ${formatGHS(b.to)}`}</td>
                  <td>{b.rateBp / 100}%</td>
                  <td className="text-right">{formatGHS(b.taxableInBand)}</td>
                  <td className="text-right">{formatGHS(b.tax)}</td>
                </tr>
              ))}
              <tr className="border-t border-border font-semibold">
                <td colSpan={3}>PAYE for the month</td>
                <td className="text-right">{formatGHS(result.paye.total)}</td>
              </tr>
            </tbody>
          </table>
        </Disclosure>

        <Disclosure title="How SSNIT was worked out (one month)">
          <p>
            {result.ssnit.rateBp / 100}% × {formatGHS(result.ssnit.insurableEarnings)} basic salary = <strong>{formatGHS(result.ssnit.contribution)}</strong>
          </p>
          {result.ssnit.capped && (
            <p className="mt-2 text-muted">
              Your basic salary of {formatGHS(result.ssnit.basicSalary)} is above the maximum insurable earnings, so SSNIT is capped at{" "}
              {formatGHS(result.ssnit.insurableEarnings)}.
            </p>
          )}
        </Disclosure>

        {result.bonus && (
          <Disclosure title="How the bonus tax was worked out">
            <ul className="list-disc space-y-1 pl-5">
              <li>
                {formatGHS(result.bonus.flatRatePortion)} (the part within the flat-rate limit) × {result.bonus.flatRateBp / 100}% ={" "}
                {formatGHS(result.bonus.flatTax)}
              </li>
              {result.bonus.excess > 0 && (
                <li>
                  {formatGHS(result.bonus.excess)} above the limit is added to one month&apos;s pay: extra PAYE {formatGHS(result.bonus.excessTax)}
                </li>
              )}
            </ul>
          </Disclosure>
        )}

        <Disclosure title="Assumptions and what is not included">
          <h3 className="font-semibold">Assumptions</h3>
          <ul className="mb-3 mt-1 list-disc space-y-1 pl-5">
            {result.assumptions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <h3 className="font-semibold">Not included</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            {result.exclusions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </Disclosure>
      </div>

      <div className="mt-5 rounded-xl border border-notice-border bg-notice-bg p-4 text-sm">
        <p>
          <strong>Tax rules: {result.ruleset.label}.</strong> {STATUS_TEXT[result.ruleset.status]}
        </p>
        {result.ruleset.notice && <p className="mt-2">{result.ruleset.notice}</p>}
        <p className="mt-2">This is an estimate, not a payslip. Your employer&apos;s payroll may differ.</p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <tr>
      <td>{label}</td>
      <td>{value < 0 ? `−${formatGHS(-value)}` : formatGHS(value)}</td>
    </tr>
  );
}

function Disclosure({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-xl border border-border text-sm">
      <summary className="cursor-pointer list-none px-4 py-3 font-medium focus-visible:outline-2 focus-visible:outline-brand">
        <span className="flex items-center justify-between gap-2">
          {title}
          <span aria-hidden className="text-muted transition-transform group-open:rotate-180">
            ▾
          </span>
        </span>
      </summary>
      <div className="border-t border-border px-4 py-3">{children}</div>
    </details>
  );
}
