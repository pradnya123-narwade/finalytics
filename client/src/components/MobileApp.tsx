import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowUpRight,
  Mic,
  Plus,
  Zap,
  Check,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
  X,
  Smartphone,
  MessageSquare,
  CreditCard,
  Send,
  GripVertical,
  Volume2,
  FileText,
  BookOpen,
  Layers,
} from "lucide-react";
import { useBusiness, PhoneAlert } from "@/contexts/BusinessContext";

export default function MobileApp() {
  const {
    synced,
    toggleSync,
    transactions,
    customers,
    phoneAlerts,
    dismissPhoneAlert,
    offlineQueue,
    addTransaction,
    parseQuickEntry,
    resolveReconciliation,
    dayLedgerBatch,
    setIsDraggingDayBatch,
    transferDayBatchToPC,
  } = useBusiness();

  const [entry, setEntry] = useState("");
  const [justSaved, setJustSaved] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"capture" | "sms" | "udhaar" | "alerts">("capture");
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  // Smart NLP live parse breakdown
  const parsedPreview = useMemo(() => parseQuickEntry(entry), [entry, parseQuickEntry]);

  const handleSave = (textToSave?: string) => {
    const inputText = textToSave || entry;
    if (!inputText.trim()) return;

    const res = addTransaction(inputText, isRecordingVoice ? "Voice" : "Text");
    if (res.success && res.transaction) {
      setJustSaved(res.transaction.item);
      setEntry("");
      setIsRecordingVoice(false);

      if (synced) {
        toast.success("Live Office Kit Sync! ⚡", {
          description: `Captured ${res.transaction.item} → Added to Day Batch`,
        });
      } else {
        toast.warning("Queued Offline", {
          description: "Saved in Mobile SQLite. Will sync when Day Batch is transferred.",
        });
      }
      setTimeout(() => setJustSaved(null), 2500);
    }
  };

  const simulateVoiceInput = (samplePhrase: string) => {
    setIsRecordingVoice(true);
    setEntry("Listening...");
    setTimeout(() => {
      setEntry(samplePhrase);
    }, 1000);
  };

  const sampleChips = [
    "Vidya Institute 5 Classmate Register 450 cash",
    "Bought 50 paper rims from JK Paper at 245 each",
    "Ramesh Engineering 2 A4 paper 560 UPI",
    "Anita 1 Camel Acrylic Colors 280 UPI",
  ];

  const simulatedBankSMS = [
    { id: "sms-1", sender: "AX-HDFCBK", text: "INR 1,250.00 credited via UPI/P2A for bulk exam sheets printing.", amount: 1250, time: "10:50 AM" },
    { id: "sms-2", sender: "VM-SBIINB", text: "INR 8,500.00 received via PhonePe UPI from Vidya Coaching Institute.", amount: 8500, time: "09:45 AM" },
  ];

  return (
    <aside className="left-mobile-panel">
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
              <span className="eyebrow flex items-center gap-1">
                <BookOpen size={10} className="text-lime-500" /> FINALYTICS MOBILE APP
              </span>
              <h3>Ravi Stationary Store</h3>
            </div>
            <div className="avatar">R</div>
          </div>

          {/* Balance Summary */}
          <div className="phone-balance">
            <div>
              <span>Today’s Mobile Capture</span>
              <strong>₹{dayLedgerBatch.totalRevenue.toLocaleString()}</strong>
            </div>
            <span className="mini-up">
              <ArrowUpRight size={13} /> {dayLedgerBatch.totalTransactionsCount} txs
            </span>
          </div>

          {/* Sub Navigation */}
          <div className="flex gap-1 mb-2 p-1 rounded-lg bg-purple-950/40 text-[10px] flex-shrink-0">
            <button
              onClick={() => setActiveTab("capture")}
              className={`flex-1 py-1 px-1 rounded text-center font-bold transition-all ${
                activeTab === "capture" ? "bg-lime-400 text-purple-950" : "text-purple-200 hover:text-white"
              }`}
            >
              Day Entry
            </button>
            <button
              onClick={() => setActiveTab("sms")}
              className={`flex-1 py-1 px-1 rounded text-center font-bold transition-all ${
                activeTab === "sms" ? "bg-lime-400 text-purple-950" : "text-purple-200 hover:text-white"
              }`}
            >
              SMS Reader
            </button>
            <button
              onClick={() => setActiveTab("udhaar")}
              className={`flex-1 py-1 px-1 rounded text-center font-bold transition-all ${
                activeTab === "udhaar" ? "bg-lime-400 text-purple-950" : "text-purple-200 hover:text-white"
              }`}
            >
              Udhaar
            </button>
            <button
              onClick={() => setActiveTab("alerts")}
              className={`flex-1 py-1 px-1 rounded text-center font-bold transition-all relative ${
                activeTab === "alerts" ? "bg-lime-400 text-purple-950" : "text-purple-200 hover:text-white"
              }`}
            >
              Alerts
              {phoneAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[8px] flex items-center justify-center font-bold">
                  {phoneAlerts.length}
                </span>
              )}
            </button>
          </div>

          {/* TAB VIEWPORT: Locked scroll container so tab switching never changes phone frame dimensions */}
          <div className="phone-tab-viewport flex-1 min-h-0 overflow-y-auto pr-0.5 space-y-2">
          {/* TAB 1: TRANSACTION ENTRY & DAY BATCH DRAG CARD */}
          {activeTab === "capture" && (
            <div className="space-y-3">
              {/* CORE FEATURE: ENTIRE DAY LEDGER BATCH DRAG CARD */}
              <div
                draggable
                onDragStart={() => setIsDraggingDayBatch(true)}
                onDragEnd={() => setIsDraggingDayBatch(false)}
                className="p-3 rounded-xl border-2 border-lime-400 bg-gradient-to-br from-purple-900 to-purple-950 text-white shadow-md dragg-card space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-lime-300 flex items-center gap-1">
                    <Layers size={13} /> TODAY'S DAILY LEDGER BATCH
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-lime-400 text-purple-950 font-bold text-[9px]">
                    {dayLedgerBatch.totalTransactionsCount} TXS
                  </span>
                </div>

                <div className="flex justify-between items-baseline">
                  <div>
                    <strong className="text-base text-white font-mono block">
                      ₹{dayLedgerBatch.totalRevenue.toLocaleString()}
                    </strong>
                    <span className="text-[9px] text-purple-200">
                      UPI ₹{dayLedgerBatch.upiTotal.toLocaleString()} · Cash ₹{dayLedgerBatch.cashTotal.toLocaleString()}
                    </span>
                  </div>
                  <GripVertical size={18} className="text-lime-400 animate-pulse" />
                </div>

                <button
                  onClick={() => {
                    transferDayBatchToPC();
                    toast.success("Entire Day Batch Transferred! ⚡", {
                      description: `Synced ${dayLedgerBatch.totalTransactionsCount} transactions (₹${dayLedgerBatch.totalRevenue.toLocaleString()}) to PC.`,
                    });
                  }}
                  className="w-full py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-purple-950 font-bold text-[10px] flex items-center justify-center gap-1 shadow"
                >
                  <Send size={12} /> DRAG DAY BATCH TO PC DROPZONE ➔
                </button>
              </div>

              {/* Input Box */}
              <div className="capture-box">
                <div className="capture-title">
                  <span>
                    <Mic size={14} className={isRecordingVoice ? "animate-pulse text-lime-400" : ""} /> Natural Voice / Text Entry
                  </span>
                  <button onClick={() => simulateVoiceInput("Vidya Institute 5 Classmate Register 450 cash")} title="Voice Transaction Entry">
                    <Volume2 size={14} />
                  </button>
                </div>

                <div className="capture-input">
                  <input
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                    placeholder="e.g. Ramesh 3 books 180 UPI or Vidya 5 Register 450 cash"
                  />
                  <button onClick={() => handleSave()} aria-label="Save transaction">
                    <Plus size={18} />
                  </button>
                </div>

                {isRecordingVoice && (
                  <div className="voice-wave my-2">
                    <span />
                    <span />
                    <span />
                    <span className="text-[9px] text-lime-300 font-bold ml-2">Listening: Voice Entry...</span>
                  </div>
                )}

                {/* Smart NLP Live Parse Preview */}
                {entry.trim() && !isRecordingVoice && (
                  <div className="parse-pill-box">
                    <span className="parse-tag">Type: <strong>{parsedPreview.type}</strong></span>
                    <span className="parse-tag">Item: <strong>{parsedPreview.product}</strong></span>
                    <span className="parse-tag">Qty: <strong>{parsedPreview.quantity}</strong></span>
                    <span className="parse-tag">Amt: <strong>₹{parsedPreview.amount}</strong></span>
                    <span className="parse-tag">Pay: <strong>{parsedPreview.paymentType}</strong></span>
                  </div>
                )}

                {/* Quick Entry Suggestions */}
                <div className="quick-chips">
                  <span className="chips-label">Quick Entry Suggestions:</span>
                  <div className="chips-wrap">
                    {sampleChips.map((chip) => (
                      <button key={chip} className="chip-btn" onClick={() => handleSave(chip)}>
                        + {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Day's Transactions List */}
              <div className="phone-section-heading">
                <span>Day's Logged Items ({transactions.length})</span>
                <span className="text-[9px] text-purple-300">SQLite Local</span>
              </div>
              <div className="phone-tx-list max-h-[140px] overflow-y-auto pr-1 space-y-1">
                {transactions.map((t) => (
                  <div
                    key={t.id}
                    className="border border-purple-800/30 rounded p-1.5 bg-white/90 text-[10px] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className={`transaction-symbol ${t.tone}`}>{t.productName.charAt(0)}</div>
                      <div className="min-w-0">
                        <strong className="truncate block text-purple-950">{t.item}</strong>
                        <span className="text-[8px] text-gray-500">{t.detail}</span>
                      </div>
                    </div>
                    <strong className="text-[9px] text-purple-900 ml-1">{t.amountFormatted}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: BANK SMS & UPI READER */}
          {activeTab === "sms" && (
            <div className="space-y-2">
              <div className="p-2 rounded bg-purple-900/40 text-purple-100 text-[10px]">
                <strong className="text-lime-300 block mb-1 flex items-center gap-1">
                  <CreditCard size={12} /> Local Bank Notification Reader
                </strong>
                Extracts incoming bank SMS locally into today's day ledger batch.
              </div>

              {simulatedBankSMS.map((sms) => (
                <div key={sms.id} className="p-2.5 rounded-lg border border-purple-200 bg-white shadow-sm space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-purple-900">{sms.sender}</span>
                    <span className="text-gray-400">{sms.time}</span>
                  </div>
                  <p className="text-[9px] text-gray-700 font-mono bg-gray-50 p-1.5 rounded border border-gray-100">{sms.text}</p>
                  <button
                    onClick={() => {
                      addTransaction(`Vidya Institute ${sms.amount} UPI`, "Bank SMS");
                      toast.success("SMS Added to Day Batch! ⚡", { description: `Extracted ₹${sms.amount} via UPI` });
                    }}
                    className="w-full py-1 rounded bg-purple-800 hover:bg-purple-900 text-lime-300 text-[9px] font-bold flex items-center justify-center gap-1"
                  >
                    <Zap size={11} /> Extract & Add ₹{sms.amount} to Day Batch
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: CUSTOMER UDHAAR LEDGER */}
          {activeTab === "udhaar" && (
            <div className="space-y-2">
              <div className="p-2 rounded bg-rose-950/40 text-rose-100 text-[10px] flex justify-between items-center">
                <span>Total Udhaar Outstanding</span>
                <strong className="text-rose-300 text-xs">
                  ₹{customers.reduce((acc, c) => acc + c.outstandingUdhaar, 0).toLocaleString()}
                </strong>
              </div>

              {customers.map((c) => (
                <div key={c.id} className="p-2.5 rounded-lg border border-gray-200 bg-white shadow-sm space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <strong className="text-[11px] text-purple-950 block">{c.name}</strong>
                      <span className="text-[9px] text-gray-500">{c.phone}</span>
                    </div>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${c.outstandingUdhaar > 0 ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {c.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] pt-1 border-t border-gray-100">
                    <span>Udhaar Due: <strong className="text-rose-600">₹{c.outstandingUdhaar}</strong></span>
                    {c.outstandingUdhaar > 0 && (
                      <button
                        onClick={() => {
                          toast.success(`WhatsApp Reminder Sent to ${c.name} 📱`, { description: `Reminder sent for ₹${c.outstandingUdhaar} stationery balance.` });
                        }}
                        className="px-2 py-0.5 rounded bg-lime-400 text-purple-950 font-bold text-[8px] flex items-center gap-1 hover:bg-lime-300"
                      >
                        <MessageSquare size={10} /> Send Reminder
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: PC ALERTS & DAILY BRIEF INBOX */}
          {activeTab === "alerts" && (
            <div className="space-y-2">
              <div className="phone-section-heading">
                <span>Live PC Alerts ({phoneAlerts.length})</span>
                <span className="live-badge-mini">Office Kit Synced</span>
              </div>

              {phoneAlerts.length > 0 ? (
                <div className="phone-alerts-stack max-h-[300px] overflow-y-auto">
                  {phoneAlerts.map((alert: PhoneAlert) => (
                    <div
                      className={`mobile-alert ${
                        alert.type === "reconciliation"
                          ? "alert-warning"
                          : alert.type === "brief"
                          ? "bg-purple-900 text-white border-purple-700"
                          : "alert-info"
                      }`}
                      key={alert.id}
                    >
                      <div className="alert-icon">
                        {alert.type === "reconciliation" ? (
                          <AlertTriangle size={15} />
                        ) : alert.type === "brief" ? (
                          <FileText size={15} />
                        ) : (
                          <RefreshCw size={15} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <strong className="block text-[10px] leading-tight">{alert.title}</strong>
                        <span className="text-[8px] opacity-80 block leading-tight">{alert.message}</span>

                        {alert.actionRequired && alert.type === "reconciliation" && (
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => {
                                resolveReconciliation("rec-1");
                                toast.success("Reconciliation Confirmed! ⚡", { description: "PC Day Batch & CSV auto-updated." });
                              }}
                              className="px-2 py-1 rounded bg-purple-900 text-lime-300 font-bold text-[8px] flex items-center gap-1"
                            >
                              <Check size={10} /> CONFIRM ₹1,000
                            </button>
                            <button
                              onClick={() => dismissPhoneAlert(alert.id)}
                              className="px-2 py-1 rounded bg-gray-200 text-gray-700 font-bold text-[8px]"
                            >
                              DISMISS
                            </button>
                          </div>
                        )}
                      </div>
                      <button className="dismiss-btn" onClick={() => dismissPhoneAlert(alert.id)}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mobile-alert-empty">
                  <span>No active alerts · All records reconciled</span>
                </div>
              )}
            </div>
          )}
          </div>

          {/* Office Kit Sync Status Banner */}
          <div className={`phone-sync-card ${synced ? "synced" : "offline"} mt-auto flex-shrink-0`}>
            <div className="sync-orbit">
              <RefreshCw size={14} className={synced ? "spin-slow" : ""} />
            </div>
            <div>
              <strong>{synced ? "Office Kit Connected" : "Working Offline"}</strong>
              <span>{synced ? `Day Batch Synced (${dayLedgerBatch.totalTransactionsCount} txs)` : `${offlineQueue.length} queued`}</span>
            </div>
            <button onClick={toggleSync}>{synced ? <Check size={15} /> : <ChevronRight size={15} />}</button>
          </div>

          {justSaved && (
            <div className="saved-toast">
              <Check size={14} /> Added {justSaved} to Day Batch
            </div>
          )}
        </div>
      </div>
      <div className="phone-caption mt-2 text-center text-purple-300 text-[10px] flex items-center justify-center gap-1">
        <Smartphone size={14} />
        <span>Finalytics Mobile Terminal · Offline SQLite</span>
      </div>
    </aside>
  );
}
