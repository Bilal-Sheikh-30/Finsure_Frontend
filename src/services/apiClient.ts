import axios from "axios";
import mockData from "../data/mockData.json";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// REAL AUTH API
export const authApi = {
  signup: async (data: {
    name: string;
    email: string;
    password: string;
    userType: string;
  }) => {
    const res = await apiClient.post("/api/v1/auth/signup", data);
    return res.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await apiClient.post("/api/v1/auth/login", data);
    return res.data;
  },

  // UPDATE PROFILE (name & email)
  updateProfile: async (data: { name: string; email: string }) => {
    const res = await apiClient.patch("/api/v1/auth/edit/me", data);
    return res.data;
  },

  // CHANGE PASSWORD
  changePassword: async (data: {
    current_password: string;
    new_password: string;
  }) => {
    const res = await apiClient.patch("/api/v1/auth/change-password", data);
    return res.data;
  },
};

// ================= UPLOAD API =================
export const uploadApi = {
  uploadStatement: async (
    file: File,
    fileType: string,
    password?: string | null
  ) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("file_type", fileType);

    if (password) {
      formData.append("password", password);
    }

    const res = await apiClient.post("api/v1/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },
};

// ================= ACCOUNTS API =================
export const accountsApi = {
  addAccount: async (data: { bank: string; acc_no: string }) => {
    const res = await apiClient.post("/api/v1/files/new_account", data);
    return res.data;
  },
};

// ================= HISTORY API =================
export const historyApi = {
  getMyUploadHistory: async () => {
    const res = await apiClient.get("/api/v1/data/my-upload-history");
    return res.data.history;
  },
};

// ================= DASHBOARD API =================
export const dashboardApi = {
  getOverview: async () => {
    const res = await apiClient.get("/api/v1/data/my-dashboard-overview");
    return res.data.dashboardSummary;
  },
};

export const extractionApi = {
  getMyTransactions: async () => {
    const res = await apiClient.get("/api/v1/data/my-transaction-history");

    return res.data.transactions.map((t: any, index: number) => ({
      id: String(index + 1),

      // extract DATE ONLY (YYYY-MM-DD)
      date: t.date ? t.date.split("T")[0] : "",

      amount: t.amount,
      category: t.category === "credit" ? "income" : "expense",
      taxable: t.taxable === "true" || t.taxable === true,
    }));
  },
};

// ================= REPORTS API =================

export const reportsApi = {
  // Get all reports
  getAll: async () => {
    const res = await apiClient.get("/api/v1/reports");
    return res.data.reports;
  },

  // Generate report
  generate: async (reportType: string, startDate: string, endDate: string) => {
    // REAL API ONLY for income_expense
    if (reportType === "income_expense") {
      const res = await apiClient.post("/api/v1/reports/generate", {
        reportType,
        startDate,
        endDate,
      });

      return res.data;
    }

    // MOCK for others
    await delay(800);
    const template = (mockData as any).reportTemplates[reportType];
    if (!template) throw new Error("Template not found");

    const newReportId = `r${Date.now()}`;

    const report = {
      id: newReportId,
      title:
        reportType === "tax_summary"
          ? "Tax Summary Report"
          : "Cash Flow Analysis",
      generatedDate: new Date().toISOString(),
      type: reportType,
      dateRange: `${startDate} to ${endDate}`,
    };

    const detailedReport = {
      ...template,
      reportId: newReportId,
      title: report.title,
      dateRange: report.dateRange,
      generatedDate: report.generatedDate,
    };

    generatedReports.unshift(report);
    generatedDetailedReports.push(detailedReport);
    detailedReportsMap.set(newReportId, detailedReport);

    return { report };
  },

  //Get detailed report
  getDetailedReport: async (reportId: string) => {
    // Try backend first
    try {
      const res = await apiClient.get(`/api/v1/reports/${reportId}`);
      return res.data;
    } catch {
      // fallback to mock
      const detailed = detailedReportsMap.get(reportId);
      if (!detailed) throw new Error("Report not found");
      return detailed;
    }
  },

  // Download PDF (future backend)
  downloadReportPDF: async (reportId: string) => {
    await delay(500);
    return { success: true };
  },
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Store generated reports in memory
const generatedReports: any[] = [...(mockData.reports || [])];
const generatedDetailedReports: any[] = [...(mockData.detailedReports || [])];

// Create a map of reportId to detailed report for faster lookup
const detailedReportsMap = new Map(
  generatedDetailedReports.map((report) => [report.reportId, report])
);

export const mockApi = {
  auth: {
    login: async (email: string, password: string) => {
      await delay(800);
      const user = mockData.users.find(
        (u) => u.email === email && u.password === password
      );
      if (user) {
        const token = `mock-token-${user.id}`;
        localStorage.setItem("authToken", token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
          })
        );
        return {
          success: true,
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
          },
        };
      }
      throw new Error("Invalid credentials");
    },
    signup: async (email: string, password: string, name: string) => {
      await delay(1000);
      const newUser = {
        id: String(mockData.users.length + 1),
        email,
        name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        twoFactorEnabled: false,
      };
      const token = `mock-token-${newUser.id}`;
      localStorage.setItem("authToken", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          avatar: newUser.avatar,
        })
      );
      return {
        success: true,
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          avatar: newUser.avatar,
        },
      };
    },
    verify2FA: async (code: string) => {
      await delay(600);
      if (code === "123456") {
        return { success: true };
      }
      throw new Error("Invalid 2FA code");
    },
    logout: () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    },
  },
  accounts: {
    addAccount: async (data: { bankName: string; accountNumber: string }) => {
      await delay(600);

      const storedAccounts = JSON.parse(
        localStorage.getItem("accounts") || "[]"
      );

      storedAccounts.push({
        id: String(Date.now()),
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem("accounts", JSON.stringify(storedAccounts));

      return { success: true };
    },
  },

  dashboard: {
    getSummary: async () => {
      await delay(500);
      return mockData.dashboardSummary;
    },
    getRecentUploads: async () => {
      await delay(400);
      return mockData.recentUploads;
    },
    getActivities: async () => {
      await delay(300);
      return mockData.activities;
    },
  },
  upload: {
    uploadFile: async (
      file: File,
      fileType: string,
      password: string | null
    ) => {
      await delay(2000);
      const newUpload = {
        id: String(Date.now()),
        fileName: file.name,
        uploadDate: new Date().toISOString(),
        status: "processing",
        fileType,
        password,
      };
      return { success: true, upload: newUpload };
    },
  },
  extractions: {
    getByFileId: async (fileId: string) => {
      await delay(600);
      const extraction = mockData.extractions.find((e) => e.fileId === fileId);
      return extraction || { id: fileId, fileId, transactions: [] };
    },
    updateTransaction: async (
      fileId: string,
      transactionId: string,
      updates: any
    ) => {
      await delay(400);
      return { success: true, transaction: { id: transactionId, ...updates } };
    },
  },
  reports: {
    getAll: async () => {
      await delay(500);
      return generatedReports;
    },
    generate: async (reportType: string, dateRange: string) => {
      await delay(1500);
      const newReportId = `r${Date.now()}`;
      const reportTypeNames: { [key: string]: string } = {
        income_expense: "Income vs Expense",
        tax_summary: "Tax Summary",
        cashflow: "Cash Flow Analysis",
      };

      const newReport = {
        id: newReportId,
        title: `${reportTypeNames[reportType]} Report`,
        generatedDate: new Date().toISOString(),
        type: reportType,
        dateRange,
      };

      // Get template for this report type from mockData
      const templates = (mockData as any).reportTemplates;
      if (templates && templates[reportType]) {
        const template = templates[reportType];
        const newDetailedReport = {
          ...template,
          reportId: newReportId,
          title: `${reportTypeNames[reportType]} Report`,
          dateRange,
          generatedDate: new Date().toISOString(),
        };
        generatedDetailedReports.push(newDetailedReport);
        // Also add to the map for quick lookup
        detailedReportsMap.set(newReportId, newDetailedReport);
      }

      generatedReports.push(newReport);
      return { success: true, report: newReport };
    },
    getDetailedReport: async (reportId: string) => {
      await delay(800);
      // Use the map for faster and more reliable lookup
      const detailedReport = detailedReportsMap.get(reportId);
      if (!detailedReport) {
        throw new Error("Report not found");
      }
      return detailedReport;
    },
    downloadReportPDF: async (reportId: string) => {
      await delay(1000);
      // Backend endpoint: /api/v1/reports/${reportId}/download
      return { success: true, message: "Report download initiated" };
    },
  },
  charts: {
    getData: async () => {
      await delay(400);
      return mockData.chartData;
    },
  },
  history: {
    getAll: async (filters?: any) => {
      await delay(600);
      return mockData.history;
    },
  },
};

export default apiClient;
