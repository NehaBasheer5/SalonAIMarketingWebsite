import React from "react";
import { Check, Minus } from "lucide-react";
import CmsIcon from "@/components/ui/CmsIcon";
import type { PricingComparisonRow, PricingComparisonValue } from "@/lib/content";

export type PricingComparisonProps = {
  heading?: string;
  subheading?: string;
  feature_column_label?: string;
  plan_columns?: string[];
  rows?: PricingComparisonRow[];
};

/**
 * Feature-by-feature table.
 *
 * Rows and plan columns come from the CMS so an admin can edit the matrix from
 * the Pricing screen. Each cell is either free text or a tick, and the featured
 * column is highlighted to line up with the featured plan card above.
 */
export default function PricingComparison({
  heading = "Compare Plans",
  subheading = "Find the perfect fit for your salon's size and growth goals.",
  feature_column_label = "Features",
  plan_columns = ["Starter", "Growth", "Pro", "Enterprise"],
  rows = [],
}: PricingComparisonProps) {
  const renderCell = (cell: PricingComparisonValue | undefined) => {
    const text = cell?.value?.trim();
    if (text) {
      return <span className="text-xs font-semibold text-salon-ink">{text}</span>;
    }
    return cell?.yes ? (
      <Check className="mx-auto h-4 w-4 text-salon-brand" strokeWidth={2.5} />
    ) : (
      <Minus className="mx-auto h-4 w-4 text-salon-card" />
    );
  };

  return (
    <section className="w-full overflow-hidden bg-salon-bg pb-14 lg:pb-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-salon-rule" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
              Compare
            </span>
            <span className="h-px w-8 bg-salon-rule" />
          </div>
          <h2 className="font-display text-3xl tracking-tight text-salon-ink sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-salon-muted">{subheading}</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-salon-card bg-white/80 p-6 shadow-sm">
          <table className="w-full min-w-[650px] border-collapse text-left">
            <thead>
              <tr className="border-b border-salon-card">
                <th className="w-1/3 pb-4 text-sm font-semibold text-salon-ink">
                  {feature_column_label}
                </th>
                {plan_columns.map((column, index) => (
                  <th
                    key={`${column}-${index}`}
                    className={`pb-4 text-center text-sm font-semibold ${
                      index === 1
                        ? "rounded-t-xl bg-salon-shell/70 text-salon-brand"
                        : "text-salon-ink"
                    }`}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-salon-card/70">
              {rows.map((row, rowIndex) => (
                <tr key={`${row.name}-${rowIndex}`} className="transition hover:bg-salon-shell-soft/60">
                  <td className="flex items-center gap-2.5 py-3.5 text-xs font-semibold text-salon-ink">
                    <CmsIcon name={row.icon} className="h-4 w-4 text-salon-brand" strokeWidth={1.8} />
                    {row.name}
                  </td>
                  {plan_columns.map((column, columnIndex) => (
                    <td
                      key={`${row.name}-${column}-${columnIndex}`}
                      className={`py-3.5 text-center ${
                        columnIndex === 1 ? "bg-salon-shell/70" : ""
                      }`}
                    >
                      {renderCell(row.values?.[columnIndex])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}