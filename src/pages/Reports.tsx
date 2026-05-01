// import React, { useState, useEffect, useRef } from 'react';
// import { FileText, Download, Share2, Plus, Loader, ArrowLeft, TrendingUp, TrendingDown, DollarSign, Calendar, PieChart, BarChart3 } from 'lucide-react';
// import { mockApi } from '../services/apiClient';
// import { toast } from '../utils/toast';

// interface Report {
//   id: string;
//   title: string;
//   generatedDate: string;
//   type: string;
//   dateRange: string;
// }

// interface Transaction {
//   id: string;
//   date: string;
//   description: string;
//   category: string;
//   amount: number;
//   taxable?: boolean;
//   type?: string;
// }

// interface DetailedReport {
//   reportId: string;
//   type: string;
//   title: string;
//   dateRange: string;
//   generatedDate: string;
//   summary: any;
//   transactions: Transaction[];
//   categoryBreakdown?: any[];
//   monthlyData?: any[];
//   taxBreakdown?: any[];
//   cashflowByCategory?: any[];
//   weeklyData?: any[];
// }

// export const Reports: React.FC = () => {
//   const [reports, setReports] = useState<Report[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [showGenerateModal, setShowGenerateModal] = useState(false);
//   const [reportType, setReportType] = useState('income_expense');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [selectedReport, setSelectedReport] = useState<DetailedReport | null>(null);
//   const [isLoadingDetails, setIsLoadingDetails] = useState(false);
//   const [isDownloading, setIsDownloading] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await mockApi.reports.getAll();
//         setReports(data);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const generateReport = async () => {
//     if (!startDate || !endDate) {
//       toast.error('Please select date range');
//       return;
//     }

//     setIsGenerating(true);
//     try {
//       const dateRange = `${startDate} to ${endDate}`;
//       const response = await mockApi.reports.generate(reportType, dateRange);
//       setReports([response.report, ...reports]);
//       toast.success('Report generated successfully!');
//       setShowGenerateModal(false);
//       setStartDate('');
//       setEndDate('');
//     } catch (error) {
//       toast.error('Failed to generate report');
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const viewReportDetails = async (report: Report) => {
//     setIsLoadingDetails(true);
//     try {
//       const detailedReport = await mockApi.reports.getDetailedReport(report.id);
//       setSelectedReport(detailedReport);
//     } catch (error) {
//       toast.error('Failed to load report details');
//     } finally {
//       setIsLoadingDetails(false);
//     }
//   };

//   const downloadReportPDF = async () => {
//     if (!selectedReport) return;
//     setIsDownloading(true);
//     try {
//       await mockApi.reports.downloadReportPDF(selectedReport.reportId);
//       window.print();
//       toast.success('Report downloaded successfully!');
//     } catch (error) {
//       toast.error('Failed to download report');
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   const shareReport = (report: Report) => {
//     navigator.clipboard.writeText(`https://finsure.app/reports/${report.id}`);
//     toast.success('Share link copied to clipboard');
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(Math.abs(amount));
//   };

//   const reportTypeNames: { [key: string]: string } = {
//     income_expense: 'Income vs Expense',
//     tax_summary: 'Tax Summary',
//     cashflow: 'Cash Flow Analysis'
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--accent)]"></div>
//       </div>
//     );
//   }

//   if (selectedReport) {
//     return (
//       <div className="space-y-6">
//         <style>{`@media print {body *{visibility:hidden}#report-content,#report-content *{visibility:visible}#report-content{position:absolute;left:0;top:0;width:100%;background:white;padding:40px}.no-print{display:none!important}}`}</style>

//         <div className="flex items-center justify-between no-print">
//           <button onClick={() => setSelectedReport(null)} className="flex items-center gap-2 text-[color:var(--accent)] hover:text-[color:var(--accent-hover)] transition-colors">
//             <ArrowLeft size={20} />
//             <span>Back to Reports</span>
//           </button>
//           <button onClick={downloadReportPDF} disabled={isDownloading} className="flex items-center gap-2 bg-[color:var(--accent)] hover:bg-[color:var(--accent)] text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
//             {isDownloading ? <><Loader className="animate-spin" size={18} /><span>Downloading...</span></> : <><Download size={18} /><span>Download PDF</span></>}
//           </button>
//         </div>

//         <div id="report-content" className="bg-[#151c27] border border-[color:var(--accent)]/20 rounded-lg p-8">
//           <div className="border-b border-[color:var(--accent)]/20 pb-6 mb-6">
//             <h1 className="text-3xl font-bold text-[#e7f0fa] mb-2">{selectedReport.title}</h1>
//             <div className="flex flex-wrap gap-4 text-sm text-[#e7f0fa]/60">
//               <div className="flex items-center gap-2"><Calendar size={16} /><span>Period: {selectedReport.dateRange}</span></div>
//               <div className="flex items-center gap-2"><FileText size={16} /><span>Generated: {formatDate(selectedReport.generatedDate)}</span></div>
//             </div>
//           </div>

