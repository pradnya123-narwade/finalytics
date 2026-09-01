import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Check,
  ChevronRight,
  Download,
  Filter,
  LayoutDashboard,
  MoreHorizontal,
  Package,
  RefreshCw,
  Search,
  Sparkles,
  Zap,
  AlertTriangle,
  Send,
  FileSpreadsheet,
  Upload,
  Users,
  TrendingUp,
  BrainCircuit,
  PieChart,
  HelpCircle,
  BookOpen,
  Layers,
  CheckCircle2,
  Printer,
  ArrowRight,
} from "lucide-react";
import { useBusiness, Transaction, ReconciliationIssue, InventoryItem, Customer } from "@/contexts/BusinessContext";

function OfficeKitReportCard({ report }: { report: any }) {
  const { reorderProduct } = useBusiness();
  const [activeReportTab, setActiveReportTab] = useState<"insights" | "recommendations" | "breakdown">("insights");

  if (!report) return null;

  return (
    <div className="p-4 rounded-xl border-2 border-lime-400/40 bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 text-white shadow-xl space-y-4 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-800/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-lime-400 text-purple-950 shadow">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <strong className="text-base font-bold text-lime-300">Office Kit Generated Financial Report & Intelligence</strong>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-lime-400/20 text-lime-300 border border-lime-400/30 flex items-center gap-1">
                <CheckCircle2 size={11} /> LIVE VERIFIED
              </span>
            </div>
            <p className="text-xs text-purple-200">
              Transported via Office Kit at {report.generatedAt} · Ingested {report.salesCount + report.purchasesCount} transaction records
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            window.print();
            toast.success("Printing Report... 🖨️");
          }}
          className="px-3 py-1.5 rounded-lg bg-purple-900/80 hover:bg-purple-800 text-purple-200 text-xs font-semibold flex items-center gap-1 border border-purple-700/50"
        >
          <Printer size={13} /> Print Audit Report
        </button>
      </div>

      {/* Metric Highlights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-purple-900/40 border border-purple-800/40">
          <span className="text-[10px] text-purple-300 font-semibold block uppercase">Batch Revenue</span>
          <strong className="text-lg font-bold text-lime-300">₹{report.totalRevenue.toLocaleString()}</strong>
          <span className="text-[10px] text-purple-200 block font-mono">{report.salesCount} Sales Logged</span>
        </div>

        <div className="p-3 rounded-lg bg-purple-900/40 border border-purple-800/40">
          <span className="text-[10px] text-purple-300 font-semibold block uppercase">Estimated Gross Profit</span>
          <strong className="text-lg font-bold text-emerald-300">₹{report.grossProfit.toLocaleString()}</strong>
          <span className="text-[10px] text-purple-200 block font-mono">{report.profitMarginPct}% Net Margin</span>
        </div>

        <div className="p-3 rounded-lg bg-purple-900/40 border border-purple-800/40">
          <span className="text-[10px] text-purple-300 font-semibold block uppercase">Payment Inflows Mix</span>
          <div className="text-[11px] font-mono text-purple-100 flex flex-col gap-0.5 mt-0.5">
            <span>UPI: <strong className="text-teal-300">₹{report.upiTotal.toLocaleString()}</strong></span>
            <span>Cash: <strong className="text-lime-300">₹{report.cashTotal.toLocaleString()}</strong></span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-purple-900/40 border border-purple-800/40">
          <span className="text-[10px] text-purple-300 font-semibold block uppercase">Reconciliation Score</span>
          <strong className="text-lg font-bold text-cyan-300">{report.reconciliationScorePct}% Matched</strong>
          <span className="text-[10px] text-purple-200 block font-mono">SQLite Master Audited</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 border-b border-purple-800/60 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveReportTab("insights")}
          className={`px-3 py-1 rounded-md transition-colors ${activeReportTab === "insights" ? "bg-lime-400 text-purple-950 font-bold" : "text-purple-300 hover:text-white"}`}
        >
          Dynamic AI Insights ({report.insights.length})
        </button>
        <button
          onClick={() => setActiveReportTab("recommendations")}
          className={`px-3 py-1 rounded-md transition-colors ${activeReportTab === "recommendations" ? "bg-lime-400 text-purple-950 font-bold" : "text-purple-300 hover:text-white"}`}
        >
          Actionable Recommendations ({report.recommendations.length})
        </button>
        <button
          onClick={() => setActiveReportTab("breakdown")}
          className={`px-3 py-1 rounded-md transition-colors ${activeReportTab === "breakdown" ? "bg-lime-400 text-purple-950 font-bold" : "text-purple-300 hover:text-white"}`}
        >
          Category Velocity & Share
        </button>
      </div>

      {/* Tab 1: Dynamic AI Insights */}
      {activeReportTab === "insights" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {report.insights.map((ins: any, i: number) => (
            <div key={i} className="p-3 rounded-lg bg-purple-900/60 border border-purple-700/50 space-y-1.5">
              <strong className="text-xs font-bold text-lime-300 block">{ins.title}</strong>
              <p className="text-[11px] text-purple-200 leading-snug">{ins.description}</p>
              <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-purple-300 border-t border-purple-800/50">
                <span>Impact:</span>
                <span className="font-bold text-lime-400">{ins.impact}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Actionable Recommendations */}
      {activeReportTab === "recommendations" && (
        <div className="space-y-2">
          {report.recommendations.map((rec: any, idx: number) => (
            <div key={idx} className="p-3 rounded-lg bg-purple-900/60 border border-purple-700/50 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5 flex-1 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${rec.priority === "High" ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" : "bg-amber-500/20 text-amber-300 border border-amber-500/40"}`}>
                    {rec.priority} Priority
                  </span>
                  <span className="text-[10px] text-purple-300 font-mono">[{rec.category}]</span>
                  <strong className="text-lime-300 font-bold">{rec.action}</strong>
                </div>
                <p className="text-[11px] text-purple-200">{rec.reason}</p>
              </div>

              <button
                onClick={() => {
                  if (rec.category === "Inventory") {
                    reorderProduct("p-paper");
                    toast.success("Inventory Order Placed 📦", { description: "Reordered 50 rims of A4 Paper 75gsm" });
                  } else if (rec.category === "Udhaar Credit") {
                    toast.success("WhatsApp Payment Alert Sent 📱", { description: "Sent credit reminder for Vidya Coaching Institute" });
                  } else {
                    toast.success("Price Recommendation Saved 🏷️", { description: "Retail tag set to ₹315" });
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-purple-950 font-bold text-[11px] flex items-center gap-1 shadow flex-shrink-0"
              >
                Execute Action <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Category Velocity & Share */}
      {activeReportTab === "breakdown" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {report.categoryBreakdown.map((cat: any, idx: number) => (
              <div key={idx} className="p-3 rounded-lg bg-purple-900/60 border border-purple-700/50 space-y-1">
                <div className="flex justify-between text-xs text-purple-200">
                  <strong className="text-lime-300">{cat.category}</strong>
                  <span className="font-mono font-bold">{cat.percentage}%</span>
                </div>
                <strong className="text-sm text-white font-mono block">₹{cat.amount.toLocaleString()}</strong>
                <div className="w-full h-1.5 bg-purple-950 rounded-full overflow-hidden">
                  <div className="h-full bg-lime-400 rounded-full transition-all duration-500" style={{ width: `${cat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  delta,
  detail,
  positive = true,
  highlight = false,
}: {
  label: string;
  value: string;
  delta: string;
  detail: string;
  positive?: boolean;
  highlight?: boolean;
}) {
  return (
    <article className={`metric-card lift-in ${highlight ? "metric-highlight" : ""}`}>
      <div className="metric-top">
        <span>{label}</span>
        <span className={positive ? "delta positive" : "delta warning"}>
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {delta}
        </span>
      </div>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

function SyncPill({ compact = false, synced, onToggle }: { compact?: boolean; synced: boolean; onToggle: () => void }) {
  return (
    <button className={compact ? "sync-pill compact" : "sync-pill"} onClick={onToggle} aria-label="Toggle live sync state">
      <span className={synced ? "sync-dot live" : "sync-dot offline"}></span>
      <span>{synced ? "Office Kit Synced" : "Offline Mode"}</span>
      {!compact && <ChevronRight size={14} />}
    </button>
  );
}

export default function WebCommandCenter() {
  const {
    synced,
    toggleSync,
    transactions,
    customers,
    suppliers,
    inventory,
    reconciliationIssues,
    aiInsights,
    todayRevenue,
    todaySalesCount,
    grossProfit,
    stockValue,
    totalUdhaarOutstanding,
    pushAlertToPhone,
    resolveReconciliation,
    reorderProduct,
    sendDailyBriefToPhone,
    demoStep,
    advanceDemoStep,
    resetDemo,
    importCSVData,
    dayLedgerBatch,
    isDraggingDayBatch,
    transferDayBatchToPC,
    lastGeneratedReport,
  } = useBusiness();

  const [activeTab, setActiveTab] = useState<"overview" | "reconciliation" | "ledger" | "commerce" | "customers" | "ai">("overview");
  const [query, setQuery] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  const filteredTransactions = useMemo(
    () => transactions.filter((t) => `${t.item} ${t.detail}`.toLowerCase().includes(query.toLowerCase())),
    [transactions, query]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    transferDayBatchToPC();
    toast.success("Day Ledger Batch Reconciled! ⚡", {
      description: `Imported & reconciled today's batch: ${dayLedgerBatch.totalTransactionsCount} transactions (₹${dayLedgerBatch.totalRevenue.toLocaleString()}) into Master PC SQLite Ledger.`,
    });
  };

  const exportCSVFile = () => {
    const csvHeader = "date,time,type,customer_supplier,product,quantity,amount,payment\n";
    const csvRows = transactions
      .map(
        (t) =>
          `${t.date},${t.timestamp},${t.transactionType},${t.customer || t.supplier || ""},${t.productName},${t.quantity},${t.amount},${t.paymentType}`
      )
      .join("\n");

    const blob = new Blob([csvHeader + csvRows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Finalytics_Stationery_Ledger_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Finalytics CSV Ledger Exported 📊", { description: "Compatible with Excel, Tally, & Accounting Apps." });
  };

  const handleAskAI = (q?: string) => {
    const queryText = q || aiQuestion;
    if (!queryText.trim()) return;

    if (queryText.toLowerCase().includes("profit") || queryText.toLowerCase().includes("fall") || queryText.toLowerCase().includes("margin")) {
      setAiAnswer(
        "💡 Grounded Analysis (Qwen 2.5): Stationery revenue increased by +16%, but unit profit margin dropped. Primary cause: Supplier JK Paper Wholesaler increased unit cost for A4 Paper Rims by +16.7% (₹210 → ₹245), shrinking margin from ₹70 to ₹35/rim."
      );
    } else if (queryText.toLowerCase().includes("stock") || queryText.toLowerCase().includes("buy") || queryText.toLowerCase().includes("paper")) {
      setAiAnswer(
        "💡 Grounded Forecast (Qwen 2.5): Stock Classmate 300pg Registers & JK A4 Paper Rims (+48% sales growth velocity due to exam season). Current paper rim stock is 14 units with expected demand of 30 rims. Recommended reorder: 50 rims."
      );
    } else if (queryText.toLowerCase().includes("supplier") || queryText.toLowerCase().includes("price")) {
      setAiAnswer(
        "💡 Supplier Intelligence (Qwen 2.5): JK Paper Wholesaler Corp increased paper rim cost by +16.7%. ITC Classmate and Flair Pen prices remained stable."
      );
    } else {
      setAiAnswer(
        `💡 Grounded Intelligence: Analyzed today's day ledger batch (${transactions.length} transactions across ₹${todayRevenue.toLocaleString()} revenue). Overall stationery business health is strong.`
      );
    }
  };

  // Hackathon Demo Stepper titles
  const demoStepTitles = [
    "Ready to start demo",
    "Step 1: Phone Voice / NLP Entry ('Vidya Institute 5 Classmate Register 450 cash')",
    "Step 2: Saved locally in Mobile SQLite Day Batch File",
    "Step 3: Merchant Drags Entire Day's Ledger Batch Card (Phone → PC Dropzone)",
    "Step 4: Master PC Ledger & CSV Audit Trail Auto-Updated",
    "Step 5: Local AI Analyzes Paper Velocity (+48% Paper Rims, recommend reorder)",
    "Step 6: Reconciliation Engine Flags ⚠ ₹1,000 UPI Statement Mismatch",
    "Step 7: Evidence Match Found in Phone Notes ('Vidya Institute paid ₹1,000')",
    "Step 8: Push Confirmation Alert to Merchant's Phone",
    "Step 9: Merchant Taps [CONFIRM] on Phone → Full Day Ledger & CSV Auto-Reconciled!",
  ];

  return (
    <main className="right-web-panel">
      {/* Top Header Bar */}
      <header className="topbar">
        <div className="flex items-center gap-3">
          <div className="brand brand-small flex flex-col items-start leading-none">
            <span className="font-bold text-xl text-purple-900 tracking-tight flex items-center gap-1.5">
              <BookOpen className="text-lime-500 fill-lime-500" size={20} />
              Finalytics
            </span>
            <span className="text-[11px] text-purple-500 font-semibold tracking-normal mt-1">
              Ravi Stationary Store
            </span>
          </div>
        </div>

        <div className="top-actions">
          <div className="search-trigger">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search transactions, inventory, suppliers..."
              className="bg-transparent border-0 outline-none text-xs text-purple-900 w-44"
            />
            <kbd>⌘ K</kbd>
          </div>
          <SyncPill compact synced={synced} onToggle={toggleSync} />
          <button className="icon-button notification" aria-label="Notifications">
            <Bell size={18} />
            <span></span>
          </button>
          <div className="avatar">R</div>
        </div>
      </header>

      <div className="content-wrap">
        {/* Welcome Section & View Indicator */}
        <section className="welcome-row">
          <div>
            <span className="eyebrow accent">SATURDAY · 30 AUGUST 2026</span>
            <h1>Financial Intelligence Workstation</h1>
            <p>Reconciles daily transactions, cash flow, and inventory records with Local AI.</p>
          </div>
        </section>

        {/* AUTOMATED BUSINESS OPERATIONS & RECONCILIATION TOOLBAR */}
        <div className="demo-stepper-card">
          <div className="stepper-header">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-lime-400" />
              <strong className="text-sm font-bold text-lime-300">Automated Operations & Reconciliation Assistant</strong>
              <span className="text-xs text-purple-200">
                Quick Action Controls
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  transferDayBatchToPC();
                  toast.success("Day Ledger Batch Ingested! ⚡", { description: `Synced ${dayLedgerBatch.totalTransactionsCount} transactions to Master PC Ledger.` });
                }}
                className="px-3 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-purple-950 font-bold text-xs flex items-center gap-1 shadow"
              >
                <Layers size={13} /> Ingest Day Batch
              </button>

              <button
                onClick={() => {
                  pushAlertToPhone("⚠ Reconcile Alert: UPI Mismatch", "Bank UPI statement ₹8,500 vs Day Ledger ₹7,500. Evidence found.", "reconciliation", true);
                  toast.success("Reconciliation Alert Pushed 📱", { description: "Sent mismatch notification to mobile terminal." });
                }}
                className="px-3 py-1.5 rounded-lg bg-purple-800 hover:bg-purple-700 text-lime-300 font-bold text-xs flex items-center gap-1"
              >
                <Send size={13} /> Push Alert to Phone
              </button>

              <button
                onClick={() => {
                  resolveReconciliation("rec-1");
                  toast.success("Mismatches Resolved! ⚡", { description: "Auto-updated PC Master SQLite Ledger & CSV." });
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-purple-950 font-bold text-xs flex items-center gap-1"
              >
                <Check size={13} /> Resolve Mismatches
              </button>

              <button
                onClick={() => {
                  resetDemo();
                  toast.success("State & Office Kit Batch Reset! 🔄", {
                    description: "Daily ledger batch, generated report, and mismatch issues restored to initial state.",
                  });
                }}
                className="px-2 py-1 rounded bg-purple-900 hover:bg-purple-800 text-purple-200 text-xs font-medium"
              >
                Reset State
              </button>
            </div>
          </div>

          <p className="text-xs text-lime-200 mt-1 font-mono bg-purple-950/60 p-2 rounded border border-lime-400/20">
            Current Status: <strong>{synced ? "Office Kit Active" : "Offline Mode"}</strong> · {transactions.length} Transactions in Master SQLite · {reconciliationIssues.filter(i => i.status === "pending").length} Mismatch Alerts Pending
          </p>
        </div>

        {/* DRAG & DROP OFFICE KIT DAY BATCH DROP ZONE */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`drop-zone mb-6 ${isDragOver || isDraggingDayBatch ? "active-hover" : ""}`}
        >
          <div className="flex items-center justify-center gap-3 text-purple-900">
            <Layers size={22} className="text-purple-700 animate-bounce" />
            <div className="text-left">
              <strong className="text-xs block text-purple-950 font-bold">
                Office Kit Day Ledger Batch Dropzone
              </strong>
              <span className="text-[11px] text-purple-800">
                Drag the <strong>"TODAY'S DAILY LEDGER BATCH"</strong> card from the Mobile App (Left) or drop a CSV file here to ingest and reconcile the entire day's financial records into SQLite.
              </span>
            </div>
          </div>
        </div>

        {/* OFFICE KIT GENERATED REPORT & INTELLIGENCE CARD */}
        <OfficeKitReportCard report={lastGeneratedReport} />

        {/* TAB NAVIGATION BAR */}
        <nav className="tab-nav-bar" aria-label="Workstation Tabs">
          <button
            onClick={() => setActiveTab("overview")}
            className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          >
            <LayoutDashboard size={16} /> Overview & Metrics
          </button>

          <button
            onClick={() => setActiveTab("reconciliation")}
            className={`tab-btn ${activeTab === "reconciliation" ? "active" : ""}`}
          >
            <RefreshCw size={16} /> Reconciliation Engine
            {reconciliationIssues.filter((i) => i.status === "pending").length > 0 && (
              <span className="tab-badge">{reconciliationIssues.filter((i) => i.status === "pending").length}</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("ledger")}
            className={`tab-btn ${activeTab === "ledger" ? "active" : ""}`}
          >
            <FileSpreadsheet size={16} /> CSV / Excel Day Ledger
          </button>

          <button
            onClick={() => setActiveTab("commerce")}
            className={`tab-btn ${activeTab === "commerce" ? "active" : ""}`}
          >
            <TrendingUp size={16} /> Commerce & Basket Intelligence
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className={`tab-btn ${activeTab === "customers" ? "active" : ""}`}
          >
            <Users size={16} /> Customer & Udhaar
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`tab-btn ${activeTab === "ai" ? "active" : ""}`}
          >
            <BrainCircuit size={16} /> Local AI Engine (Qwen)
          </button>
        </nav>

        {/* ================= TAB 1: OVERVIEW & DASHBOARD ================= */}
        {activeTab === "overview" && (
          <section className="space-y-4">
            <div className="metrics-grid">
              <MetricCard
                label="Today’s Stationery Revenue"
                value={`₹${todayRevenue.toLocaleString()}`}
                delta="16.4%"
                detail={`${todaySalesCount} sales in day batch`}
                highlight
              />
              <MetricCard
                label="Estimated Gross Profit"
                value={`₹${grossProfit.toLocaleString()}`}
                delta="5.2%"
                detail="29.4% net margin"
              />
              <MetricCard
                label="Stationery Stock Value"
                value={`₹${stockValue.toLocaleString()}`}
                delta="3.1%"
                detail={`${inventory.filter((i) => i.stock <= i.reorderLevel).length} items need reorder`}
                positive={inventory.every((i) => i.stock > i.reorderLevel)}
              />
            </div>

            {/* Inflows Breakdown */}
            <div className="p-4 rounded-xl border border-purple-200 bg-white/80 shadow-sm flex flex-wrap gap-4 items-center justify-between">
              <span className="text-xs font-bold text-purple-950 flex items-center gap-2">
                <PieChart size={16} className="text-lime-600" /> Day Batch Inflows Breakdown:
              </span>
              <div className="flex gap-4 text-xs font-mono">
                <span className="font-semibold text-teal-800">UPI: ₹{dayLedgerBatch.upiTotal.toLocaleString()}</span>
                <span className="font-semibold text-lime-800">Cash: ₹{dayLedgerBatch.cashTotal.toLocaleString()}</span>
                <span className="font-semibold text-rose-700">Udhaar Credit: ₹{totalUdhaarOutstanding.toLocaleString()}</span>
              </div>
            </div>

            {/* Chart & Live Ledger */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 chart-card">
                <div className="chart-heading">
                  <div>
                    <span className="eyebrow">STATIONERY SALES FLOW</span>
                    <h3>Saturday Sales Revenue</h3>
                  </div>
                  <div className="chart-legend">
                    <span>
                      <i className="legend-dot teal"></i>Live Today
                    </span>
                    <span>
                      <i className="legend-dot muted"></i>Usual Saturday
                    </span>
                  </div>
                </div>
                <div className="chart-wrap">
                  <svg viewBox="0 0 720 220" role="img" aria-label="Sales flow chart">
                    <defs>
                      <linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#d8ff3e" stopOpacity=".35" />
                        <stop offset="100%" stopColor="#d8ff3e" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path className="usual-line" d="M0 145 C80 132 90 156 178 128 S295 152 365 121 S486 143 548 111 S650 136 720 104" />
                    <path className="sales-area" d="M0 192 C70 182 94 169 155 179 S235 142 302 157 S390 117 455 141 S540 83 603 102 S675 67 720 77 L720 220 L0 220 Z" />
                    <path className="sales-line" d="M0 192 C70 182 94 169 155 179 S235 142 302 157 S390 117 455 141 S540 83 603 102 S675 67 720 77" />
                    <circle cx="720" cy="77" r="5" className="chart-end" />
                  </svg>
                  <div className="chart-x">
                    <span>8 AM</span>
                    <span>10 AM</span>
                    <span>12 PM</span>
                    <span>2 PM</span>
                    <span>4 PM</span>
                    <span>6 PM</span>
                    <span>Now</span>
                  </div>
                </div>
              </div>

              {/* Dynamic AI Insights */}
              <div className="space-y-3">
                {aiInsights.map((insight) => (
                  <div className="insight-card lead-insight" key={insight.id}>
                    <div className="insight-header">
                      <div className="insight-icon">
                        <Sparkles size={17} />
                      </div>
                      <span className="eyebrow">{insight.tag}</span>
                    </div>
                    <h3>{insight.title}</h3>
                    <div className="triad">
                      <div>
                        <span>What</span>
                        <p>{insight.what}</p>
                      </div>
                      <div>
                        <span>Why</span>
                        <p>{insight.why}</p>
                      </div>
                      <div>
                        <span>Next</span>
                        <p>{insight.next}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Ledger Stream */}
            <div className="table-card">
              <div className="section-heading compact-heading">
                <div>
                  <span className="eyebrow">MASTER PC DAY LEDGER BATCH</span>
                  <h3>Today's Ingested Records ({transactions.length})</h3>
                </div>
                <button onClick={exportCSVFile} className="more-link">
                  Export CSV <Download size={14} />
                </button>
              </div>

              <div className="transaction-list">
                {filteredTransactions.map((t) => (
                  <div className={`transaction-row ${t.isNewSync ? "row-highlight" : ""}`} key={t.id}>
                    <div className={`transaction-symbol ${t.tone}`}>{t.productName.charAt(0)}</div>
                    <div>
                      <strong>{t.item}</strong>
                      <span>{t.detail}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono">
                      Source: {t.source}
                    </span>
                    {t.isNewSync && <span className="sync-badge">DAY BATCH SYNC</span>}
                    <strong className="amount">{t.amountFormatted}</strong>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ================= TAB 2: RECONCILIATION ENGINE ================= */}
        {activeTab === "reconciliation" && (
          <section className="space-y-4">
            <div className="p-4 rounded-xl border border-purple-200 bg-white/80 shadow-sm flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-purple-950 flex items-center gap-2">
                  <RefreshCw size={20} className="text-lime-600" /> Day Batch Financial Reconciliation Engine
                </h2>
                <p className="text-xs text-gray-600">
                  Cross-checks bank statements, mobile day batch entries, phone notes, cash drawer count, and paper inventory.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                {reconciliationIssues.filter((i) => i.status === "pending").length} Mismatches Flagged
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reconciliationIssues.map((issue: ReconciliationIssue) => {
                const isResolved = issue.status === "resolved";
                return (
                  <div
                    key={issue.id}
                    className={`p-4 rounded-xl border shadow-sm space-y-3 transition-all ${
                      isResolved ? "border-emerald-200 bg-emerald-50/60" : "border-rose-200 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${isResolved ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                          {isResolved ? <Check size={18} /> : <AlertTriangle size={18} />}
                        </div>
                        <div>
                          <strong className="text-sm font-bold text-purple-950 block">{issue.title}</strong>
                          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                            Type: {issue.type.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isResolved ? "bg-emerald-200 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                        {isResolved ? "RESOLVED" : "MISMATCH"}
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed">{issue.description}</p>

                    <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-gray-50 text-[11px] font-mono border border-gray-100">
                      <div>
                        <span className="text-[9px] text-gray-500 block">Expected</span>
                        <strong>{issue.expectedAmount}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-500 block">Recorded</span>
                        <strong>{issue.recordedAmount}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-500 block">Difference</span>
                        <strong className="text-rose-600">{issue.difference}</strong>
                      </div>
                    </div>

                    {issue.evidenceNote && (
                      <div className="p-2 rounded bg-purple-50 text-[11px] text-purple-900 border border-purple-100 flex items-center gap-2">
                        <Sparkles size={14} className="text-purple-600 flex-shrink-0" />
                        <span><strong>Phone Note Evidence:</strong> {issue.evidenceNote}</span>
                      </div>
                    )}

                    {!isResolved && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => {
                            resolveReconciliation(issue.id);
                            toast.success("Reconciled! ⚡", { description: "PC Day Batch & CSV updated." });
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-purple-900 hover:bg-purple-800 text-lime-300 font-bold text-xs flex items-center justify-center gap-1"
                        >
                          <Check size={14} /> Resolve & Auto-Update Day Batch
                        </button>
                        <button
                          onClick={() => {
                            pushAlertToPhone(`Reconciliation Alert: ${issue.title}`, issue.description, "reconciliation", true);
                            toast.success("Sent to Phone 📱", { description: "Reconciliation alert pushed to mobile app." });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-950 font-bold text-xs"
                        >
                          Push to Phone
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ================= TAB 3: CSV / EXCEL LEDGER ================= */}
        {activeTab === "ledger" && (
          <section className="space-y-4">
            <div className="p-4 rounded-xl border border-purple-200 bg-white/80 shadow-sm flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-purple-950 flex items-center gap-2">
                  <FileSpreadsheet size={20} className="text-lime-600" /> Automatic CSV / Excel Day Ledger
                </h2>
                <p className="text-xs text-gray-600">
                  Every transferred day batch is structured into standard CSV columns (`date, time, type, customer_supplier, product, quantity, amount, payment`).
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const sampleCSV = `date,time,type,customer_supplier,product,quantity,amount,payment\n2026-08-30,12:15,sale,Vidya Institute,Classmate Register,5,450,Cash`;
                    importCSVData(sampleCSV);
                    toast.success("CSV Imported! 📊", { description: "Parsed 1 transaction into day batch." });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-950 font-bold text-xs flex items-center gap-1"
                >
                  <Upload size={14} /> Import CSV
                </button>

                <button
                  onClick={exportCSVFile}
                  className="px-3 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-purple-950 font-bold text-xs flex items-center gap-1 shadow"
                >
                  <Download size={14} /> Export CSV / Excel
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-purple-950 text-lime-300 font-mono text-[11px]">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Customer / Supplier</th>
                    <th className="p-3">Product</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-purple-50/50">
                      <td className="p-3 text-gray-500">{t.date}</td>
                      <td className="p-3 text-gray-500">{t.timestamp}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${t.transactionType === "purchase" ? "bg-purple-100 text-purple-800" : "bg-emerald-100 text-emerald-800"}`}>
                          {t.transactionType.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-purple-950">{t.customer || t.supplier || "Walk-in Student"}</td>
                      <td className="p-3 text-gray-800">{t.productName}</td>
                      <td className="p-3 text-gray-700">{t.quantity}</td>
                      <td className="p-3 font-bold text-purple-950">{t.amountFormatted}</td>
                      <td className="p-3 text-gray-700">{t.paymentType}</td>
                      <td className="p-3 text-gray-400 text-[10px]">{t.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ================= TAB 4: COMMERCE INTELLIGENCE ================= */}
        {activeTab === "commerce" && (
          <section className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Basket Analysis */}
              <div className="p-4 rounded-xl border border-purple-200 bg-white shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2">
                  <Sparkles size={16} className="text-lime-600" /> Product Basket Analysis (Frequently Bought Together)
                </h3>
                <div className="p-3 rounded-lg bg-purple-50 border border-purple-100 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <strong className="text-purple-950">Classmate Register 300pg + Flair Gel Pen Box</strong>
                    <span className="px-2 py-0.5 rounded bg-lime-400 text-purple-950 font-bold text-[10px]">
                      52 Purchases
                    </span>
                  </div>
                  <p className="text-gray-700 text-[11px]">
                    AI Insight: Coaching students purchasing registers during exam season buy gel pens 74% of the time.
                  </p>
                  <div className="pt-2 border-t border-purple-200 text-purple-900 font-semibold text-[11px]">
                    💡 Recommendation: Create an "Exam Preparation Kit" combo (Notebook + Pen Box) for ₹200.
                  </div>
                </div>
              </div>

              {/* Supplier Price Intelligence */}
              <div className="p-4 rounded-xl border border-purple-200 bg-white shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2">
                  <TrendingUp size={16} className="text-rose-600" /> Supplier Price Intelligence & Paper Squeeze
                </h3>
                {suppliers.map((s) => (
                  <div key={s.id} className="p-3 rounded-lg bg-gray-50 border border-gray-100 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <strong className="text-purple-950">{s.name} ({s.product})</strong>
                      {s.priceIncreasePct > 0 && (
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[10px]">
                          +{s.priceIncreasePct}% Price Spike
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-600 pt-1">
                      <span>Cost: ₹{s.previousCost} → ₹{s.currentCost}</span>
                      <span>Margin: ₹{s.oldMargin} → <strong className="text-rose-600">₹{s.newMargin}/unit</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory Velocity Table */}
            <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-purple-950">Stationery Stock Velocity & Reorder Alerts</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {inventory.map((item: InventoryItem) => {
                  const isLow = item.stock <= item.reorderLevel;
                  return (
                    <div key={item.id} className="p-3 rounded-lg border border-gray-100 bg-gray-50/70 space-y-2">
                      <div className="flex justify-between items-start">
                        <strong className="text-xs text-purple-950">{item.name}</strong>
                        <span className={`text-[10px] font-bold ${item.salesGrowthPct > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          {item.salesGrowthPct > 0 ? `+${item.salesGrowthPct}%` : `${item.salesGrowthPct}%`} velocity
                        </span>
                      </div>

                      <div className="text-[11px] text-gray-600 flex justify-between">
                        <span>Stock: <strong>{item.stock}</strong> units</span>
                        <span className={isLow ? "text-rose-600 font-bold" : ""}>
                          {isLow ? "⚠️ Low Stock" : "Healthy"}
                        </span>
                      </div>

                      <div className="stock-bar-wrap">
                        <div className={`stock-bar ${isLow ? "bar-low" : ""}`} style={{ width: `${Math.min(100, (item.stock / 50) * 100)}%` }} />
                      </div>

                      {isLow && (
                        <button
                          onClick={() => {
                            reorderProduct(item.id);
                            toast.success("Order Placed 📦", { description: `Reordered 50 units of ${item.name}` });
                          }}
                          className="w-full py-1 rounded bg-purple-900 text-lime-300 text-[10px] font-bold"
                        >
                          + Reorder 50 Rims/Units
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ================= TAB 5: CUSTOMERS & UDHAAR ================= */}
        {activeTab === "customers" && (
          <section className="space-y-4">
            <div className="p-4 rounded-xl border border-purple-200 bg-white/80 shadow-sm flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-purple-950 flex items-center gap-2">
                  <Users size={20} className="text-lime-600" /> Customer & Coaching Udhaar Credit Ledger
                </h2>
                <p className="text-xs text-gray-600">
                  Track informal credit for coaching institutes, engineering firms, students, and send WhatsApp reminder alerts.
                </p>
              </div>
              <span className="text-sm font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
                Total Udhaar: ₹{totalUdhaarOutstanding.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {customers.map((c: Customer) => (
                <div key={c.id} className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <strong className="text-sm text-purple-950 block">{c.name}</strong>
                      <span className="text-xs text-gray-500">{c.phone}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${c.outstandingUdhaar > 0 ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {c.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-gray-700 pt-2 border-t border-gray-100">
                    <div className="flex justify-between">
                      <span>Total Purchases:</span>
                      <strong>₹{c.totalPurchases.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Outstanding Udhaar:</span>
                      <strong className="text-rose-600">₹{c.outstandingUdhaar.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-400">
                      <span>Last Purchase:</span>
                      <span>{c.lastPurchase}</span>
                    </div>
                  </div>

                  {c.outstandingUdhaar > 0 && (
                    <button
                      onClick={() => {
                        toast.success(`WhatsApp Reminder Sent to ${c.name} 📱`, { description: `Notification sent for ₹${c.outstandingUdhaar} stationery balance.` });
                      }}
                      className="w-full py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-purple-950 font-bold text-xs flex items-center justify-center gap-1 shadow"
                    >
                      <Send size={12} /> Send Remind Alert to Phone
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= TAB 6: LOCAL AI ENGINE (QWEN) ================= */}
        {activeTab === "ai" && (
          <section className="space-y-4">
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-950 text-white shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-lime-300 flex items-center gap-2">
                  <BrainCircuit size={22} /> Local AI Financial Engine (Qwen 2.5)
                </h2>
                <button
                  onClick={() => {
                    sendDailyBriefToPhone();
                    toast.success("Daily Brief Sent to Phone 📱", { description: "Pushed stationery business brief to mobile app." });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-purple-950 font-bold text-xs flex items-center gap-1 shadow"
                >
                  <Send size={14} /> Send Daily Brief to Phone
                </button>
              </div>
              <p className="text-xs text-purple-200">
                100% Privacy-Preserving Offline AI. Performs financial reasoning locally over transferred day ledger batches without sending bank SMS or transaction data to external cloud APIs.
              </p>
            </div>

            {/* AI Query Console */}
            <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2">
                <HelpCircle size={16} className="text-purple-700" /> Ask Local AI "Why?" or "What paper should I stock?"
              </h3>

              <div className="flex gap-2">
                <input
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
                  placeholder="e.g. Why did my margin fall? or What paper should I stock tomorrow?"
                  className="flex-1 p-2.5 rounded-lg border border-gray-300 text-xs outline-none focus:border-purple-600"
                />
                <button
                  onClick={() => handleAskAI()}
                  className="px-4 py-2.5 rounded-lg bg-purple-900 hover:bg-purple-800 text-lime-300 font-bold text-xs flex items-center gap-1"
                >
                  <Sparkles size={14} /> Ask AI
                </button>
              </div>

              {/* Sample Question Chips */}
              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <span className="text-gray-500 font-semibold">Try sample questions:</span>
                {[
                  "Why did my margin fall?",
                  "What paper should I stock tomorrow?",
                  "Which supplier increased prices?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setAiQuestion(q);
                      handleAskAI(q);
                    }}
                    className="px-2.5 py-1 rounded-full bg-purple-50 hover:bg-lime-200 text-purple-900 font-semibold text-[11px] border border-purple-200"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* AI Answer Output Box */}
              {aiAnswer && (
                <div className="p-3.5 rounded-xl bg-purple-950 text-purple-100 text-xs font-mono border border-lime-400/40 space-y-2 animate-in fade-in">
                  <p>{aiAnswer}</p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bottom-note mt-auto">
        <span>
          <HelpCircle size={14} /> Finalytics Financial Intelligence Workstation
        </span>
        <span className="footer-divider"></span>
        <span>Mobile App (25% Left) transfers the entire Day's Ledger Batch card via Office Kit to PC (75% Right).</span>
      </footer>
    </main>
  );
}
