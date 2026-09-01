import React, { createContext, useContext, useState, useMemo, useCallback } from "react";

export type PaymentMethod = "Cash" | "UPI" | "Credit" | "Bank" | "Card";

export type TransactionType = "sale" | "purchase";

export type Transaction = {
  id: string;
  item: string;
  quantity: number;
  productName: string;
  detail: string;
  amount: number;
  amountFormatted: string;
  paymentType: PaymentMethod;
  transactionType: TransactionType;
  customer?: string;
  supplier?: string;
  tone: "lime" | "rust" | "teal" | "violet";
  timestamp: string;
  date: string;
  source: "Voice" | "Text" | "Bank SMS" | "Manual" | "Office Kit";
  isReconciled: boolean;
  isNewSync?: boolean;
};

export type DayLedgerBatch = {
  date: string;
  totalTransactionsCount: number;
  totalRevenue: number;
  totalSalesCount: number;
  totalPurchasesCount: number;
  upiTotal: number;
  cashTotal: number;
  creditTotal: number;
  isSyncedToPC: boolean;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  totalPurchases: number;
  outstandingUdhaar: number;
  lastPurchase: string;
  status: "Good Standing" | "Payment Due" | "Overdue";
};

export type Supplier = {
  id: string;
  name: string;
  product: string;
  previousCost: number;
  currentCost: number;
  sellingPrice: number;
  priceIncreasePct: number;
  oldMargin: number;
  newMargin: number;
};

export type InventoryItem = {
  id: string;
  name: string;
  stock: number;
  expectedStock: number;
  reorderLevel: number;
  unitCost: number;
  unitPrice: number;
  category: string;
  salesGrowthPct: number;
};

export type ReconciliationIssue = {
  id: string;
  type: "upi_mismatch" | "duplicate" | "cash_discrepancy" | "inventory_discrepancy";
  title: string;
  description: string;
  expectedAmount?: string;
  recordedAmount?: string;
  difference?: string;
  evidenceNote?: string;
  status: "pending" | "resolved";
};

export type PhoneAlert = {
  id: string;
  title: string;
  message: string;
  type: "reconciliation" | "low_stock" | "insight" | "brief";
  time: string;
  actionRequired?: boolean;
};

export type AIInsight = {
  id: string;
  title: string;
  what: string;
  why: string;
  next: string;
  tag: string;
};

export type GeneratedDayReport = {
  id: string;
  generatedAt: string;
  totalRevenue: number;
  salesCount: number;
  purchasesCount: number;
  grossProfit: number;
  profitMarginPct: number;
  reconciliationScorePct: number;
  upiTotal: number;
  cashTotal: number;
  creditTotal: number;
  insights: {
    title: string;
    description: string;
    impact: string;
    type: "positive" | "warning" | "info";
  }[];
  recommendations: {
    action: string;
    reason: string;
    priority: "High" | "Medium" | "Low";
    category: "Inventory" | "Pricing" | "Udhaar Credit" | "Reconciliation";
  }[];
  categoryBreakdown: { category: string; amount: number; percentage: number }[];
};

type ParsedEntry = {
  type: TransactionType;
  customer?: string;
  supplier?: string;
  product: string;
  quantity: number;
  amount: number;
  paymentType: PaymentMethod;
  unitCost?: number;
  isValid: boolean;
};

interface BusinessContextType {
  synced: boolean;
  toggleSync: () => void;
  transactions: Transaction[];
  customers: Customer[];
  suppliers: Supplier[];
  inventory: InventoryItem[];
  reconciliationIssues: ReconciliationIssue[];
  phoneAlerts: PhoneAlert[];
  dismissPhoneAlert: (id: string) => void;
  aiInsights: AIInsight[];
  offlineQueue: Transaction[];
  todayRevenue: number;
  todaySalesCount: number;
  grossProfit: number;
  stockValue: number;
  totalUdhaarOutstanding: number;
  lastSyncedTime: string;
  demoStep: number;
  setDemoStep: (step: number) => void;
  advanceDemoStep: () => void;
  resetDemo: () => void;
  parseQuickEntry: (input: string) => ParsedEntry;
  addTransaction: (input: string, source?: Transaction["source"]) => { success: boolean; transaction?: Transaction };
  pushAlertToPhone: (title: string, message: string, type?: PhoneAlert["type"], actionRequired?: boolean) => void;
  resolveReconciliation: (issueId: string) => void;
  reorderProduct: (productId: string) => void;
  sendDailyBriefToPhone: () => void;
  importCSVData: (rawCSV: string) => void;
  draggedTx: Transaction | null;
  setDraggedTx: (tx: Transaction | null) => void;
  transferTransactionToPC: (tx: Transaction) => void;
  // DAY LEDGER BATCH TRANSFER
  dayLedgerBatch: DayLedgerBatch;
  isDraggingDayBatch: boolean;
  setIsDraggingDayBatch: (val: boolean) => void;
  transferDayBatchToPC: () => void;
  lastGeneratedReport: GeneratedDayReport | null;
  generateOfficeKitReport: () => GeneratedDayReport;
}

