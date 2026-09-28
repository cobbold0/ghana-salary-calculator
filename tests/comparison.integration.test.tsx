import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SalaryComparison } from "@/components/calculator/SalaryComparison";

describe("SalaryComparison", () => {
  it("waits for both offers, then shows the difference and a side-by-side table", async () => {
    const user = userEvent.setup();
    render(<SalaryComparison />);
    await user.type(screen.getByLabelText("Offer A basic salary"), "6000");
    expect(screen.getByText(/Enter a basic salary for both offers/)).toBeInTheDocument();

    await user.type(screen.getByLabelText("Offer B basic salary"), "5000");
    await user.click(screen.getAllByText("Allowances & bonus")[1]);
    await user.type(screen.getByLabelText("Offer B taxable allowances"), "1000");

    const summary = screen.getByTestId("comparison-summary");
    expect(summary).toHaveTextContent("Offer B gives GH₵495.00 more take-home pay a year.");
    expect(summary).toHaveTextContent("In a regular month (excluding bonuses), Offer B gives GH₵41.25 more.");
    expect(summary).toHaveTextContent("Offer A pays GH₵55.00 more a month into your SSNIT pension");

    const row = screen.getByRole("rowheader", { name: "Estimated take-home pay" }).closest("tr")!;
    expect(row).toHaveTextContent("GH₵55,848.00");
    expect(row).toHaveTextContent("GH₵56,343.00");
    expect(row).toHaveTextContent("+GH₵495.00");

    await user.click(screen.getByRole("button", { name: "Monthly" }));
    expect(screen.getByRole("rowheader", { name: "Estimated take-home pay" }).closest("tr")).toHaveTextContent("+GH₵41.25");
  });

  it("recalculates both offers when the tax year changes", async () => {
    const user = userEvent.setup();
    render(<SalaryComparison />);
    await user.type(screen.getByLabelText("Offer A basic salary"), "100000");
    await user.type(screen.getByLabelText("Offer B basic salary"), "65000");
    await user.selectOptions(screen.getByLabelText("Tax rules for both offers"), "2025");
    const ssnit = screen.getByRole("rowheader", { name: "SSNIT" }).closest("tr")!;
    expect(ssnit).toHaveTextContent("−GH₵40,260.00"); // 3,355 × 12
  });

  it("shows validation errors per offer", async () => {
    const user = userEvent.setup();
    render(<SalaryComparison />);
    await user.type(screen.getByLabelText("Offer B basic salary"), "-5");
    expect(screen.getByText("Basic salary cannot be negative")).toBeInTheDocument();
  });
});