//           {selectedReport.type === 'income_expense' && (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//                 {[
//                   { label: 'Total Income', value: selectedReport.summary.totalIncome, icon: TrendingUp, color: 'text-green-500' },
//                   { label: 'Total Expenses', value: selectedReport.summary.totalExpenses, icon: TrendingDown, color: 'text-red-500' },
//                   { label: 'Net Balance', value: selectedReport.summary.netBalance, icon: DollarSign, color: 'text-[color:var(--accent)]' },
//                   { label: 'Profit Margin', value: `${selectedReport.summary.profitMargin}%`, icon: BarChart3, color: 'text-[color:var(--accent)]', isPercentage: true }
//                 ].map((item, i) => (
//                   <div key={i} className="bg-[#0c111a] border border-[color:var(--accent)]/20 rounded-lg p-4">
//                     <div className="flex items-center gap-2 mb-2">
//                       <item.icon className={item.color} size={20} />
//                       <span className="text-sm text-[#e7f0fa]/60">{item.label}</span>
//                     </div>
//                     <p className={`text-2xl font-bold ${item.color}`}>
//                       {item.isPercentage ? item.value : formatCurrency(item.value as number)}
//                     </p>
//                   </div>
//                 ))}
//               </div>

//               {selectedReport.categoryBreakdown && (
//                 <div className="mb-8">
//                   <h2 className="text-xl font-semibold text-[#e7f0fa] mb-4 flex items-center gap-2">
//                     <PieChart size={20} className="text-[color:var(--accent)]" />Category Breakdown
//                   </h2>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                     {selectedReport.categoryBreakdown.map((cat, idx) => (
//                       <div key={idx} className="bg-[#0c111a] border border-[color:var(--accent)]/20 rounded-lg p-3">
//                         <div className="flex items-center gap-2 mb-1">
//                           <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
//                           <span className="text-sm text-[#e7f0fa]/60">{cat.name}</span>
//                         </div>
//                         <p className="text-lg font-semibold text-[#e7f0fa]">{formatCurrency(cat.value)}</p>
//                         {cat.percentage && <p className="text-xs text-[#e7f0fa]/40">{cat.percentage}%</p>}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {selectedReport.monthlyData && (
//                 <div className="mb-8">
//                   <h2 className="text-xl font-semibold text-[#e7f0fa] mb-4">Monthly Summary</h2>
//                   <div className="overflow-x-auto">
//                     <table className="w-full">
//                       <thead>
//                         <tr className="border-b border-[color:var(--accent)]/20">
//                           {['Month', 'Income', 'Expenses', 'Net'].map(h => (
//                             <th key={h} className={`${h === 'Month' ? 'text-left' : 'text-right'} text-[#e7f0fa]/60 py-3 px-4`}>{h}</th>
//                           ))}
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {selectedReport.monthlyData.map((m, i) => (
//                           <tr key={i} className="border-b border-[color:var(--accent)]/10">
//                             <td className="py-3 px-4 text-[#e7f0fa]">{m.month}</td>
//                             <td className="py-3 px-4 text-right text-green-500">{formatCurrency(m.income)}</td>
//                             <td className="py-3 px-4 text-right text-red-500">{formatCurrency(m.expenses)}</td>
//                             <td className="py-3 px-4 text-right text-[color:var(--accent)] font-semibold">{formatCurrency(m.net)}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}

//           {selectedReport.type === 'tax_summary' && (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//                 {[
//                   { label: 'Taxable Income', value: selectedReport.summary.taxableIncome, icon: DollarSign, color: 'text-green-500' },
//                   { label: 'Deductible Expenses', value: selectedReport.summary.deductibleExpenses, icon: TrendingDown, color: 'text-[color:var(--accent)]' },
//                   { label: 'Net Taxable Income', value: selectedReport.summary.netTaxableIncome, icon: BarChart3, color: 'text-[color:var(--accent)]' }
//                 ].map((item, i) => (
//                   <div key={i} className="bg-[#0c111a] border border-[color:var(--accent)]/20 rounded-lg p-4">
//                     <div className="flex items-center gap-2 mb-2">
//                       <item.icon className={item.color} size={20} />
//                       <span className="text-sm text-[#e7f0fa]/60">{item.label}</span>
//                     </div>
//                     <p className={`text-2xl font-bold ${item.color}`}>{formatCurrency(item.value)}</p>
//                   </div>
//                 ))}
//               </div>

//               {selectedReport.taxBreakdown && (
//                 <div className="mb-8">
//                   <h2 className="text-xl font-semibold text-[#e7f0fa] mb-4">Tax Breakdown</h2>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                     {selectedReport.taxBreakdown.map((item, idx) => (
//                       <div key={idx} className="bg-[#0c111a] border border-[color:var(--accent)]/20 rounded-lg p-4">
//                         <div className="flex items-center gap-2 mb-2">
//                           <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
//                           <span className="text-sm text-[#e7f0fa]/60">{item.name}</span>
//                         </div>
//                         <p className="text-xl font-semibold text-[#e7f0fa]">{formatCurrency(item.value)}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </>
//           )}

//           {selectedReport.type === 'cashflow' && (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//                 {[
//                   { label: 'Opening Balance', value: selectedReport.summary.openingBalance, icon: DollarSign, color: 'text-[#e7f0fa]' },
//                   { label: 'Total Inflows', value: selectedReport.summary.totalInflows, icon: TrendingUp, color: 'text-green-500' },
//                   { label: 'Total Outflows', value: selectedReport.summary.totalOutflows, icon: TrendingDown, color: 'text-red-500' },
//                   { label: 'Closing Balance', value: selectedReport.summary.closingBalance, icon: DollarSign, color: 'text-[color:var(--accent)]' }
//                 ].map((item, i) => (
//                   <div key={i} className="bg-[#0c111a] border border-[color:var(--accent)]/20 rounded-lg p-4">
//                     <div className="flex items-center gap-2 mb-2">
//                       <item.icon className={item.color} size={20} />
//                       <span className="text-sm text-[#e7f0fa]/60">{item.label}</span>
//                     </div>
//                     <p className={`text-2xl font-bold ${item.color}`}>{formatCurrency(item.value)}</p>
//                   </div>
//                 ))}
//               </div>

//               {selectedReport.cashflowByCategory && (
//                 <div className="mb-8">
//                   <h2 className="text-xl font-semibold text-[#e7f0fa] mb-4">Cash Flow by Category</h2>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                     {selectedReport.cashflowByCategory.map((cat, idx) => (
//                       <div key={idx} className="bg-[#0c111a] border border-[color:var(--accent)]/20 rounded-lg p-4">
//                         <div className="flex items-center gap-2 mb-2">
//                           <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
//                           <span className="text-sm text-[#e7f0fa]/60">{cat.name}</span>
//                         </div>
//                         <p className="text-xl font-semibold text-[#e7f0fa]">{formatCurrency(cat.value)}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </>
//           )}

//           <div>
//             <h2 className="text-xl font-semibold text-[#e7f0fa] mb-4">Detailed Transactions</h2>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-[color:var(--accent)]/20">
//                     {['Date', 'Description', 'Category', 'Amount'].map(h => (
//                       <th key={h} className={`${h === 'Amount' ? 'text-right' : 'text-left'} text-[#e7f0fa]/60 py-3 px-4`}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {selectedReport.transactions.map((txn) => (
//                     <tr key={txn.id} className="border-b border-[color:var(--accent)]/10 hover:bg-[#0c111a]/50">
//                       <td className="py-3 px-4 text-[#e7f0fa]/80">{formatDate(txn.date)}</td>
//                       <td className="py-3 px-4 text-[#e7f0fa]">{txn.description}</td>
//                       <td className="py-3 px-4">
//                         <span className="inline-block px-2 py-1 bg-[color:var(--accent-soft)] text-[color:var(--accent)] rounded text-xs">{txn.category}</span>
//                       </td>
//                       <td className={`py-3 px-4 text-right font-semibold ${txn.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//                         {txn.amount >= 0 ? '+' : '-'}{formatCurrency(txn.amount)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="mt-8 pt-6 border-t border-[color:var(--accent)]/20 text-center text-sm text-[#e7f0fa]/40">
//             <p>Generated by FinSure Financial Management System</p>
//             <p className="mt-1">This report is confidential and intended for authorized use only.</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-[#e7f0fa]">Generated Reports</h1>
//           <p className="text-[#e7f0fa]/60">View, download, and share your financial reports</p>
//         </div>
//         <button onClick={() => setShowGenerateModal(true)} className="flex items-center gap-2 bg-[color:var(--accent)] hover:bg-[color:var(--accent)] text-white px-4 py-2 rounded-lg font-medium transition-colors">
//           <Plus size={18} /><span>Generate Report</span>
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {reports.map((report) => (
//           <div key={report.id} className="bg-[#151c27] border border-[color:var(--accent)]/20 rounded-lg p-6 hover:border-[color:var(--accent)] transition-all duration-300">
//             <div className="w-12 h-12 bg-[color:var(--accent-soft)] rounded-lg flex items-center justify-center mb-4">
//               <FileText className="text-[color:var(--accent)]" size={24} />
//             </div>
//             <h3 className="text-lg font-semibold text-[#e7f0fa] mb-2 line-clamp-2">{report.title}</h3>
//             <div className="space-y-2 mb-4">
//               <p className="text-sm text-[#e7f0fa]/60">Generated: {formatDate(report.generatedDate)}</p>
//               <p className="text-sm text-[#e7f0fa]/60">Period: {report.dateRange}</p>
//               <span className="inline-block px-2 py-1 bg-[color:var(--accent-soft)] text-[color:var(--accent)] rounded text-xs font-medium">
//                 {reportTypeNames[report.type]}
//               </span>
//             </div>
//             <div className="flex gap-2">
//               <button onClick={() => viewReportDetails(report)} className="flex-1 flex items-center justify-center gap-2 bg-[color:var(--accent)] hover:bg-[color:var(--accent)] text-white py-2 rounded-lg font-medium transition-colors">
//                 <FileText size={16} /><span>View Report</span>
//               </button>
//               <button onClick={() => shareReport(report)} className="flex items-center justify-center bg-[#151c27] hover:bg-[color:var(--accent-soft)] text-[color:var(--accent)] border border-[color:var(--accent)] p-2 rounded-lg transition-colors">
//                 <Share2 size={16} />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {showGenerateModal && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//           <div className="bg-[#151c27] border border-[color:var(--accent)]/20 rounded-lg p-8 max-w-md w-full">
//             <h2 className="text-2xl font-bold text-[#e7f0fa] mb-6">Generate New Report</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-[#e7f0fa] mb-2">Report Type</label>
//                 <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full bg-[#0c111a] text-[#e7f0fa] border border-[color:var(--accent)]/20 rounded-lg px-4 py-2 focus:border-[color:var(--accent)] focus:outline-none">
//                   <option value="income_expense">Income vs Expense</option>
//                   <option value="tax_summary">Tax Summary</option>
//                   <option value="cashflow">Cash Flow Analysis</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-[#e7f0fa] mb-2">Start Date</label>
//                 <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-[#0c111a] text-[#e7f0fa] border border-[color:var(--accent)]/20 rounded-lg px-4 py-2 focus:border-[color:var(--accent)] focus:outline-none" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-[#e7f0fa] mb-2">End Date</label>
//                 <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-[#0c111a] text-[#e7f0fa] border border-[color:var(--accent)]/20 rounded-lg px-4 py-2 focus:border-[color:var(--accent)] focus:outline-none" />
//               </div>
//             </div>
//             <div className="flex gap-3 mt-6">
//               <button onClick={generateReport} disabled={isGenerating} className="flex-1 bg-[color:var(--accent)] hover:bg-[color:var(--accent)] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
//                 {isGenerating ? <><Loader className="animate-spin" size={18} /><span>Generating...</span></> : 'Generate'}
//               </button>
//               <button onClick={() => setShowGenerateModal(false)} disabled={isGenerating} className="px-6 bg-[#151c27] hover:bg-[color:var(--accent-soft)] text-[#e7f0fa] border border-[color:var(--accent)]/20 py-3 rounded-lg font-medium transition-colors">
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isLoadingDetails && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[color:var(--accent)]"></div>
//         </div>
//       )}
//     </div>
//   );
// };

import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Share2,
  Plus,
  Loader,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  BarChart3,
  Sparkles,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { reportsApi } from "../services/apiClient";
import { toast } from "../utils/toast";
import { useTheme } from "../contexts/ThemeContext";
import { HorizontalScroller } from "../components/ui/HorizontalScroller";

/* ===================== TYPES ===================== */

interface Report {
  id: string;
  title: string;
  generatedDate: string;
  type: string;
  dateRange: string;
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type?: string;
  taxable?: boolean;
  flowType?: string;
}

interface DetailedReport {
  reportId: string;
  type: string;
  title: string;
  dateRange: string;
  generatedDate: string;
  summary: any;
  transactions: Transaction[];
  monthlyData?: any[];
  taxBreakdown?: any[];
  weeklyData?: any[];
}

/* ===================== COMPONENT ===================== */

export const Reports: React.FC = () => {
  useTheme();

  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [reportType, setReportType] = useState("income_expense");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedReport, setSelectedReport] = useState<DetailedReport | null>(
    null
  );
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  /* ===================== DATA ===================== */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await reportsApi.getAll();
        setReports(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const reportTypeNames: Record<string, string> = {
    income_expense: "Income vs Expense",
    cashflow: "Cash Flow Summary",
    category_breakdown: "Category Breakdown",
  };

  /* ===================== HELPERS ===================== */

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));

  const isIncome = (txn: Transaction) =>
    txn.type === "income" || txn.flowType === "credit";

  /* ===================== ACTIONS ===================== */

  const generateReport = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select date range");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await reportsApi.generate(reportType, startDate, endDate);
      setReports([res.report, ...reports]);
      toast.success("Report generated successfully!");
      setShowGenerateModal(false);
      setStartDate("");
      setEndDate("");
    } catch {
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const viewReportDetails = async (report: Report) => {
    setIsLoadingDetails(true);
    try {
      const detailed = await reportsApi.getDetailedReport(report.id);
      setSelectedReport(detailed);
    } catch {
      toast.error("Failed to load report details");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const downloadReportPDF = async () => {
    if (!selectedReport) return;
    setIsDownloading(true);
    try {
      await reportsApi.downloadReportPDF(selectedReport.reportId);
      window.print();
      toast.success("Report ready for download!");
    } catch {
      toast.error("Failed to download report");
    } finally {
      setIsDownloading(false);
    }
  };

  const shareReport = (report: Report) => {
    navigator.clipboard.writeText(`https://finsure.app/reports/${report.id}`);
    toast.success("Share link copied to clipboard");
  };

  /* ===================== LOADING ===================== */

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--accent)]" />
      </div>
    );
  }

  /* ===================== PDF VIEW (UNCHANGED) ===================== */

  if (selectedReport) {
    return (
      <div className="space-y-6">
        <style>{`
          @media print {
            @page { size: A4; margin: 15mm; }
            body { background: white !important; overflow: visible !important; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            body * { visibility: hidden; }
            #pdf-content, #pdf-content * { visibility: visible; }
            /* Force-override anything the on-screen mobile-scroll wrapper
               applies, so the downloaded / printed PDF is identical
               regardless of whether the user triggers it from a phone
               or a desktop. */
            #pdf-content {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              min-width: 0 !important;
              max-width: none !important;
              margin: 0 !important;
              background: white !important;
              color: #000 !important;
            }
            .no-print { display: none !important; }
            .print-header { 
              background: linear-gradient(135deg, #0ab6ff 0%, #14e7ff 100%) !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-card {
              border: 1px solid #ddd !important;
              background: #f9f9f9 !important;
              page-break-inside: avoid;
            }
            .print-text { color: #000 !important; }
            .print-text-secondary { color: #555 !important; }
            .print-positive { color: #059669 !important; }
            .print-negative { color: #dc2626 !important; }
            .print-primary { color: #0ab6ff !important; }
            .print-border { border-color: #ddd !important; }
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
          }
        `}</style>

        <div className="flex items-center justify-between no-print mb-6">
          <button
            onClick={() => setSelectedReport(null)}
            className="flex items-center gap-2 text-[color:var(--accent)] hover:text-[color:var(--accent-hover)] transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Reports</span>
          </button>

          <button
            onClick={downloadReportPDF}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-[color:var(--accent)] hover:bg-[color:var(--accent)] text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <Loader className="animate-spin" size={18} />
                <span>Preparing...</span>
              </>
            ) : (
              <>
                <Download size={18} />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile viewing wrapper.
            The report itself MUST stay at its A4 layout width so the
            on-screen preview matches the exported PDF exactly - we just
            give it a horizontal scroller on narrow screens with the
            same chevron affordance used elsewhere in the app.
            • minWidth ensures the layout doesn't collapse on phones
              (otherwise a 360px parent would crush the FINSURE header).
            • maxWidth keeps it identical to the original A4 cap on
              desktop and on Ctrl+P print.
            • The existing @media print rules override position/width
              so neither the wrapper nor minWidth affects printing. */}
        <HorizontalScroller>
          <div
            id="pdf-content"
            className="bg-white text-black p-8 rounded-lg mx-auto"
            style={{ minWidth: "720px", maxWidth: "210mm" }}
          >
          {/* Header with FINSURE Branding */}
          <div className="print-header bg-gradient-to-r from-[#0ab6ff] to-[#14e7ff] text-white p-6 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <svg width="56" height="56" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                  <rect x="2" y="2" width="44" height="44" rx="11" fill="#ffffff" />
                  <rect x="14" y="12" width="5" height="24" rx="1.5" fill="#0c111a" />
                  <rect x="14" y="12" width="20" height="5" rx="1.5" fill="#0c111a" />
                  <rect x="14" y="22" width="14" height="4.5" rx="1.5" fill="#0c111a" />
                  <path d="M14 34 L22 28 L28 31 L36 20" stroke="#0c111a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <circle cx="36" cy="20" r="2" fill="#0c111a" />
                </svg>
                <div>
                  <h1 className="text-4xl font-bold tracking-wide mb-1">
                    FINSURE
                  </h1>
                  <p className="text-sm opacity-90">
                    Financial Management System
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-90">Report ID</div>
                <div className="font-mono text-sm">
                  {selectedReport.reportId}
                </div>
              </div>
            </div>
          </div>

          {/* Report Title */}
          <div className="mb-6 pb-4 border-b-2 print-border">
            <h2 className="text-2xl font-bold print-text mb-2">
              {selectedReport.title}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm print-text-secondary">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>Period: {selectedReport.dateRange}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText size={14} />
                <span>
                  Generated: {formatDate(selectedReport.generatedDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Income vs Expense Report - P&L view */}
          {selectedReport.type === "income_expense" && (
            <>
              {/* Headline cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  {
                    label: "Total Income",
                    value: formatCurrency(selectedReport.summary.totalIncome),
                    icon: TrendingUp,
                    className: "print-positive",
                  },
                  {
                    label: "Total Expenses",
                    value: formatCurrency(selectedReport.summary.totalExpenses),
                    icon: TrendingDown,
                    className: "print-negative",
                  },
                  {
                    label: "Net Profit / Loss",
                    value: formatCurrency(selectedReport.summary.netBalance),
                    icon: DollarSign,
                    className:
                      selectedReport.summary.netBalance >= 0
                        ? "print-positive"
                        : "print-negative",
                  },
                  {
                    label: "Savings Rate",
                    value: `${selectedReport.summary.savingsRate ?? selectedReport.summary.profitMargin ?? 0}%`,
                    icon: BarChart3,
                    className: "print-primary",
                  },
                ].map((item, i) => (
                  <div key={i} className="print-card border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <item.icon className={item.className} size={16} />
                      <span className="text-xs print-text-secondary">
                        {item.label}
                      </span>
                    </div>
                    <p className={`text-xl font-bold ${item.className}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Insights strip - averages + profitability count */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  {
                    label: "Avg Monthly Income",
                    value: formatCurrency(
                      selectedReport.summary.avgMonthlyIncome ?? 0
                    ),
                    className: "print-positive",
                  },
                  {
                    label: "Avg Monthly Expense",
                    value: formatCurrency(
                      selectedReport.summary.avgMonthlyExpense ?? 0
                    ),
                    className: "print-negative",
                  },
                  {
                    label: "Best Month",
                    value: selectedReport.summary.bestMonth
                      ? `${selectedReport.summary.bestMonth.month} · ${formatCurrency(selectedReport.summary.bestMonth.net)}`
                      : "-",
                    className: "print-positive",
                  },
                  {
                    label: "Worst Month",
                    value: selectedReport.summary.worstMonth
                      ? `${selectedReport.summary.worstMonth.month} · ${formatCurrency(selectedReport.summary.worstMonth.net)}`
                      : "-",
                    className: "print-negative",
                  },
                ].map((item, i) => (
                  <div key={i} className="print-card border rounded-lg p-3">
                    <span className="text-xs print-text-secondary block mb-1">
                      {item.label}
                    </span>
                    <p className={`text-sm font-semibold ${item.className} break-words`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Profitability summary sentence */}
              <div className="mb-6 p-3 print-card border rounded-lg">
                <p className="text-sm print-text">
                  <span className="print-positive font-semibold">
                    {selectedReport.summary.monthsProfitable ?? 0}
                  </span>{" "}
                  profitable month(s), and{" "}
                  <span className="print-negative font-semibold">
                    {selectedReport.summary.monthsInLoss ?? 0}
                  </span>{" "}
                  month(s) in loss over this period.
                </p>
              </div>

              {selectedReport.monthlyData && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold print-text mb-3">
                    Monthly Breakdown
                  </h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 print-border">
                        {["Month", "Income", "Expenses", "Net", "Result"].map(
                          (h) => (
                            <th
                              key={h}
                              className={`${
                                h === "Month" ? "text-left" : "text-right"
                              } print-text-secondary text-sm py-2 px-2`}
                            >
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedReport.monthlyData.map((m, i) => (
                        <tr key={i} className="border-b print-border">
                          <td className="py-2 px-2 print-text text-sm">
                            {m.month}
                          </td>
                          <td className="py-2 px-2 text-right print-positive text-sm font-semibold">
                            {formatCurrency(m.income)}
                          </td>
                          <td className="py-2 px-2 text-right print-negative text-sm font-semibold">
                            {formatCurrency(m.expenses)}
                          </td>
                          <td
                            className={`py-2 px-2 text-right text-sm font-bold ${
                              m.net >= 0 ? "print-positive" : "print-negative"
                            }`}
                          >
                            {m.net >= 0 ? "+" : "-"}
                            {formatCurrency(m.net)}
                          </td>
                          <td className="py-2 px-2 text-right text-sm font-medium">
                            <span
                              className={
                                m.net >= 0
                                  ? "print-positive"
                                  : "print-negative"
                              }
                            >
                              {m.net >= 0 ? "Profit" : "Loss"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Category Breakdown Report */}
          {selectedReport.type === "category_breakdown" && (() => {
            const breakdown =
              (selectedReport as any).categoryBreakdown ?? [];
            const incomeCats = breakdown
              .filter((c: any) => c.type === "income")
              .sort((a: any, b: any) => b.amount - a.amount);
            const expenseCats = breakdown
              .filter((c: any) => c.type === "expense")
              .sort((a: any, b: any) => b.amount - a.amount);

            const renderCategoryTable = (
              rows: any[],
              sideLabel: string,
              tone: "print-positive" | "print-negative"
            ) => (
              <div className="mb-6">
                <h3 className={`text-lg font-semibold ${tone} mb-3`}>
                  {sideLabel} ({rows.length})
                </h3>

                {rows.length === 0 ? (
                  <p className="text-sm print-text-secondary italic">
                    No {sideLabel.toLowerCase()} recorded in this window.
                  </p>
                ) : (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 print-border">
                        <th className="text-left print-text-secondary text-sm py-2 px-2">
                          Category
                        </th>
                        <th className="text-right print-text-secondary text-sm py-2 px-2">
                          Transactions
                        </th>
                        <th className="text-right print-text-secondary text-sm py-2 px-2">
                          Amount
                        </th>
                        <th className="text-left print-text-secondary text-sm py-2 px-2 w-[35%]">
                          Share
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((c: any, i: number) => (
                        <tr key={i} className="border-b print-border">
                          <td className="py-2 px-2 print-text text-sm font-medium">
                            {c.name}
                          </td>
                          <td className="py-2 px-2 text-right print-text-secondary text-sm">
                            {c.transactionCount}
                          </td>
                          <td
                            className={`py-2 px-2 text-right text-sm font-semibold ${tone}`}
                          >
                            {formatCurrency(c.amount)}
                          </td>
                          <td className="py-2 px-2 text-sm">
                            <div className="flex items-center gap-2">
                              <div
                                className="flex-1 h-2 rounded-full overflow-hidden"
                                style={{ background: "#e5e7eb" }}
                              >
                                <div
                                  className="h-full"
                                  style={{
                                    width: `${Math.min(c.percentage, 100)}%`,
                                    background:
                                      tone === "print-positive"
                                        ? "#059669"
                                        : "#dc2626",
                                  }}
                                />
                              </div>
                              <span className="print-text-secondary text-xs w-10 text-right">
                                {c.percentage}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            );

            return (
              <>
                {/* Summary cards - balanced 2x2: income side + expense side */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    {
                      label: "Total Income",
                      value: formatCurrency(
                        selectedReport.summary.totalIncome
                      ),
                      icon: TrendingUp,
                      className: "print-positive",
                    },
                    {
                      label: "Top Income Category",
                      value: `${selectedReport.summary.topIncomeCategory} · ${formatCurrency(
                        selectedReport.summary.topIncomeAmount || 0
                      )}`,
                      icon: BarChart3,
                      className: "print-positive",
                    },
                    {
                      label: "Total Expenses",
                      value: formatCurrency(
                        selectedReport.summary.totalExpenses
                      ),
                      icon: TrendingDown,
                      className: "print-negative",
                    },
                    {
                      label: "Top Expense Category",
                      value: `${selectedReport.summary.topExpenseCategory} · ${formatCurrency(
                        selectedReport.summary.topExpenseAmount || 0
                      )}`,
                      icon: BarChart3,
                      className: "print-negative",
                    },
                  ].map((item, i) => (
                    <div key={i} className="print-card border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <item.icon className={item.className} size={16} />
                        <span className="text-xs print-text-secondary">
                          {item.label}
                        </span>
                      </div>
                      <p
                        className={`text-sm font-bold ${item.className} break-words`}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {renderCategoryTable(
                  incomeCats,
                  "Income Categories",
                  "print-positive"
                )}

                {renderCategoryTable(
                  expenseCats,
                  "Expense Categories",
                  "print-negative"
                )}
              </>
            );
          })()}

          {/* Cash Flow Report - liquidity story */}
          {selectedReport.type === "cashflow" && (
            <>
              {/* Balance journey: Opening → Change → Closing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-stretch">
                <div className="print-card border rounded-lg p-4">
                  <span className="text-xs print-text-secondary block mb-1">
                    Opening Balance
                  </span>
                  <p className="text-2xl font-bold print-text">
                    {formatCurrency(selectedReport.summary.openingBalance)}
                  </p>
                  <p className="text-xs print-text-secondary mt-1">
                    What you had coming in
                  </p>
                </div>

                <div className="print-card border rounded-lg p-4">
                  <span className="text-xs print-text-secondary block mb-1">
                    Net Cash Change
                  </span>
                  <p
                    className={`text-2xl font-bold ${
                      (selectedReport.summary.netCashChange ?? 0) >= 0
                        ? "print-positive"
                        : "print-negative"
                    }`}
                  >
                    {(selectedReport.summary.netCashChange ?? 0) >= 0 ? "+" : "-"}
                    {formatCurrency(selectedReport.summary.netCashChange ?? 0)}
                  </p>
                  <p className="text-xs print-text-secondary mt-1">
                    Inflows minus outflows
                  </p>
                </div>

                <div className="print-card border rounded-lg p-4">
                  <span className="text-xs print-text-secondary block mb-1">
                    Closing Balance
                  </span>
                  <p className="text-2xl font-bold print-primary">
                    {formatCurrency(selectedReport.summary.closingBalance)}
                  </p>
                  <p className="text-xs print-text-secondary mt-1">
                    What you ended up with
                  </p>
                </div>
              </div>

              {/* Flow totals + extremes */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  {
                    label: "Total Inflows",
                    value: formatCurrency(selectedReport.summary.totalInflows),
                    icon: TrendingUp,
                    className: "print-positive",
                  },
                  {
                    label: "Total Outflows",
                    value: formatCurrency(selectedReport.summary.totalOutflows),
                    icon: TrendingDown,
                    className: "print-negative",
                  },
                  {
                    label: "Largest Single Inflow",
                    value: selectedReport.summary.largestInflow
                      ? `${formatCurrency(selectedReport.summary.largestInflow.amount)} · ${selectedReport.summary.largestInflow.date}`
                      : "-",
                    icon: TrendingUp,
                    className: "print-positive",
                  },
                  {
                    label: "Largest Single Outflow",
                    value: selectedReport.summary.largestOutflow
                      ? `${formatCurrency(selectedReport.summary.largestOutflow.amount)} · ${selectedReport.summary.largestOutflow.date}`
                      : "-",
                    icon: TrendingDown,
                    className: "print-negative",
                  },
                ].map((item, i) => (
                  <div key={i} className="print-card border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <item.icon className={item.className} size={16} />
                      <span className="text-xs print-text-secondary">
                        {item.label}
                      </span>
                    </div>
                    <p
                      className={`text-sm font-bold ${item.className} break-words`}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {selectedReport.weeklyData && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold print-text mb-3">
                    Week-by-Week Cash Position
                  </h3>
                  <p className="text-xs print-text-secondary mb-3">
                    Running balance carries your opening balance forward, then
                    updates each week as money moves in and out.
                  </p>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 print-border">
                        {["Week", "Inflow", "Outflow", "Net", "Running Balance"].map(
                          (h) => (
                            <th
                              key={h}
                              className={`${
                                h === "Week" ? "text-left" : "text-right"
                              } print-text-secondary text-sm py-2 px-2`}
                            >
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedReport.weeklyData.slice(0, 20).map((w: any, i: number) => (
                        <tr key={i} className="border-b print-border">
                          <td className="py-2 px-2 print-text text-sm">
                            {w.week}
                          </td>
                          <td className="py-2 px-2 text-right print-positive text-sm font-semibold">
                            {formatCurrency(w.inflow)}
                          </td>
                          <td className="py-2 px-2 text-right print-negative text-sm font-semibold">
                            {formatCurrency(w.outflow)}
                          </td>
                          <td
                            className={`py-2 px-2 text-right text-sm font-bold ${
                              w.net >= 0 ? "print-positive" : "print-negative"
                            }`}
                          >
                            {w.net >= 0 ? "+" : "-"}
                            {formatCurrency(w.net)}
                          </td>
                          <td
                            className={`py-2 px-2 text-right text-sm font-bold ${
                              (w.runningBalance ?? 0) >= 0
                                ? "print-primary"
                                : "print-negative"
                            }`}
                          >
                            {formatCurrency(w.runningBalance ?? 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Transactions Table */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold print-text mb-3">
              Detailed Transactions
            </h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 print-border">
                  <th className="text-left print-text-secondary text-sm py-2 px-2">
                    Date
                  </th>
                  <th className="text-right print-text-secondary text-sm py-2 px-2">
                    Amount
                  </th>
                  <th className="text-right print-text-secondary text-sm py-2 px-2">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedReport.transactions.map((txn) => {
                  const income = isIncome(txn);

                  return (
                    <tr key={txn.id} className="border-b print-border">
                      <td className="py-2 px-2 print-text text-sm">
                        {formatDate(txn.date)}
                      </td>

                      <td
                        className={`py-2 px-2 text-right font-semibold text-sm ${
                          income ? "print-positive" : "print-negative"
                        }`}
                      >
                        {income ? "+" : "-"}
                        {formatCurrency(txn.amount)}
                      </td>

                      <td className="py-2 px-2 text-right text-sm print-text-secondary capitalize">
                        {income ? "Income" : "Expense"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t-2 print-border text-center">
            <p className="text-xs print-text-secondary mb-1">
              Generated by{" "}
              <span className="font-bold text-[color:var(--accent)]">FINSURE</span>{" "}
              Financial Management System
            </p>
            <p className="text-xs print-text-secondary">
              This report is confidential and intended for authorized use only.
            </p>
            <p className="text-xs print-text-secondary mt-2">
              www.finsure.app | support@finsure.com
            </p>
          </div>
          </div>
        </HorizontalScroller>
      </div>
    );
  }

  /* ===================== LIST VIEW ===================== */

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
            {reports.length} {reports.length === 1 ? "report" : "reports"} generated
          </motion.div>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            Generated reports
          </h1>
          <p className="mt-1 text-[var(--text-secondary)]">
            Browse, share, and export income, tax and cash flow statements.
          </p>
        </div>

        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowGenerateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm shadow-[0_10px_30px_-10px_var(--accent-glow)] self-start"
          style={{
            background:
              "linear-gradient(135deg, var(--accent), var(--accent-hover))",
          }}
        >
          <Plus size={16} />
          Generate report
        </motion.button>
      </div>

      {/* Empty state */}
      {reports.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-12 flex flex-col items-center justify-center text-center"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--accent) 25%, transparent) 0%, transparent 65%)",
            }}
          />
          <div
            className="relative w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-5 shadow-[0_10px_30px_-10px_var(--accent-glow)]"
            style={{
              background:
                "linear-gradient(135deg, var(--accent), var(--accent-hover))",
            }}
          >
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="relative text-[var(--text-primary)] text-xl font-semibold mb-2">
            No reports yet
          </h3>
          <p className="relative text-[var(--text-secondary)] max-w-md mb-6">
            Once you have transactions, generate income, tax and cash flow
            reports in seconds.
          </p>
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowGenerateModal(true)}
            className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm shadow-[0_10px_30px_-10px_var(--accent-glow)]"
            style={{
              background:
                "linear-gradient(135deg, var(--accent), var(--accent-hover))",
            }}
          >
            <Plus className="w-4 h-4" />
            Generate your first report
          </motion.button>
        </motion.div>
      ) : (
        /* Reports Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reports.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: Math.min(i * 0.04, 0.3) }}
              whileHover={{ y: -3 }}
              className="group relative overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[color:var(--accent)]/60 hover:shadow-[0_20px_40px_-24px_var(--accent-glow)] rounded-2xl p-5 transition-all"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-14 -right-14 w-40 h-40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background:
                    "radial-gradient(circle, color-mix(in srgb, var(--accent) 25%, transparent) 0%, transparent 65%)",
                }}
              />
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-[color:var(--accent-soft)] border border-[color:var(--accent-ring)] flex items-center justify-center mb-3">
                  <FileText className="text-[color:var(--accent)]" size={20} />
                </div>

                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2 line-clamp-2">
                  {report.title}
                </h3>

                <div className="space-y-1.5 mb-4 text-xs text-[var(--text-secondary)]">
                  <p className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    Generated {formatDate(report.generatedDate)}
                  </p>
                  <p className="truncate">Period: {report.dateRange}</p>
                </div>

                <span className="inline-block px-2.5 py-1 rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent)] border border-[color:var(--accent-ring)] text-[11px] font-medium mb-4">
                  {reportTypeNames[report.type]}
                </span>

                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => viewReportDetails(report)}
                    className="flex-1 inline-flex items-center justify-center gap-2 text-white text-sm font-medium py-2 rounded-xl shadow-[0_8px_24px_-12px_var(--accent-glow)]"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                    }}
                  >
                    <FileText size={14} />
                    View
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => shareReport(report)}
                    aria-label="Copy share link"
                    className="inline-flex items-center justify-center bg-[var(--bg-primary)] hover:bg-[color:var(--accent-soft)] text-[color:var(--accent)] border border-[var(--border-color)] hover:border-[color:var(--accent)]/60 p-2 rounded-xl transition-colors"
                  >
                    <Share2 size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Generate Modal */}
      <AnimatePresence>
        {showGenerateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowGenerateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="relative bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 max-w-md w-full shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowGenerateModal(false)}
                aria-label="Close"
                className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-[0_10px_30px_-10px_var(--accent-glow)]"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                  }}
                >
                  <FileText size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    Generate new report
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Pick a type and date range.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                    Report type
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-sm focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:outline-none"
                  >
                    <option value="income_expense">Income vs Expense</option>
                    <option value="cashflow">Cash Flow Summary</option>
                    <option value="category_breakdown">Category Breakdown</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                      Start date
                    </label>
                    <input
                      type={startDate ? "date" : "text"}
                      value={startDate}
                      placeholder="YYYY-MM-DD"
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => {
                        if (!e.target.value) e.target.type = "text";
                      }}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-sm focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:outline-none placeholder:text-[var(--text-secondary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                      End date
                    </label>
                    <input
                      type={endDate ? "date" : "text"}
                      value={endDate}
                      placeholder="YYYY-MM-DD"
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => {
                        if (!e.target.value) e.target.type = "text";
                      }}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-sm focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:outline-none placeholder:text-[var(--text-secondary)]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={generateReport}
                  disabled={isGenerating}
                  className="flex-1 inline-flex items-center justify-center gap-2 text-white text-sm font-medium py-2.5 rounded-xl shadow-[0_10px_30px_-10px_var(--accent-glow)] disabled:opacity-60"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                  }}
                >
                  {isGenerating ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Generate
                    </>
                  )}
                </motion.button>
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="px-5 bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[color:var(--accent)]/60 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoadingDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[color:var(--accent)]" />
        </div>
      )}
    </div>
  );
};
