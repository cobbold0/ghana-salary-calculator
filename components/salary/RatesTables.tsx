import { calculatePaye } from "@/lib/calculations/paye";
import { formatGHS } from "@/lib/money";
import { getRuleset } from "@/lib/tax";

/** Monthly PAYE bands for a ruleset, rendered from configuration. */
export function PayeBandsTable({ rulesetId }: { rulesetId?: string }) {
  const ruleset = getRuleset(rulesetId);
  // Run a very large income through the engine to get every band's bounds.
  const bands = calculatePaye(1_000_000_000_000, ruleset.paye.monthlyBands).bands;
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full text-sm">
        <caption className="px-4 pt-3 text-left text-xs text-muted">
          Resident monthly PAYE bands — {ruleset.label}
        </caption>
        <thead className="text-left">
          <tr className="border-b border-border">
            <th scope="col" className="px-4 py-2 font-semibold">Chargeable income (monthly)</th>
            <th scope="col" className="px-4 py-2 font-semibold">Rate</th>
            <th scope="col" className="px-4 py-2 text-right font-semibold">Max tax in band</th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {bands.map((b, i) => {
            const cumulative = b.to === null ? 0 : calculatePaye(b.to, ruleset.paye.monthlyBands).total;
            return (
              <tr key={b.from} className="border-b border-border last:border-0">
                <td className="px-4 py-2">
                  {i === 0 ? `First ${formatGHS(b.to!)}` : b.to === null ? `Above ${formatGHS(b.from)}` : `Next ${formatGHS(b.to - b.from)}`}
                </td>
                <td className="px-4 py-2">{b.rateBp / 100}%</td>
                <td className="px-4 py-2 text-right">{b.to === null ? "—" : `${formatGHS(b.tax)} (total ${formatGHS(cumulative)})`}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function SsnitFacts({ rulesetId }: { rulesetId?: string }) {
  const r = getRuleset(rulesetId);
  return (
    <dl className="not-prose my-6 grid gap-3 sm:grid-cols-3">
      {[
        ["Employee contribution", `${r.ssnit.employeeRateBp / 100}% of basic salary`],
        ["Maximum insurable earnings", `${formatGHS(r.ssnit.maxInsurableMonthly)} a month`],
        ["Maximum employee contribution", `${formatGHS(Math.round((r.ssnit.maxInsurableMonthly * r.ssnit.employeeRateBp) / 10_000))} a month`],
      ].map(([term, value]) => (
        <div key={term} className="rounded-xl border border-border bg-surface p-4">
          <dt className="text-xs text-muted">{term}</dt>
          <dd className="mt-1 font-semibold">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
