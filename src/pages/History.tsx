import React, { useState, useEffect } from "react";
import { Filter, ChevronDown, FileText, Calendar } from "lucide-react";
import { historyApi } from "../services/apiClient";
import { useNavigate } from "react-router-dom";

interface HistoryItem {
  fileName: string;
  uploadDate: string;
  status: string;
  fileType: string;
  transactionCount: number;
}


export const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await historyApi.getMyUploadHistory();
        setHistory(data);
        setFilteredHistory(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...history];

    if (selectedType !== "all") {
      filtered = filtered.filter((item) => item.fileType === selectedType);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((item) => item.status === selectedStatus);
    }

    setFilteredHistory(filtered);
  }, [selectedType, selectedStatus, history]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // const formatCurrency = (amount: number) => {
  //   return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(amount));
  // };

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
            Upload History
          </h1>
          <p className="text-[var(--text-secondary)]">
            View and manage all your uploaded documents
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[#14e7ff] border border-[#14e7ff] px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Filter size={18} />
          <span>Filters</span>
          <ChevronDown
            size={18}
            className={`transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {showFilters && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                File Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg px-4 py-2 focus:border-[#14e7ff] focus:outline-none"
              >
                <option value="all">All Types</option>
                {/* <option value="invoice">Invoice</option> */}
                <option value="mobile_wallet_statement">Mobile Wallet Statement</option>
                <option value="bank_statement">Bank Statement</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg px-4 py-2 focus:border-[#14e7ff] focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-6">
        <div className="space-y-4">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <FileText
                className="mx-auto text-[var(--text-secondary)] mb-4"
                size={48}
              />
              <p className="text-[var(--text-secondary)]">
                No files found matching your filters
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={`${item.fileName}-${item.uploadDate}`}
                className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-6 hover:border-[#14e7ff] transition-all duration-300 cursor-pointer"
                onClick={() => navigate("/extracted")}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-[#14e7ff]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="text-[#14e7ff]" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1 truncate">
                        {item.fileName}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(item.uploadDate)}
                        </span>
                        <span>{item.transactionCount} transactions</span>
                        {/* <span className={item.totalAmount >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {formatCurrency(item.totalAmount)}
                        </span> */}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#14e7ff]/10 text-[#14e7ff] rounded-full text-sm font-medium">
                      {item.fileType.replace("_", " ")}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.status === "completed"
                          ? "bg-green-400/10 text-green-400"
                          : "bg-yellow-400/10 text-yellow-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {filteredHistory.length > 0 && (
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg hover:border-[#14e7ff] transition-colors disabled:opacity-50">
              Previous
            </button>
            <span className="text-[var(--text-secondary)]">Page 1 of 1</span>
            <button className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg hover:border-[#14e7ff] transition-colors disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
