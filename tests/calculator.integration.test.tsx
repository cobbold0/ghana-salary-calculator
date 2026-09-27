import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SalaryCalculator } from "@/components/calculator/SalaryCalculator";

function setup() {
  const user = userEvent.setup();
  render(<SalaryCalculator />);
  return { user, salary: screen.getByLabelText("Basic salary"), net: () => screen.getByTestId("net-pay") };
}

describe("SalaryCalculator", () => {
  it("starts with a prompt instead of a result", () => {
    setup();
    expect(screen.getByText(/Enter your basic salary/)).toBeInTheDocument();
    expect(screen.queryByTestId("net-pay")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows take-home pay, deductions, tax year and notice as the user types", async () => {
    const { user, salary, net } = setup();
    await user.type(salary, "5,000");
    expect(net()).toHaveTextContent("GH₵3,945.25");
    expect(screen.getByText("SSNIT (employee 5.5%)").nextSibling).toHaveTextContent("−GH₵275.00");
    expect(screen.getByText("PAYE income tax").nextSibling).toHaveTextContent("−GH₵779.75");
    expect(screen.getByText(/Tax rules: 2026 \(1 Jan – 31 Aug\)/)).toBeInTheDocument();
    expect(screen.getAllByText(/Act 1178/).length).toBeGreaterThan(0);
  });

  it("switches between monthly and annual views", async () => {
    const { user, salary, net } = setup();
    await user.type(salary, "5000");
    await user.click(screen.getByRole("button", { name: "Annual" }));
    expect(net()).toHaveTextContent("GH₵47,343.00");
    expect(screen.getByRole("button", { name: "Annual" })).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "Monthly" }));
    expect(net()).toHaveTextContent("GH₵3,945.25");
  });

  it("treats the entered salary as annual when 'Annually' is selected", async () => {
    const { user, salary, net } = setup();
    await user.click(screen.getByLabelText("Annually"));
    await user.type(salary, "60000");
    expect(net()).toHaveTextContent("GH₵47,343.00");
    await user.click(screen.getByRole("button", { name: "Monthly" }));
    expect(net()).toHaveTextContent("GH₵3,945.25");
  });

  it("includes allowances and bonus from the advanced section", async () => {
    const { user, salary, net } = setup();
    await user.type(salary, "5000");
    await user.click(screen.getByText("Allowances, bonus & tax year"));
    await user.type(screen.getByLabelText("Taxable allowances"), "1000");
    expect(net()).toHaveTextContent("GH₵4,695.25");
    await user.type(screen.getByLabelText("Bonus (once a year)"), "6000");
    await user.click(screen.getByRole("button", { name: "Annual" }));
    expect(screen.getByText("Tax on bonus").nextSibling).toHaveTextContent("−GH₵300.00");
  });

  it("recalculates with a different tax year", async () => {
    const { user, salary, net } = setup();
    await user.type(salary, "100000");
    expect(net()).toHaveTextContent("GH₵66,450.42");
    await user.selectOptions(screen.getByLabelText("Tax rules"), "2025");
    expect(net()).toHaveTextContent("GH₵66,736.42");
  });

  it("shows a field error for malformed input and hides the result", async () => {
    const { user, salary } = setup();
    await user.type(salary, "12.345");
    expect(screen.getByText("Basic salary must be a number with at most 2 decimal places")).toBeInTheDocument();
    expect(salary).toHaveAttribute("aria-invalid", "true");
    expect(screen.queryByTestId("net-pay")).not.toBeInTheDocument();
  });

  it("rejects a zero salary", async () => {
    const { user, salary } = setup();
    await user.type(salary, "0");
    expect(screen.getByText("Basic salary must be greater than zero")).toBeInTheDocument();
  });
});
