import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Upload,
  FileText,
  X,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  mockApi,
  accountsApi,
  historyApi,
  dashboardApi,
} from "../services/apiClient";
import { toast } from "../utils/toast";

interface SummaryData {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  taxableIncome: number;
}

interface RecentUpload {
  fileName: string;
  uploadDate: string;
  status: string;
  fileType: string;
}

interface ActivityItem {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

export const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [recentUploads, setRecentUploads] = useState<RecentUpload[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isSubmittingAccount, setIsSubmittingAccount] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, activitiesData, history] = await Promise.all([
          dashboardApi.getOverview(),
          mockApi.dashboard.getActivities(),
          historyApi.getMyUploadHistory(),
        ]);

        setSummary(summaryData);
        setActivities(activitiesData);

        // show latest 5 uploads
        setRecentUploads(history.slice(0, 5));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14e7ff]"></div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PKR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAddAccount = async () => {
    if (!bankName || !accountNumber) {
      toast.error("Please fill all fields");
      return;
    }

    setIsSubmittingAccount(true);
    try {
      await accountsApi.addAccount({
        bank: bankName,
        acc_no: accountNumber,
      });

      toast.success("Bank account added successfully");

      setShowAddAccountModal(false);
      setBankName("");
      setAccountNumber("");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to add account");
    } finally {
      setIsSubmittingAccount(false);
    }
  };

  const summaryCards = summary
    ? [
        {
          title: "Total Income",
          value: formatCurrency(summary.totalIncome),
          icon: TrendingUp,
          color: "text-green-400",
          bgColor: "bg-green-400/10",
        },
        {
          title: "Total Expenses",
          value: formatCurrency(summary.totalExpenses),
          icon: TrendingDown,
          color: "text-red-400",
          bgColor: "bg-red-400/10",
        },
        {
          title: "Net Profit",
          value: formatCurrency(summary.netProfit),
          icon: DollarSign,
          color: "text-[#14e7ff]",
          bgColor: "bg-[#14e7ff]/10",
        },
        {
          title: "Taxable Income",
          value: formatCurrency(summary.taxableIncome),
          icon: Activity,
          color: "text-yellow-400",
          bgColor: "bg-yellow-400/10",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Dashboard Overview
          </h1>
          <p className="text-[var(--text-secondary)]">
            Welcome back! Here's your financial summary
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddAccountModal(true)}
            className="flex items-center gap-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[#14e7ff] border border-[#14e7ff] px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus size={18} />
            <span>Add Account</span>
          </button>

          <button
            onClick={() => navigate("/upload")}
            className="flex items-center gap-2 bg-[#0ab6ff] hover:bg-[#14e7ff] text-[#0c111a] px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Upload size={18} />
            <span>Upload File</span>
          </button>
          <button
            onClick={() => navigate("/reports")}
            className="flex items-center gap-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[#14e7ff] border border-[#14e7ff] px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <FileText size={18} />
            <span>View Reports</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-6 hover:border-[#14e7ff] transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}
              >
                <card.icon className={card.color} size={24} />
              </div>
            </div>
            <h3 className="text-sm text-[var(--text-secondary)] mb-1">
              {card.title}
            </h3>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {card.value}
            </p>
          </div>
        ))}
      </div>
      {showAddAccountModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-secondary)] rounded-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowAddAccountModal(false)}
              className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-red-400"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
              Add Bank Account
            </h2>

            <div className="space-y-4">
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-3 py-2 text-[var(--text-primary)] focus:border-[#14e7ff] outline-none"
              >
                <option value="">Select Bank</option>
                <option value="Meezan">Meezan Bank</option>
                <option value="Easypaisa">EasyPaisa</option>
              </select>

              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  setAccountNumber(numericValue);
                }}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-3 py-2 text-[var(--text-primary)] focus:border-[#14e7ff] outline-none"
              />

              <button
                onClick={handleAddAccount}
                disabled={isSubmittingAccount}
                className="w-full bg-[#0ab6ff] hover:bg-[#14e7ff] text-[#0c111a] py-2 rounded-lg font-medium transition-colors"
              >
                {isSubmittingAccount ? "Saving..." : "Save Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
            Recent Uploads
          </h2>
          {recentUploads.length === 0 ? (
            <div className="text-center py-12">
              <Upload
                className="mx-auto text-[var(--text-secondary)] mb-4"
                size={48}
              />
              <p className="text-[var(--text-secondary)] mb-4">
                No uploads yet
              </p>
              <button
                onClick={() => navigate("/upload")}
                className="bg-[#0ab6ff] hover:bg-[#14e7ff] text-[#0c111a] px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Upload Your First File
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentUploads.map((upload) => (
                <div
                  key={`${upload.fileName}-${upload.uploadDate}`}
                  className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
                  onClick={() => navigate("/history")}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText
                      className="text-[#14e7ff] flex-shrink-0"
                      size={20}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[var(--text-primary)] font-medium truncate">
                        {upload.fileName}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {formatDate(upload.uploadDate)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      upload.status === "completed"
                        ? "bg-green-400/10 text-green-400"
                        : "bg-yellow-400/10 text-yellow-400"
                    }`}
                  >
                    {upload.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