const initialTransactions: Transaction[] = [
  {
    id: "tx-4",
    item: "Classmate Register 300pg · 5 units",
    quantity: 5,
    productName: "Classmate Register 300pg",
    detail: "Walk-in · Cash · 11:15 AM",
    amount: 450,
    amountFormatted: "+ ₹450",
    paymentType: "Cash",
    transactionType: "sale",
    tone: "lime",
    timestamp: "11:15 AM",
    date: "2026-08-30",
    source: "Text",
    isReconciled: true,
  },
  {
    id: "tx-3",
    item: "JK A4 Paper Rim 75gsm · 2 rims",
    quantity: 2,
    productName: "JK A4 Paper Rim 75gsm",
    detail: "Vidya Institute · UPI · 10:50 AM",
    amount: 560,
    amountFormatted: "+ ₹560",
    paymentType: "UPI",
    transactionType: "sale",
    customer: "Vidya Coaching Institute",
    tone: "teal",
    timestamp: "10:50 AM",
    date: "2026-08-30",
    source: "Text",
    isReconciled: true,
  },
  {
    id: "tx-2",
    item: "Flair Glass Gel Pens Box · 1 box",
    quantity: 1,
    productName: "Flair Gel Pen Box",
    detail: "Ramesh Engineering · Cash · 10:25 AM",
    amount: 120,
    amountFormatted: "+ ₹120",
    paymentType: "Cash",
    transactionType: "sale",
    customer: "Ramesh Engineering Works",
    tone: "lime",
    timestamp: "10:25 AM",
    date: "2026-08-30",
    source: "Text",
    isReconciled: true,
  },
  {
    id: "tx-1",
    item: "Camel Acrylic Colors Set · 1 set",
    quantity: 1,
    productName: "Camel Acrylic Colors",
    detail: "Anita · UPI · 09:45 AM",
    amount: 280,
    amountFormatted: "+ ₹280",
    paymentType: "UPI",
    transactionType: "sale",
    customer: "Anita Sharma",
    tone: "teal",
    timestamp: "09:45 AM",
    date: "2026-08-30",
    source: "Text",
    isReconciled: true,
  },
  {
    id: "tx-0",
    item: "JK A4 Paper Rim · 50 rims (Bulk Wholesale Purchase)",
    quantity: 50,
    productName: "JK A4 Paper Rim 75gsm",
    detail: "JK Paper Wholesaler · UPI · 09:00 AM",
    amount: 12250,
    amountFormatted: "- ₹12,250",
    paymentType: "UPI",
    transactionType: "purchase",
    supplier: "JK Paper Wholesaler Corp",
    tone: "violet",
    timestamp: "09:00 AM",
    date: "2026-08-30",
    source: "Manual",
    isReconciled: true,
  },
];

const initialCustomers: Customer[] = [
  { id: "c-1", name: "Vidya Coaching Institute", phone: "+91 98765 43210", totalPurchases: 14500, outstandingUdhaar: 2450, lastPurchase: "Today, 10:50 AM", status: "Payment Due" },
  { id: "c-2", name: "Ramesh Engineering Works", phone: "+91 98123 45678", totalPurchases: 8400, outstandingUdhaar: 850, lastPurchase: "Today, 10:25 AM", status: "Payment Due" },
  { id: "c-3", name: "Anita Sharma (Art Student)", phone: "+91 99887 76655", totalPurchases: 3200, outstandingUdhaar: 0, lastPurchase: "Today, 09:45 AM", status: "Good Standing" },
  { id: "c-4", name: "Rahul Verma (Law Student)", phone: "+91 97654 32109", totalPurchases: 2100, outstandingUdhaar: 140, lastPurchase: "Yesterday", status: "Payment Due" },
];

