import React, { useMemo, useState, useEffect } from "react";
import {
  Save,
  Download,
  Edit2,
  Check,
  X,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { extractionApi } from "../services/apiClient";
import { toast } from "../utils/toast";
import { AnimatedButton } from "../components/ui/AnimatedButton";
import { HorizontalScroller } from "../components/ui/HorizontalScroller";
import { getCategoryBadgeClassName } from "../utils/categoryStyles";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  trxType: string;
  categorizedBy?: string | null;
  taxable: boolean;
}

const isIncome = (t: Transaction) => t.trxType === "credit";

const formatMoney = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

export const ExtractionReview: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Transaction>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "income" | "expense">("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await extractionApi.getMyTransactions();
        setTransactions(data);
      } catch {
        toast.error("Failed to load transactions");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(transactions.map((t) => t.category || "Uncategorized")),
      ).sort(),
    [transactions],
  );

  const totals = useMemo(() => {
    const income = transactions
      .filter(isIncome)
      .reduce((a, t) => a + t.amount, 0);
    const expense = transactions
      .filter((t) => !isIncome(t))
      .reduce((a, t) => a + t.amount, 0);
    return { income, expense, net: income - expense };
  }, [transactions]);

  const filtered = useMemo(() => {
    if (tab === "income") return transactions.filter(isIncome);
    if (tab === "expense") return transactions.filter((t) => !isIncome(t));
    return transactions;
  }, [tab, transactions]);

  const startEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditForm(transaction);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    toast.info("Editing will be enabled soon");
    cancelEdit();
  };

  const exportToCSV = () => {
    const headers = ["Date", "Amount", "Type", "Category"];
    const rows = transactions.map((t) => [
      t.date,
      isIncome(t) ? `+${t.amount.toFixed(2)}` : `-${t.amount.toFixed(2)}`,
      isIncome(t) ? "Income" : "Expense",
      `"${(t.category || "Uncategorized").replace(/"/g, '""')}"`,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported to CSV");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[color:var(--accent-ring)] bg-[color:var(--accent-soft)] text-[color:var(--accent)] text-xs font-medium"
          >
            <Sparkles size={12} />
            {transactions.length} transactions ready
          </motion.div>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            Extraction review
          </h1>
          <p className="mt-1 text-[var(--text-secondary)]">
            Scan what we pulled from your statements. Fix anything that looks
            off before it lands in reports.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm text-[color:var(--accent)] border border-[color:var(--accent-ring)] bg-[color:var(--accent-soft)] hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <Download size={16} />
            Export CSV
          </motion.button>
          <AnimatedButton
            size="sm"
            onClick={() => toast.info("Saving will be enabled soon")}
            trailingIcon={<Save size={14} />}
          >
            Save changes
          </AnimatedButton>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Income",
            value: totals.income,
            icon: TrendingUp,
            accent: "text-emerald-500",
            tint: "bg-emerald-500/10 border-emerald-500/20",
          },
          {
            label: "Expenses",
            value: totals.expense,
            icon: TrendingDown,
            accent: "text-rose-500",
            tint: "bg-rose-500/10 border-rose-500/20",
          },
          {
            label: "Net",
            value: totals.net,
            icon: Sparkles,
            accent: "text-[color:var(--accent)]",
            tint: "bg-[color:var(--accent-soft)] border-[color:var(--accent-ring)]",
          },
        ].map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.05 }}
            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-xl border ${c.tint} flex items-center justify-center`}>
              <c.icon size={18} className={c.accent} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                {c.label}
              </p>
              <p className="text-xl font-bold text-[var(--text-primary)]">
                PKR {formatMoney(c.value)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tab strip */}
      <div className="relative inline-flex bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-1">
        {(
          [
            { id: "all", label: `All (${transactions.length})` },
            { id: "income", label: "Income" },
            { id: "expense", label: "Expenses" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              tab === t.id
                ? "text-[color:var(--accent)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {tab === t.id && (
              <motion.span
                layoutId="txn-tab-pill"
                className="absolute inset-0 bg-[color:var(--accent-soft)] border border-[color:var(--accent-ring)] rounded-lg"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Table — the styled card lives on HorizontalScroller itself so
          its floating "scroll →" chevron isn't clipped by an outer
          overflow-hidden wrapper. */}
      <div>
        <HorizontalScroller className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl">
          <table className="w-full min-w-[640px]">
            <thead className="bg-[var(--bg-primary)]/70 border-b border-[var(--border-color)]">
              <tr>
                {["Date", "Amount", "Type", "Category", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {filtered.map((transaction, i) => {
                  const editing = editingId === transaction.id;
                  return (
                    <motion.tr
                      key={transaction.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: Math.min(i * 0.015, 0.25) }}
                      className="border-b border-[var(--border-color)] hover:bg-[var(--bg-tertiary)]/50 transition-colors"
                    >
                      <td className="px-5 py-3 text-sm text-[var(--text-primary)]">
                        {editing ? (
                          <input
                            type="date"
                            value={editForm.date}
                            onChange={(e) =>
                              setEditForm({ ...editForm, date: e.target.value })
                            }
                            className="bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg px-2 py-1 focus:border-[color:var(--accent)] focus:outline-none"
                          />
                        ) : (
                          transaction.date
                        )}
                      </td>
                      <td className="px-5 py-3 text-sm">
                        {editing ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.amount}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                amount: parseFloat(e.target.value),
                              })
                            }
                            className="w-24 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg px-2 py-1 focus:border-[color:var(--accent)] focus:outline-none"
                          />
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 font-medium ${
                              isIncome(transaction)
                                ? "text-emerald-500"
                                : "text-rose-500"
                            }`}
                          >
                            {isIncome(transaction) ? (
                              <ArrowUpRight size={14} />
                            ) : (
                              <ArrowDownRight size={14} />
                            )}
                            PKR {formatMoney(transaction.amount)}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                            isIncome(transaction)
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                          }`}
                        >
                          {isIncome(transaction) ? "Income" : "Expense"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm">
                        {editing ? (
                          <select
                            value={editForm.category}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                category: e.target.value,
                              })
                            }
                            className="bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg px-2 py-1 focus:border-[color:var(--accent)] focus:outline-none"
                          >
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat.replace("_", " ")}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border max-w-[160px] truncate overflow-hidden whitespace-nowrap ${getCategoryBadgeClassName(
                              transaction.category
                            )}`}
                          >
                            {transaction.category}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {editing ? (
                          <div className="flex gap-1">
                            <button
                              onClick={saveEdit}
                              aria-label="Save"
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              aria-label="Cancel"
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(transaction)}
                            aria-label="Edit"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] transition-colors"
                          >
                            <Edit2 size={15} />
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </HorizontalScroller>
        {filtered.length === 0 && (
          <div className="mt-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-14 text-center text-sm text-[var(--text-secondary)]">
            No transactions in this view yet.
          </div>
        )}
      </div>
    </div>
  );
};
