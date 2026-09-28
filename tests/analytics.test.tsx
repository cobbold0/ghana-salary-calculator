import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendGAEvent = vi.fn();
vi.mock("@next/third-parties/google", () => ({ sendGAEvent }));

async function renderCalculator() {
  vi.resetModules();
  const { SalaryCalculator } = await import("@/components/calculator/SalaryCalculator");
  render(<SalaryCalculator />);
}

describe("analytics", () => {
  beforeEach(() => sendGAEvent.mockClear());
  afterEach(() => vi.unstubAllEnvs());

  it("sends nothing when no measurement ID is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "");
    await renderCalculator();
    await userEvent.type(screen.getByLabelText("Basic salary"), "5000");
    expect(sendGAEvent).not.toHaveBeenCalled();
  });

  it("sends anonymous events and never any salary amount", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-TEST");
    await renderCalculator();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Basic salary"), "54321");
    await user.click(screen.getByText("Allowances, bonus & tax year"));
    await user.type(screen.getByLabelText("Taxable allowances"), "1234");
    await user.click(screen.getByLabelText("Annually"));

    const names = sendGAEvent.mock.calls.map((c) => c[1]);
    expect(names).toContain("calculator_opened");
    expect(names).toContain("salary_period_selected");
    expect(names.filter((n) => n === "calculation_completed")).toHaveLength(1);
    expect(sendGAEvent).toHaveBeenCalledWith("event", "calculation_completed", {
      period: "monthly",
      has_allowances: false,
      has_bonus: false,
      tax_rules: "2026-jan-aug",
    });

    const payload = JSON.stringify(sendGAEvent.mock.calls);
    for (const amount of ["5432", "54321", "1234", "123400"]) expect(payload).not.toContain(amount);
  });
});