const initialSuppliers: Supplier[] = [
  { id: "s-1", name: "JK Paper Wholesaler Corp", product: "JK A4 Paper Rim 75gsm", previousCost: 210, currentCost: 245, sellingPrice: 280, priceIncreasePct: 16.7, oldMargin: 70, newMargin: 35 },
  { id: "s-2", name: "ITC Classmate Distributors", product: "Classmate Register 300pg", previousCost: 65, currentCost: 65, sellingPrice: 90, priceIncreasePct: 0, oldMargin: 25, newMargin: 25 },
  { id: "s-3", name: "Flair Pen & Writing Ltd", product: "Flair Gel Pen Box", previousCost: 85, currentCost: 85, sellingPrice: 120, priceIncreasePct: 0, oldMargin: 35, newMargin: 35 },
];

const initialInventory: InventoryItem[] = [
  { id: "p-paper", name: "JK A4 Paper Rim 75gsm", stock: 14, expectedStock: 30, reorderLevel: 20, unitCost: 245, unitPrice: 280, category: "Paper & Rims", salesGrowthPct: 48 },
  { id: "p-register", name: "Classmate Register 300pg", stock: 18, expectedStock: 25, reorderLevel: 30, unitCost: 65, unitPrice: 90, category: "Notebooks", salesGrowthPct: 35 },
  { id: "p-flair", name: "Flair Glass Gel Pens Box", stock: 45, expectedStock: 45, reorderLevel: 15, unitCost: 85, unitPrice: 120, category: "Pens & Writing", salesGrowthPct: 12 },
  { id: "p-calculator", name: "Citizen Desktop Calculator", stock: 8, expectedStock: 8, reorderLevel: 10, unitCost: 320, unitPrice: 450, category: "Office Equipment", salesGrowthPct: -8 },
  { id: "p-colors", name: "Camel Acrylic Colors Set", stock: 25, expectedStock: 25, reorderLevel: 10, unitCost: 200, unitPrice: 280, category: "Art Supplies", salesGrowthPct: 22 },
];

const initialReconciliationIssues: ReconciliationIssue[] = [
  {
    id: "rec-1",
    type: "upi_mismatch",
    title: "UPI Bank Statement vs Day Ledger Mismatch",
    description: "Bank UPI statement shows ₹8,500 received today, but mobile day ledger total has ₹7,500 recorded.",
    expectedAmount: "₹8,500",
    recordedAmount: "₹7,500",
    difference: "₹1,000 mismatch",
    evidenceNote: "Phone Note match: 'Vidya Coaching Institute paid ₹1,000 via UPI' found without ledger entry.",
    status: "pending",
  },
  {
    id: "rec-2",
    type: "duplicate",
    title: "Possible Duplicate Transaction Detected",
    description: "Two identical ₹560 UPI entries logged within 1 minute at 10:50 AM for A4 Paper Rims.",
    expectedAmount: "₹560 (1 entry)",
    recordedAmount: "₹1,120 (2 entries)",
    difference: "₹560 duplicate",
    evidenceNote: "Bank reference ID #UPI99812 matches single authorization.",
    status: "pending",
  },
  {
    id: "rec-3",
    type: "cash_discrepancy",
    title: "End of Day Cash Drawer Discrepancy",
    description: "Expected Cash ₹14,200 based on opening cash + sales - expenses. Recorded physical cash is ₹13,450.",
    expectedAmount: "₹14,200",
    recordedAmount: "₹13,450",
    difference: "₹750 cash missing",
    evidenceNote: "Check unrecorded morning printing ink expenses or unentered cash change.",
    status: "pending",
  },
  {
    id: "rec-4",
    type: "inventory_discrepancy",
    title: "Physical Inventory Stock Count Mismatch",
    description: "Expected Classmate Register stock 25 notebooks based on sales. Physical count shows 18 notebooks.",
    expectedAmount: "25 notebooks",
    recordedAmount: "18 notebooks",
    difference: "7 notebooks missing",
    evidenceNote: "Possible unrecorded student sales or display aisle damage.",
    status: "pending",
  },
];

