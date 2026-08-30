// Spennies Biz: Synchronized Phone + PC Business Intelligence System
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  Download,
  Filter,
  LayoutDashboard,
  Menu,
  Mic,
  MoreHorizontal,
  Package,
  Plus,
  ReceiptText,
  RefreshCw,
  Search,
  Settings2,
  Smartphone,
  Sparkles,
  Store,
  Zap,
  AlertTriangle,
  Send,
  X,
} from "lucide-react";
import { useBusiness, Transaction, InventoryItem, PhoneAlert } from "@/contexts/BusinessContext";

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Transactions", icon: ReceiptText },
  { label: "Products", icon: Package },
  { label: "Reconciliation", icon: RefreshCw, count: "1" },
  { label: "Reports", icon: BarChart3 },
];

function Logo({ small = false }: { small?: boolean }) {
  return (
    <div className={small ? "brand brand-small" : "brand"}>
      <img src="/manus-storage/spennies-mark_9e3a616a.png" alt="Spennies mark" />
      {!small && (
        <span>
          spennies<span className="brand-biz">biz</span>
        </span>
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

function MobileCompanion() {
  const { synced, toggleSync, transactions, phoneAlerts, dismissPhoneAlert, offlineQueue, addTransaction, parseQuickEntry } = useBusiness();
  const [entry, setEntry] = useState("");
  const [justSaved, setJustSaved] = useState<string | null>(null);

  // Real-time live parse breakdown
  const parsedPreview = useMemo(() => parseQuickEntry(entry), [entry, parseQuickEntry]);

  const handleSave = (textToSave?: string) => {
    const inputText = textToSave || entry;
    if (!inputText.trim()) return;

    const res = addTransaction(inputText);
    if (res.success && res.transaction) {
      setJustSaved(res.transaction.item);
      setEntry("");
      if (synced) {
        toast.success("Live Sync Complete! ⚡", {
          description: `Captured ${res.transaction.item} (${res.transaction.amountFormatted}) → PC Dashboard Updated`,
        });
      } else {
        toast.warning("Queued Offline", {
          description: `Saved locally. Will sync to PC when reconnected.`,
        });
      }
      setTimeout(() => setJustSaved(null), 2500);
    }
  };

  const sampleChips = [
    "5 Maggi 75 cash",
    "3 Milk 180 UPI",
    "2 Bread 80 cash",
    "1 Butter 60 UPI",
  ];

  return (
    <div className="phone-stage">
      <div className="phone-device">
        <div className="phone-notch"></div>
        <div className="phone-screen">
          {/* Top Status Bar */}
          <div className="phone-status">
            <span>9:41</span>
            <span className="status-icons">
              <Zap size={11} className={synced ? "text-lime" : "opacity-40"} />
              <span className="battery"></span>
            </span>
          </div>

          {/* Header */}
          <div className="phone-header">
            <div>
              <span className="eyebrow">SATURDAY · 30 AUG</span>
              <h3>Ravi General Store</h3>
            </div>
            <div className="avatar">R</div>
          </div>

          {/* Balance card */}
          <div className="phone-balance">
            <div>
              <span>Today’s Mobile Capture</span>
              <strong>₹{transactions.reduce((acc, t) => acc + t.amount, 0).toLocaleString()}</strong>
            </div>
            <span className="mini-up">
              <ArrowUpRight size={13} /> {transactions.length} sales
            </span>
          </div>

          {/* Quick Capture Box */}
          <div className="capture-box">
            <div className="capture-title">
              <span>
                <Sparkles size={14} /> Quick transaction entry
              </span>
              <button aria-label="Voice capture">
                <Mic size={14} />
              </button>
            </div>

            <div className="capture-input">
              <input
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                placeholder="e.g. 5 Maggi 75 cash"
              />
              <button onClick={() => handleSave()} aria-label="Save transaction">
                <Plus size={18} />
              </button>
            </div>

            {/* Smart NLP Live Parse Preview */}
            {entry.trim() && (
              <div className="parse-pill-box">
                <span className="parse-tag">Product: <strong>{parsedPreview.product}</strong></span>
                <span className="parse-tag">Qty: <strong>{parsedPreview.quantity}</strong></span>
                <span className="parse-tag">Amt: <strong>₹{parsedPreview.amount}</strong></span>
                <span className="parse-tag">Pay: <strong>{parsedPreview.paymentType}</strong></span>
              </div>
            )}

            {/* Quick Sample Action Chips */}
            <div className="quick-chips">
              <span className="chips-label">Tap quick sample:</span>
              <div className="chips-wrap">
                {sampleChips.map((chip) => (
                  <button key={chip} className="chip-btn" onClick={() => handleSave(chip)}>
                    + {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Alerts Stack (PC -> Phone Alerts) */}
          <div className="phone-section-heading">
            <span>Live Alerts ({phoneAlerts.length})</span>
            <span className="live-badge-mini">PC Synced</span>
          </div>
          {phoneAlerts.length > 0 ? (
            <div className="phone-alerts-stack">
              {phoneAlerts.map((alert: PhoneAlert) => (
                <div className={`mobile-alert ${alert.type === "low_stock" ? "alert-warning" : "alert-info"}`} key={alert.id}>
                  <div className="alert-icon">
                    {alert.type === "low_stock" ? <AlertTriangle size={15} /> : <RefreshCw size={15} />}
                  </div>
                  <div>
                    <strong>{alert.title}</strong>
                    <span>{alert.message}</span>
                  </div>
                  <button className="dismiss-btn" onClick={() => dismissPhoneAlert(alert.id)}>
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mobile-alert-empty">
              <span>No active alerts · All systems healthy</span>
            </div>
          )}

          {/* Recent Phone Ledger Capture */}
          <div className="phone-section-heading">
            <span>Recent Captures</span>
            <button>View all</button>
          </div>
          <div className="phone-tx-list">
            {transactions.slice(0, 4).map((t) => (
              <div className={`mobile-transaction ${t.isNewSync ? "tx-pulse" : ""}`} key={t.id}>
                <div className={`transaction-symbol ${t.tone}`}>{t.productName.charAt(0)}</div>
                <div>
                  <strong>{t.item}</strong>
                  <span>{t.detail}</span>
                </div>
                <strong>{t.amountFormatted}</strong>
              </div>
            ))}
          </div>

          {/* Office Kit Sync Status Banner */}
          <div className={`phone-sync-card ${synced ? "synced" : "offline"}`}>
            <div className="sync-orbit">
              <RefreshCw size={14} className={synced ? "spin-slow" : ""} />
            </div>
            <div>
              <strong>{synced ? "Office Kit Live Connected" : "Working Offline"}</strong>
              <span>{synced ? `Synced ${transactions.length} transactions` : `${offlineQueue.length} entries queued`}</span>
            </div>
            <button onClick={toggleSync}>{synced ? <Check size={15} /> : <ChevronRight size={15} />}</button>
          </div>

          {/* Phone Bottom Nav */}
          <div className="phone-nav">
            <span className="active">
              <LayoutDashboard size={16} /> Home
            </span>
            <span>
              <ReceiptText size={16} /> Ledger
            </span>
            <span className="nav-add" onClick={() => handleSave("2 Bread 80 cash")}>
              <Plus size={18} />
            </span>
            <span>
              <Package size={16} /> Stock
            </span>
            <span>
              <Sparkles size={16} /> AI
            </span>
          </div>

          {justSaved && (
            <div className="saved-toast">
              <Check size={14} /> Synced {justSaved} to PC
            </div>
          )}
        </div>
      </div>
      <div className="phone-caption">
        <Smartphone size={15} />
        <span>Shopkeeper App · Live Phone Capture</span>
      </div>
    </div>
  );
}

export default function Home() {
  const {
    synced,
    toggleSync,
    transactions,
    inventory,
    aiInsights,
    todayRevenue,
    todaySalesCount,
    grossProfit,
    stockValue,
    pushAlertToPhone,
    reorderProduct,
  } = useBusiness();

  const [active, setActive] = useState("Overview");
  const [mobileOpen, setMobileOpen] = useState(true);
  const [query, setQuery] = useState("");

  const filteredTransactions = useMemo(
    () => transactions.filter((t) => `${t.item} ${t.detail}`.toLowerCase().includes(query.toLowerCase())),
    [transactions, query]
  );

  const handlePushTestAlert = () => {
    pushAlertToPhone(
      "Reconciliation Alert",
      "₹1,000 payment from Ramesh verified on PC dashboard.",
      "reconciliation"
    );
    toast.success("Alert Sent to Phone 📱", {
      description: "Pushed reconciliation notification straight to shopkeeper app.",
    });
  };

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <Logo />
          <button className="icon-button menu-button" aria-label="Collapse navigation">
            <Menu size={19} />
          </button>
        </div>

        <div className="workspace">
          <div className="store-icon">
            <Store size={17} />
          </div>
          <div>
            <strong>Ravi General Store</strong>
            <span>Owner Workspace</span>
          </div>
          <ChevronRight size={14} />
        </div>

        <nav className="side-nav" aria-label="Main navigation">
          <span className="nav-label">Workspace</span>
          {navItems.map(({ label, icon: Icon, count }) => (
            <button
              key={label}
              className={active === label ? "side-link active" : "side-link"}
              onClick={() => {
                setActive(label);
                if (label !== "Overview") {
                  toast(`${label} View`, { description: `Active navigation for ${label}.` });
                }
              }}
            >
              <Icon size={17} />
              <span>{label}</span>
              {count && <em>{count}</em>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="kit-card">
            <div className="kit-card-top">
              <span className="eyebrow">OFFICE KIT</span>
              <span className={synced ? "kit-status" : "kit-status muted"}></span>
            </div>
            <strong>{synced ? "PC Connected & Synced" : "Waiting to Reconnect"}</strong>
            <p>{synced ? `Live stream active · ${transactions.length} sales` : "Offline mode enabled"}</p>
            <button onClick={toggleSync}>
              {synced ? "Manage connection" : "Try reconnecting"}
              <ChevronRight size={14} />
            </button>
          </div>

          <button className="side-link settings">
            <Settings2 size={17} />
            <span>Settings</span>
          </button>

          <div className="user-row">
            <div className="avatar">R</div>
            <div>
              <strong>Ravi Kumar</strong>
              <span>ravi@store</span>
            </div>
            <MoreHorizontal size={16} />
          </div>
        </div>
      </aside>

      {/* Main Command Center */}
      <main className="main-content">
        <header className="topbar">
          <div className="mobile-brand">
            <Logo small />
          </div>
          <div className="breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>{active}</strong>
          </div>
          <div className="top-actions">
            <div className="search-trigger">
              <Search size={16} />
              <span>Search sales, inventory...</span>
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
          {/* Welcome Row */}
          <section className="welcome-row">
            <div>
              <span className="eyebrow accent">SATURDAY · 30 AUGUST 2026</span>
              <h1>Good morning, Ravi.</h1>
              <p>Real-time Business Intelligence synchronized with your shopkeeper phone app.</p>
            </div>
            <div className="view-toggle">
              <button className={!mobileOpen ? "selected" : ""} onClick={() => setMobileOpen(false)}>
                <LayoutDashboard size={15} /> PC Command Only
              </button>
              <button className={mobileOpen ? "selected" : ""} onClick={() => setMobileOpen(true)}>
                <Smartphone size={15} /> Phone + PC Side-by-Side
              </button>
            </div>
          </section>

          {/* Mismatch & PC -> Phone Push Banner */}
          <div className="signal-banner">
            <div className="signal-mark">
              <Sparkles size={16} />
            </div>
            <div>
              <strong>Today is healthy. Live sync active.</strong>
              <span>Sales updated instantly as transactions are captured on phone.</span>
            </div>
            <button onClick={handlePushTestAlert}>
              <Send size={14} /> Push Test Alert to Phone <ChevronRight size={15} />
            </button>
          </div>

          {/* Live Sync Animated Bridge Indicator */}
          <div className="bridge-story">
            <div className="bridge-node">
              <Smartphone size={14} /> Phone Capture
            </div>
            <div className={synced ? "bridge-track active" : "bridge-track"}>
              <span></span>
            </div>
            <div className="bridge-node">
              <Zap size={14} /> PC Intelligence Engine
            </div>
            <span className="bridge-copy">
              {synced ? "⚡ Live Office Kit Bridge Active · Bidirectional Sync" : "Offline Local Queue"}
            </span>
          </div>

          {/* Workspace Grid: PC Dashboard Left (68%), Phone Companion Right (32%) */}
          <div className={mobileOpen ? "workspace-grid" : "workspace-grid single"}>
            <section className="dashboard-panel">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">BUSINESS PULSE</span>
                  <h2>Today’s Metrics</h2>
                </div>
                <button className="quiet-button">
                  <Download size={15} /> Export Report
                </button>
              </div>

              {/* Metrics Grid */}
              <div className="metrics-grid">
                <MetricCard
                  label="Today’s Revenue"
                  value={`₹${todayRevenue.toLocaleString()}`}
                  delta="8.4%"
                  detail={`${todaySalesCount} transactions captured`}
                  highlight
                />
                <MetricCard
                  label="Gross Profit"
                  value={`₹${grossProfit.toLocaleString()}`}
                  delta="4.8%"
                  detail="29.4% estimated net margin"
                />
                <MetricCard
                  label="Stock Value"
                  value={`₹${stockValue.toLocaleString()}`}
                  delta="2.1%"
                  detail={`${inventory.filter((i) => i.stock <= i.reorderLevel).length} items need reorder`}
                  positive={inventory.every((i) => i.stock > i.reorderLevel)}
                />
              </div>

              {/* Chart Card */}
              <div className="chart-card">
                <div className="chart-heading">
                  <div>
                    <span className="eyebrow">SALES FLOW</span>
                    <h3>Saturday Revenue Flow</h3>
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
                    <path
                      className="usual-line"
                      d="M0 145 C80 132 90 156 178 128 S295 152 365 121 S486 143 548 111 S650 136 720 104"
                    />
                    <path
                      className="sales-area"
                      d="M0 192 C70 182 94 169 155 179 S235 142 302 157 S390 117 455 141 S540 83 603 102 S675 67 720 77 L720 220 L0 220 Z"
                    />
                    <path
                      className="sales-line"
                      d="M0 192 C70 182 94 169 155 179 S235 142 302 157 S390 117 455 141 S540 83 603 102 S675 67 720 77"
                    />
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

              {/* Lower Section: Real-Time Inventory & Live Ledger */}
              <div className="lower-grid">
                {/* Real-time Ledger */}
                <div className="table-card">
                  <div className="section-heading compact-heading">
                    <div>
                      <span className="eyebrow">LIVE TRANSACTIONS</span>
                      <h3>Recent Sales Stream</h3>
                    </div>
                    <button className="more-link">
                      View full ledger <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="table-tools">
                    <div className="search-field">
                      <Search size={15} />
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search item or customer..."
                      />
                    </div>
                    <button className="filter-button">
                      <Filter size={14} /> Filter
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
                        {t.isNewSync && <span className="sync-badge">LIVE SYNC</span>}
                        <strong className="amount">{t.amountFormatted}</strong>
                        <button className="row-menu" aria-label="Transaction options">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real-time Inventory & AI Insights */}
                <div className="right-dashboard-column">
                  {/* Inventory Monitor Card */}
                  <div className="inventory-card">
                    <div className="section-heading compact-heading">
                      <div>
                        <span className="eyebrow">REAL-TIME INVENTORY</span>
                        <h3>Live Stock Level</h3>
                      </div>
                    </div>
                    <div className="inventory-list">
                      {inventory.map((item: InventoryItem) => {
                        const isLow = item.stock <= item.reorderLevel;
                        return (
                          <div className="inventory-item" key={item.id}>
                            <div className="item-info">
                              <strong>{item.name}</strong>
                              <span className={isLow ? "stock-tag low" : "stock-tag"}>
                                {item.stock} in stock {isLow && "⚠️ Low"}
                              </span>
                            </div>
                            <div className="stock-bar-wrap">
                              <div
                                className={`stock-bar ${isLow ? "bar-low" : ""}`}
                                style={{ width: `${Math.min(100, (item.stock / 100) * 100)}%` }}
                              ></div>
                            </div>
                            {isLow && (
                              <button className="reorder-btn" onClick={() => reorderProduct(item.id)}>
                                + Reorder 50
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic AI Insight Card */}
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
                      <button onClick={() => toast.success("Decision Recorded", { description: "Saved to business intelligence log." })}>
                        Save decision <ChevronRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Mobile Companion Side-by-Side */}
            {mobileOpen && <MobileCompanion />}
          </div>
        </div>

        {/* Footer */}
        <footer className="bottom-note">
          <span>
            <CircleHelp size={14} /> Spennies Biz Synchronized BI System
          </span>
          <span className="footer-divider"></span>
          <span>Phone captures transactions → Live syncs to PC → Inventory auto-deducts → PC pushes alerts back to phone.</span>
        </footer>
      </main>
    </div>
  );
}
