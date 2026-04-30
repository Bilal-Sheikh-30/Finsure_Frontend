import React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileBarChart,
  Landmark,
  PieChart,
  Sparkles,
  Upload,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { AnimatedButton } from "../components/ui/AnimatedButton";
import { DemoStatementResult } from "../services/apiClient";
import { getCategoryBadgeClassName } from "../utils/categoryStyles";

const TYPE_COLORS = {
  income: {
    text: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    bar: "bg-emerald-500",
  },
  expense: {
    text: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/25",
    bar: "bg-rose-500",
  },
} as const;

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const DemoResults: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const result = (location.state as { result?: DemoStatementResult } | null)
    ?.result;

  if (!result) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 md:px-6">
        <div className="rounded-[32px] border border-[var(--border-color)] bg-[var(--bg-secondary)]/70 p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
            <Upload size={28} />
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-[var(--text-primary)]">
            No demo result loaded
          </h1>
          <p className="mt-3 text-[var(--text-secondary)]">
            This page shows the latest public demo run from the homepage. Start
            a new statement demo to see extracted transactions and the category
            breakdown report.
          </p>
          <div className="mt-8 flex justify-center">
            <AnimatedButton size="md" onClick={() => navigate("/")}>
              Back to homepage
            </AnimatedButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent-ring)] bg-[color:var(--accent-soft)] px-3 py-1 text-xs font-medium text-[color:var(--accent)]">
            <Sparkles size={12} />
            Public statement demo
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            Extraction and categorization preview
          </h1>
          <p className="mt-2 max-w-3xl text-[var(--text-secondary)]">
            This run was processed without sign-in and without saving anything
            to your database.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <AnimatedButton
            variant="secondary"
            size="sm"
            onClick={() => navigate("/")}
            leadingIcon={<ArrowLeft size={16} />}
          >
            Back home
          </AnimatedButton>
          <AnimatedButton size="sm" onClick={() => navigate("/")}>
            Try another statement
          </AnimatedButton>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          {
            label: "Bank",
            value: result.bank,
            icon: Landmark,
          },
          {
            label: "Transactions",
            value: String(result.totalTransactions),
            icon: FileBarChart,
          },
          {
            label: "Pages",
            value: String(result.totalPages),
            icon: Upload,
          },
          {
            label: "Period",
            value: result.report.dateRange,
            icon: PieChart,
          },
        ].map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/70 p-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
                <card.icon size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                  {card.label}
                </p>
                <p className="mt-1 text-lg font-semibold text-[var(--text-primary)]">
                  {card.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[32px] border border-[var(--border-color)] bg-[var(--bg-secondary)]/75 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
                Extracted transactions
              </h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {result.filename}
                {result.accountNumber ? ` | ${result.accountNumber}` : ""}
              </p>
            </div>
            <span className="rounded-full border border-[color:var(--accent-ring)] bg-[color:var(--accent-soft)] px-3 py-1 text-xs font-medium text-[color:var(--accent)]">
              {result.transactions.length} rows
            </span>
          </div>

          <div className="mt-5 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-left text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Description</th>
                  <th className="px-3 py-3">Amount</th>
                  <th className="px-3 py-3">Type</th>
                  <th className="px-3 py-3">Category</th>
                </tr>
              </thead>
              <tbody>
                {result.transactions.map((transaction) => {
                  const typeKey =
                    transaction.trxType === "credit" ? "income" : "expense";
                  const colors = TYPE_COLORS[typeKey];

                  return (
                    <tr
                      key={transaction.id}
                      className="border-b border-[var(--border-color)]/70 align-top"
                    >
                      <td className="px-3 py-3 text-sm text-[var(--text-primary)]">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-3 py-3 text-sm text-[var(--text-primary)]">
                        {transaction.description || "-"}
                      </td>
                      <td
                        className={`px-3 py-3 text-sm font-medium ${colors.text}`}
                      >
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                            colors.bg
                          } ${colors.border} ${colors.text}`}
                        >
                          {transaction.trxType === "credit" ? "Income" : "Expense"}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium max-w-[180px] truncate ${getCategoryBadgeClassName(
                            transaction.category
                          )}`}
                        >
                          {transaction.category}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-5 space-y-3 md:hidden">
            {result.transactions.map((transaction) => {
              const typeKey =
                transaction.trxType === "credit" ? "income" : "expense";
              const colors = TYPE_COLORS[typeKey];

              return (
                <div
                  key={transaction.id}
                  className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/45 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {formatDate(transaction.date)}
                      </p>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {transaction.description || "-"}
                      </p>
                    </div>
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${colors.bg} ${colors.border} ${colors.text}`}
                    >
                      {transaction.trxType === "credit" ? "Income" : "Expense"}
                    </span>
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                        Amount
                      </p>
                      <p className={`mt-1 text-lg font-semibold ${colors.text}`}>
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium flex-shrink-0 max-w-[40%] truncate ${getCategoryBadgeClassName(
                        transaction.category
                      )}`}
                    >
                      {transaction.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-[32px] border border-[var(--border-color)] bg-[var(--bg-secondary)]/75 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
              <PieChart size={18} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
                Category breakdown
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Generated {formatDate(result.report.generatedDate)}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              {
                label: "Total income",
                value: formatCurrency(result.report.summary.totalIncome),
              },
              {
                label: "Total expenses",
                value: formatCurrency(result.report.summary.totalExpenses),
              },
              {
                label: "Top income category",
                value: `${result.report.summary.topIncomeCategory} | ${formatCurrency(
                  result.report.summary.topIncomeAmount
                )}`,
              },
              {
                label: "Top expense category",
                value: `${result.report.summary.topExpenseCategory} | ${formatCurrency(
                  result.report.summary.topExpenseAmount
                )}`,
              },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/50 p-4"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                  {card.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {result.report.categoryBreakdown.map((item) => {
              const colors = TYPE_COLORS[item.type];
              return (
                <div
                  key={`${item.name}-${item.type}`}
                  className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/45 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">
                        {item.name}
                      </p>
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                        {item.type} | {item.transactionCount} transaction
                        {item.transactionCount === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[var(--text-primary)]">
                        {formatCurrency(item.amount)}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {item.percentage}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-[var(--bg-secondary)]">
                    <div
                      className={`h-2 rounded-full ${colors.bar}`}
                      style={{ width: `${Math.max(item.percentage, 3)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
