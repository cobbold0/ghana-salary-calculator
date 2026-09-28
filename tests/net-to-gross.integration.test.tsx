import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { NetToGrossCalculator } from "@/components/calculator/NetToGrossCalculator";
import { parseNetToGrossForm } from "@/lib/validation/salary-input";

describe("NetToGrossCalculator", () => {
  it("shows the basic salary needed and the full breakdown", async () => {
    const user = userEvent.setup();
    render(<NetToGrossCalculator />);
    expect(screen.getByText(/Enter the take-home pay you want/)).toBeInTheDocument();
    await user.type(screen.getByLabelText("Take-home pay"), "3,945.25");
    expect(screen.getByTestId("required-basic")).toHaveTextContent("GH₵5,000.00");
    expect(screen.getByTestId("net-pay")).toHaveTextContent("GH₵3,945.25");
    await user.click(screen.getByRole("button", { name: "Annual" }));
    expect(screen.getByTestId("required-basic")).toHaveTextContent("GH₵60,000.00");
  });

  it("solves an annual target", async () => {
    const user = userEvent.setup();
    render(<NetToGrossCalculator />);
    await user.click(screen.getByLabelText("Annually"));
    await user.type(screen.getByLabelText("Take-home pay"), "47343");
    expect(screen.getByTestId("required-basic")).toHaveTextContent("GH₵60,000.00");
  });

  it("shows validation errors", async () => {
    const user = userEvent.setup();
    render(<NetToGrossCalculator />);
    await user.type(screen.getByLabelText("Take-home pay"), "abc");
    expect(screen.getByText("Take-home pay must be a number with at most 2 decimal places")).toBeInTheDocument();
    expect(screen.queryByTestId("required-basic")).not.toBeInTheDocument();
  });
});

describe("parseNetToGrossForm", () => {
  it("caps the target at GH₵10,000,000", () => {
    expect(parseNetToGrossForm({ targetNet: "10000000", frequency: "monthly" }).ok).toBe(true);
    expect(parseNetToGrossForm({ targetNet: "10000000.01", frequency: "monthly" })).toEqual({
      ok: false,
      errors: { targetNet: "Take-home pay must be GH₵10,000,000 or less" },
    });
  });

  it("requires a positive target", () => {
    expect(parseNetToGrossForm({ targetNet: "0", frequency: "monthly" })).toMatchObject({ ok: false, errors: { targetNet: expect.any(String) } });
  });
});
