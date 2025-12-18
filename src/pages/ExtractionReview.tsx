import React, { useState, useEffect } from "react";
import { Save, Download, Edit2, Check, X } from "lucide-react";
import { extractionApi } from "../services/apiClient";
import { toast } from "../utils/toast";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  taxable: boolean;
}

export const ExtractionReview: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Transaction>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await extractionApi.getMyTransactions();
        setTransactions(data);
      } catch (err) {
        toast.error("Failed to load transactions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = ["income", "expense"];

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
    const headers = ["Date", "Amount", "Type", "Taxable"];

    const rows = transactions.map((t) => [
      t.date,

      // Signed amount based on category
      t.category === "income"
        ? `+${t.amount.toFixed(2)}`
        : `-${t.amount.toFixed(2)}`,

      // Human-readable type
      t.category === "income" ? "Income" : "Expense",

      // Human-readable taxable
      t.taxable ? "Yes" : "No",
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14e7ff]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Extraction Review
          </h1>
          <p className="text-[var(--text-secondary)]">
            Review and edit extracted transaction data
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[#14e7ff] border border-[#14e7ff] px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <button className="flex items-center gap-2 bg-[#0ab6ff] hover:bg-[#14e7ff] text-[#0c111a] px-4 py-2 rounded-lg font-medium transition-colors">
            <Save size={18} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                  Taxable
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <td className="px-6 py-4 text-[var(--text-primary)]">
                    {editingId === transaction.id ? (
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) =>
                          setEditForm({ ...editForm, date: e.target.value })
                        }
                        className="bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded px-2 py-1 focus:border-[#14e7ff] focus:outline-none"
                      />
                    ) : (
                      transaction.date
                    )}
                  </td>
                  {/* <td className="px-6 py-4 text-[var(--text-primary)]">
                    {editingId === transaction.id ? (
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded px-2 py-1 focus:border-[#14e7ff] focus:outline-none"
                      />
                    ) : (
                      transaction.description
                    )}
                  </td> */}
                  <td className="px-6 py-4 text-[var(--text-primary)]">
                    {editingId === transaction.id ? (
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
                        className="w-24 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded px-2 py-1 focus:border-[#14e7ff] focus:outline-none"
                      />
                    ) : (
                      <span
                        className={
                          transaction.category === "income"
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        PKR {transaction.amount.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[var(--text-primary)]">
                    {editingId === transaction.id ? (
                      <select
                        value={editForm.category}
                        onChange={(e) =>
                          setEditForm({ ...editForm, category: e.target.value })
                        }
                        className="bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded px-2 py-1 focus:border-[#14e7ff] focus:outline-none"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="px-2 py-1 bg-[#14e7ff]/10 text-[#14e7ff] rounded text-sm">
                        {transaction.category.replace("_", " ")}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === transaction.id ? (
                      <input
                        type="checkbox"
                        checked={editForm.taxable}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            taxable: e.target.checked,
                          })
                        }
                        className="w-4 h-4 accent-[#14e7ff]"
                      />
                    ) : (
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          transaction.taxable
                            ? "bg-green-400/10 text-green-400"
                            : "bg-gray-400/10 text-gray-400"
                        }`}
                      >
                        {transaction.taxable ? "Yes" : "No"}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === transaction.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="text-green-400 hover:text-green-300 transition-colors"
                        >
                          <Check size={20} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(transaction)}
                        className="text-[#14e7ff] hover:text-[#0ab6ff] transition-colors"
                      >
                        <Edit2 size={20} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