const initialPhoneAlerts: PhoneAlert[] = [
  {
    id: "alert-1",
    title: "⚠ Possible Missing Payment: ₹1,000",
    message: "UPI received ₹8,500 vs Ledger ₹7,500. Note 'Vidya Institute paid ₹1,000' found.",
    type: "reconciliation",
    time: "10:30 AM",
    actionRequired: true,
  },
];

const BusinessContext = createContext<BusinessContextType | null>(null);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [synced, setSynced] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [suppliers] = useState<Supplier[]>(initialSuppliers);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [reconciliationIssues, setReconciliationIssues] = useState<ReconciliationIssue[]>(initialReconciliationIssues);
  const [phoneAlerts, setPhoneAlerts] = useState<PhoneAlert[]>(initialPhoneAlerts);
  const [offlineQueue, setOfflineQueue] = useState<Transaction[]>([]);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>("Just now");
  const [demoStep, setDemoStep] = useState<number>(0);
  const [draggedTx, setDraggedTx] = useState<Transaction | null>(null);
  const [isDraggingDayBatch, setIsDraggingDayBatch] = useState<boolean>(false);

  // Parse natural entry e.g. "Ramesh 5 Classmate Register 450 cash" or "Bought 50 paper rims from JK Paper at 245 each"
  const parseQuickEntry = useCallback((input: string): ParsedEntry => {
    const text = input.trim();
    if (!text) {
      return { type: "sale", product: "Item", quantity: 1, amount: 0, paymentType: "Cash", isValid: false };
    }

    const lower = text.toLowerCase();
    const isPurchase = lower.includes("bought") || lower.includes("purchase") || lower.includes("purchased") || lower.includes("from");
    const type: TransactionType = isPurchase ? "purchase" : "sale";

    const tokens = text.split(/\s+/);
    let quantity = 1;
    let amount = 0;
    let unitCost = 0;
    let paymentType: PaymentMethod = "Cash";
    let customer: string | undefined = undefined;
    let supplier: string | undefined = undefined;
    const productWords: string[] = [];

    // Known customer names check
    if (lower.includes("vidya")) customer = "Vidya Coaching Institute";
    else if (lower.includes("ramesh")) customer = "Ramesh Engineering Works";
    else if (lower.includes("anita")) customer = "Anita Sharma";
    else if (lower.includes("rahul")) customer = "Rahul Verma";

    // Known supplier check
    if (lower.includes("jk paper") || lower.includes("jk")) supplier = "JK Paper Wholesaler Corp";
    else if (lower.includes("classmate")) supplier = "ITC Classmate Distributors";
    else if (lower.includes("flair")) supplier = "Flair Pen & Writing Ltd";

    tokens.forEach((token) => {
      const tLower = token.toLowerCase();
      if (tLower === "cash") paymentType = "Cash";
      else if (tLower === "upi" || tLower === "gpay" || tLower === "paytm" || tLower === "phonepe") paymentType = "UPI";
      else if (tLower === "credit" || tLower === "udhar" || tLower === "udhaar") paymentType = "Credit";
      else if (tLower === "bank") paymentType = "Bank";
      else if (tLower === "card") paymentType = "Card";
      else if (/^\d+$/.test(token)) {
        const val = parseInt(token, 10);
        if (val > 0 && val <= 100 && quantity === 1) {
          quantity = val;
        } else {
          amount = val;
        }
      } else if (/^(?:₹|rs\.?|inr)?\d+$/i.test(token)) {
        amount = parseInt(token.replace(/\D/g, ""), 10);
      } else if (tLower !== "bought" && tLower !== "from" && tLower !== "each" && tLower !== "at" && tLower !== "ko" && tLower !== "teen") {
        if (token !== customer && token !== supplier) {
          productWords.push(token);
        }
      }
    });

    let product = productWords.join(" ");
    if (lower.includes("paper") || lower.includes("rim") || lower.includes("a4")) product = "JK A4 Paper Rim 75gsm";
    else if (lower.includes("register") || lower.includes("notebook")) product = "Classmate Register 300pg";
    else if (lower.includes("pen") || lower.includes("flair")) product = "Flair Gel Pen Box";
    else if (lower.includes("color") || lower.includes("paint")) product = "Camel Acrylic Colors";
    else if (lower.includes("calculator")) product = "Citizen Desktop Calculator";
    else if (!product) product = "Stationery Item";

    if (type === "purchase") {
      if (lower.includes("at 245") || lower.includes("245 each")) unitCost = 245;
      else if (lower.includes("at 65") || lower.includes("65 each")) unitCost = 65;
      if (unitCost > 0 && amount === 0) amount = unitCost * quantity;
    }

    if (amount === 0) {
      const matched = initialInventory.find((i) => i.name.toLowerCase().includes(product.toLowerCase()));
      if (matched) {
        amount = matched.unitPrice * quantity;
      } else {
        amount = 90 * quantity;
      }
    }

    return { type, customer, supplier, product, quantity, amount, paymentType, unitCost, isValid: true };
  }, []);

  const pushAlertToPhone = useCallback(
    (title: string, message: string, type: PhoneAlert["type"] = "low_stock", actionRequired: boolean = false) => {
      const newAlert: PhoneAlert = {
        id: `alert-${Date.now()}`,
        title,
        message,
        type,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actionRequired,
      };
      setPhoneAlerts((prev) => [newAlert, ...prev]);
    },
    []
  );

  const dismissPhoneAlert = useCallback((id: string) => {
    setPhoneAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const addTransaction = useCallback(
    (input: string, source: Transaction["source"] = "Text") => {
      const parsed = parseQuickEntry(input);
      if (!parsed.isValid) return { success: false };

      const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const dateStr = new Date().toISOString().split("T")[0];
      const tone: "lime" | "rust" | "teal" | "violet" =
        parsed.type === "purchase"
          ? "violet"
          : parsed.paymentType === "UPI"
          ? "teal"
          : parsed.paymentType === "Cash"
          ? "lime"
          : "rust";

      const formattedAmount = parsed.type === "purchase" ? `- ₹${parsed.amount.toLocaleString()}` : `+ ₹${parsed.amount.toLocaleString()}`;

      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        item: `${parsed.product} · ${parsed.quantity} unit${parsed.quantity > 1 ? "s" : ""}`,
        quantity: parsed.quantity,
        productName: parsed.product,
        detail: `${parsed.customer ? parsed.customer + " · " : ""}${parsed.paymentType} · ${timeStr}`,
        amount: parsed.amount,
        amountFormatted: formattedAmount,
        paymentType: parsed.paymentType,
        transactionType: parsed.type,
        customer: parsed.customer,
        supplier: parsed.supplier,
        tone,
        timestamp: timeStr,
        date: dateStr,
        source,
        isReconciled: true,
        isNewSync: true,
      };

      if (synced) {
        setTransactions((prev) => [newTx, ...prev.map((t) => ({ ...t, isNewSync: false }))]);

        // Stock adjustment
        setInventory((prev) =>
          prev.map((item) => {
            if (item.name.toLowerCase().includes(parsed.product.toLowerCase())) {
              const delta = parsed.type === "purchase" ? parsed.quantity : -parsed.quantity;
              const newStock = Math.max(0, item.stock + delta);
              if (newStock <= item.reorderLevel) {
                pushAlertToPhone(`Stock Warning: ${item.name}`, `Only ${newStock} units left! Recommend purchasing ~20 rims/units.`, "low_stock");
              }
              return { ...item, stock: newStock };
            }
            return item;
          })
        );

        // Customer udhaar credit update if credit
        if (parsed.customer && parsed.paymentType === "Credit") {
          setCustomers((prev) =>
            prev.map((c) =>
              c.name.toLowerCase().includes(parsed.customer!.toLowerCase())
                ? { ...c, outstandingUdhaar: c.outstandingUdhaar + parsed.amount, status: "Payment Due" }
                : c
            )
          );
        }
      } else {
        setOfflineQueue((prev) => [newTx, ...prev]);
      }

      return { success: true, transaction: newTx };
    },
    [parseQuickEntry, synced, pushAlertToPhone]
  );

  const toggleSync = useCallback(() => {
    setSynced((prev) => {
      const next = !prev;
      if (next && offlineQueue.length > 0) {
        setTransactions((curr) => [...offlineQueue.map((t) => ({ ...t, isNewSync: true })), ...curr]);
        setOfflineQueue([]);
        setLastSyncedTime("Just now");
      }
      return next;
    });
  }, [offlineQueue]);

  const resolveReconciliation = useCallback((issueId: string) => {
    setReconciliationIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          return { ...issue, status: "resolved" };
        }
        return issue;
      })
    );

    if (issueId === "rec-1") {
      const missingTx: Transaction = {
        id: `tx-rec-1-${Date.now()}`,
        item: "Vidya Coaching Institute · Bulk Exam Papers Printing",
        quantity: 1,
        productName: "Exam Papers Printing",
        detail: "Vidya Institute · UPI · Reconciled Phone Note",
        amount: 1000,
        amountFormatted: "+ ₹1,000",
        paymentType: "UPI",
        transactionType: "sale",
        customer: "Vidya Coaching Institute",
        tone: "teal",
        timestamp: "10:30 AM",
        date: new Date().toISOString().split("T")[0],
        source: "Office Kit",
        isReconciled: true,
        isNewSync: true,
      };
      setTransactions((prev) => [missingTx, ...prev]);
    }
  }, []);

  const reorderProduct = useCallback((productId: string) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, stock: item.stock + 50 } : item))
    );
  }, []);

  const sendDailyBriefToPhone = useCallback(() => {
    const briefMessage = `Daily Brief: Today Revenue ₹7,680 (76 txs). Top item: JK A4 Paper Rim (+48% velocity). Outstanding Udhaar: ₹3,440 across 3 accounts.`;
    pushAlertToPhone("Finalytics Daily Business Brief 📊", briefMessage, "brief");
  }, [pushAlertToPhone]);

  const importCSVData = useCallback((rawCSV: string) => {
    const lines = rawCSV.trim().split("\n");
    if (lines.length <= 1) return;

    const newTxs: Transaction[] = [];
    lines.slice(1).forEach((line, index) => {
      const parts = line.split(",");
      if (parts.length >= 6) {
        const [date, time, typeStr, entity, product, qtyStr, amtStr, payTypeStr] = parts.map((p) => p.trim());
        const amt = parseFloat(amtStr) || 100;
        const qty = parseInt(qtyStr, 10) || 1;
        const txType: TransactionType = typeStr?.toLowerCase() === "purchase" ? "purchase" : "sale";
        const payType: PaymentMethod = (payTypeStr as PaymentMethod) || "Cash";

        newTxs.push({
          id: `tx-csv-${index}-${Date.now()}`,
          item: `${product} · ${qty} unit${qty > 1 ? "s" : ""}`,
          quantity: qty,
          productName: product,
          detail: `${entity ? entity + " · " : ""}${payType} · ${time || "12:00 PM"}`,
          amount: amt,
          amountFormatted: txType === "purchase" ? `- ₹${amt.toLocaleString()}` : `+ ₹${amt.toLocaleString()}`,
          paymentType: payType,
          transactionType: txType,
          customer: txType === "sale" ? entity : undefined,
          supplier: txType === "purchase" ? entity : undefined,
          tone: txType === "purchase" ? "violet" : payType === "UPI" ? "teal" : "lime",
          timestamp: time || "12:00 PM",
          date: date || new Date().toISOString().split("T")[0],
          source: "Office Kit",
          isReconciled: true,
          isNewSync: true,
        });
      }
    });

    if (newTxs.length > 0) {
      setTransactions((prev) => [...newTxs, ...prev]);
    }
  }, []);

  const [lastGeneratedReport, setLastGeneratedReport] = useState<GeneratedDayReport | null>(null);

  const generateOfficeKitReport = useCallback(() => {
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const sales = transactions.filter((t) => t.transactionType === "sale");
    const purchases = transactions.filter((t) => t.transactionType === "purchase");
    const totalRev = sales.reduce((acc, t) => acc + t.amount, 0);
    const upiSum = transactions.reduce((acc, t) => acc + (t.paymentType === "UPI" ? t.amount : 0), 0);
    const cashSum = transactions.reduce((acc, t) => acc + (t.paymentType === "Cash" ? t.amount : 0), 0);
    const creditSum = customers.reduce((acc, c) => acc + c.outstandingUdhaar, 0);
    const gross = Math.round(totalRev * 0.294);

    const report: GeneratedDayReport = {
      id: `report-${Date.now()}`,
      generatedAt: timeStr,
      totalRevenue: totalRev,
      salesCount: sales.length,
      purchasesCount: purchases.length,
      grossProfit: gross,
      profitMarginPct: 29.4,
      reconciliationScorePct: 96,
      upiTotal: upiSum,
      cashTotal: cashSum,
      creditTotal: creditSum,
      insights: [
        {
          title: "⚡ Office Kit Day Batch Successfully Ingested",
          description: `Ingested ${transactions.length} total records (${sales.length} sales, ${purchases.length} supplier orders) into Master SQLite ledger.`,
          impact: `₹${totalRev.toLocaleString()} Total Revenue`,
          type: "positive",
        },
        {
          title: "📈 Product Velocity Spike: Notebooks & Paper Rims",
          description: "Classmate 300pg Registers & JK A4 Paper Rims saw a +48% sales velocity increase driven by exam season.",
          impact: "Stock drops below reorder threshold",
          type: "warning",
        },
        {
          title: "💰 Supplier Margin Squeeze Alert",
          description: "JK Paper Wholesaler unit cost increased from ₹210 to ₹245, shrinking unit margin from ₹70 to ₹35/rim.",
          impact: "Gross margin reduced by -12.5%",
          type: "info",
        },
      ],
      recommendations: [
        {
          action: "Reorder 50 Rims of JK A4 Paper 75gsm",
          reason: "Current stock is 14 rims (below 20 rim reorder trigger) with high exam season demand.",
          priority: "High",
          category: "Inventory",
        },
        {
          action: "Send WhatsApp Payment Reminder to Vidya Coaching Institute",
          reason: "Outstanding credit balance of ₹2,450 is due for 5 days.",
          priority: "Medium",
          category: "Udhaar Credit",
        },
        {
          action: "Adjust Paper Rim Retail Price to ₹315",
          reason: "Restores target 25% profit margin following supplier price hike.",
          priority: "Medium",
          category: "Pricing",
        },
      ],
      categoryBreakdown: [
        { category: "Paper & Rims", amount: Math.round(totalRev * 0.45), percentage: 45 },
        { category: "Notebooks", amount: Math.round(totalRev * 0.30), percentage: 30 },
        { category: "Pens & Writing", amount: Math.round(totalRev * 0.15), percentage: 15 },
        { category: "Art & Office Supplies", amount: Math.round(totalRev * 0.10), percentage: 10 },
      ],
    };

    setLastGeneratedReport(report);
    return report;
  }, [transactions, customers]);

  const transferTransactionToPC = useCallback((tx: Transaction) => {
    setTransactions((prev) => {
      if (prev.some((t) => t.id === tx.id)) return prev;
      return [{ ...tx, isNewSync: true, source: "Office Kit" }, ...prev];
    });
    generateOfficeKitReport();
  }, [generateOfficeKitReport]);

  // Transfer ENTIRE DAY'S TRANSACTIONS BATCH
  const transferDayBatchToPC = useCallback(() => {
    setLastSyncedTime("Just now");
    setTransactions((prev) => prev.map((t) => ({ ...t, isNewSync: true })));
    setSynced(true);
    generateOfficeKitReport();
  }, [generateOfficeKitReport]);

  // Advance automated demo step
  const advanceDemoStep = useCallback(() => {
    setDemoStep((prev) => {
      const next = prev >= 9 ? 0 : prev + 1;
      if (next === 1) {
        addTransaction("Vidya Institute 5 Classmate Register 450 cash");
      } else if (next === 3) {
        transferDayBatchToPC();
      } else if (next === 6) {
        pushAlertToPhone("⚠ UPI Discrepancy: ₹1,000", "UPI statement ₹8,500 vs Day Ledger ₹7,500. Phone note evidence found.", "reconciliation", true);
      } else if (next === 9) {
        resolveReconciliation("rec-1");
      }
      return next;
    });
  }, [addTransaction, transferDayBatchToPC, pushAlertToPhone, resolveReconciliation]);

  const resetDemo = useCallback(() => {
    setDemoStep(0);
    setTransactions(initialTransactions);
    setReconciliationIssues(initialReconciliationIssues);
    setPhoneAlerts(initialPhoneAlerts);
  }, []);

  // Derived metrics
  const todayRevenue = useMemo(() => {
    return transactions.reduce((acc, t) => acc + (t.transactionType === "sale" ? t.amount : 0), 0);
  }, [transactions]);

  const todaySalesCount = useMemo(() => {
    return transactions.filter((t) => t.transactionType === "sale").length;
  }, [transactions]);

  const grossProfit = useMemo(() => {
    return Math.round(todayRevenue * 0.294);
  }, [todayRevenue]);

  const stockValue = useMemo(() => {
    return inventory.reduce((acc, item) => acc + item.stock * item.unitCost, 0);
  }, [inventory]);

  const totalUdhaarOutstanding = useMemo(() => {
    return customers.reduce((acc, c) => acc + c.outstandingUdhaar, 0);
  }, [customers]);

  // Derived Day Ledger Batch metadata
  const dayLedgerBatch: DayLedgerBatch = useMemo(() => {
    const sales = transactions.filter((t) => t.transactionType === "sale");
    const purchases = transactions.filter((t) => t.transactionType === "purchase");
    const upiTotal = transactions.reduce((acc, t) => acc + (t.paymentType === "UPI" ? t.amount : 0), 0);
    const cashTotal = transactions.reduce((acc, t) => acc + (t.paymentType === "Cash" ? t.amount : 0), 0);
    const creditTotal = transactions.reduce((acc, t) => acc + (t.paymentType === "Credit" ? t.amount : 0), 0);

    return {
      date: "2026-08-30",
      totalTransactionsCount: transactions.length,
      totalRevenue: todayRevenue,
      totalSalesCount: sales.length,
      totalPurchasesCount: purchases.length,
      upiTotal,
      cashTotal,
      creditTotal,
      isSyncedToPC: synced,
    };
  }, [transactions, todayRevenue, synced]);

  const aiInsights: AIInsight[] = useMemo(() => {
    return [
      {
        id: "ai-1",
        title: "Supplier Cost Increase: JK Paper Wholesaler (+16.7%)",
        what: "JK Paper Wholesaler increased A4 Paper Rim unit cost from ₹210 to ₹245.",
        why: "Paper pulp raw material costs rose. Your unit margin shrank from ₹70 to ₹35/rim.",
        next: "Adjust retail price from ₹280 to ₹315 to restore 25% profit margin.",
        tag: "SUPPLIER COST ALERT",
      },
      {
        id: "ai-2",
        title: "High Sales Velocity: Classmate Registers (+35%)",
        what: "Exam season spike: Classmate 300pg Notebooks sales increased by +35%.",
        why: "High coaching institute demand from Vidya Coaching Institute.",
        next: "Reorder 50 units immediately to avoid stockout during upcoming mid-term exams.",
        tag: "DEMAND FORECAST",
      },
    ];
  }, []);

  return (
    <BusinessContext.Provider
      value={{
        synced,
        toggleSync,
        transactions,
        customers,
        suppliers,
        inventory,
        reconciliationIssues,
        phoneAlerts,
        dismissPhoneAlert,
        aiInsights,
        offlineQueue,
        todayRevenue,
        todaySalesCount,
        grossProfit,
        stockValue,
        totalUdhaarOutstanding,
        lastSyncedTime,
        demoStep,
        setDemoStep,
        advanceDemoStep,
        resetDemo,
        parseQuickEntry,
        addTransaction,
        pushAlertToPhone,
        resolveReconciliation,
        reorderProduct,
        sendDailyBriefToPhone,
        importCSVData,
        draggedTx,
        setDraggedTx,
        transferTransactionToPC,
        dayLedgerBatch,
        isDraggingDayBatch,
        setIsDraggingDayBatch,
        transferDayBatchToPC,
        lastGeneratedReport,
        generateOfficeKitReport,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }
  return context;
}
