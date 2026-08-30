import React, { createContext, useContext, useState, useMemo, useCallback } from "react";

export type PaymentMethod = "Cash" | "UPI" | "Credit" | "Card";

export type Transaction = {
  id: string;
  item: string;
  quantity: number;
  productName: string;
  detail: string;
  amount: number;
  amountFormatted: string;
  paymentType: PaymentMethod;
  tone: "lime" | "rust" | "teal";
  timestamp: string;
  isNewSync?: boolean;
};

export type InventoryItem = {
  id: string;
  name: string;
  stock: number;
  reorderLevel: number;
  unitPrice: number;
  category: string;
};

export type PhoneAlert = {
  id: string;
  title: string;
  message: string;
  type: "reconciliation" | "low_stock" | "insight";
  time: string;
};

export type AIInsight = {
  id: string;
  title: string;
  what: string;
  why: string;
  next: string;
  tag: string;
};

type ParsedEntry = {
  product: string;
  quantity: number;
  amount: number;
  paymentType: PaymentMethod;
  isValid: boolean;
};

interface BusinessContextType {
  synced: boolean;
  toggleSync: () => void;
  transactions: Transaction[];
  inventory: InventoryItem[];
  phoneAlerts: PhoneAlert[];
  dismissPhoneAlert: (id: string) => void;
  aiInsights: AIInsight[];
  offlineQueue: Transaction[];
  todayRevenue: number;
  todaySalesCount: number;
  grossProfit: number;
  stockValue: number;
  lastSyncedTime: string;
  parseQuickEntry: (input: string) => ParsedEntry;
  addTransaction: (input: string) => { success: boolean; transaction?: Transaction };
  pushAlertToPhone: (title: string, message: string, type?: "reconciliation" | "low_stock" | "insight") => void;
  reorderProduct: (productId: string) => void;
}

const initialTransactions: Transaction[] = [
  { id: "tx-3", item: "Maggi · 5 units", quantity: 5, productName: "Maggi", detail: "Walk-in · Cash · 11:05 AM", amount: 75, amountFormatted: "+ ₹75", paymentType: "Cash", tone: "rust", timestamp: "11:05 AM" },
  { id: "tx-2", item: "Bread · 2 units", quantity: 2, productName: "Bread", detail: "Anita · Cash · 10:43 AM", amount: 80, amountFormatted: "+ ₹80", paymentType: "Cash", tone: "lime", timestamp: "10:43 AM" },
  { id: "tx-1", item: "Milk · 3 units", quantity: 3, productName: "Milk", detail: "Ramesh · UPI · 10:21 AM", amount: 180, amountFormatted: "+ ₹180", paymentType: "UPI", tone: "teal", timestamp: "10:21 AM" },
];

const initialInventory: InventoryItem[] = [
  { id: "p-maggi", name: "Maggi 2-Min", stock: 42, reorderLevel: 40, unitPrice: 15, category: "Instant Food" },
  { id: "p-milk", name: "Amul Milk 1L", stock: 85, reorderLevel: 30, unitPrice: 60, category: "Dairy" },
  { id: "p-bread", name: "Brown Bread", stock: 40, reorderLevel: 20, unitPrice: 40, category: "Bakery" },
  { id: "p-butter", name: "Amul Butter 100g", stock: 25, reorderLevel: 15, unitPrice: 60, category: "Dairy" },
  { id: "p-eggs", name: "Farm Eggs (Tray)", stock: 60, reorderLevel: 25, unitPrice: 180, category: "Grocery" },
];

const initialPhoneAlerts: PhoneAlert[] = [
  { id: "alert-1", title: "One payment to reconcile", message: "₹1,000 from Ramesh is missing on PC", type: "reconciliation", time: "10:30 AM" },
];

const BusinessContext = createContext<BusinessContextType | null>(null);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [synced, setSynced] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [phoneAlerts, setPhoneAlerts] = useState<PhoneAlert[]>(initialPhoneAlerts);
  const [offlineQueue, setOfflineQueue] = useState<Transaction[]>([]);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>("Just now");

  // Parse natural quick capture entry e.g. "5 Maggi 75 cash" or "3 Milk 180 UPI"
  const parseQuickEntry = useCallback((input: string): ParsedEntry => {
    const text = input.trim();
    if (!text) {
      return { product: "Item", quantity: 1, amount: 0, paymentType: "Cash", isValid: false };
    }

    const tokens = text.split(/\s+/);
    let quantity = 1;
    let amount = 0;
    let paymentType: PaymentMethod = "Cash";
    const productWords: string[] = [];

    tokens.forEach((token) => {
      const lower = token.toLowerCase();
      if (lower === "cash") paymentType = "Cash";
      else if (lower === "upi" || lower === "gpay" || lower === "paytm" || lower === "phonepe") paymentType = "UPI";
      else if (lower === "credit" || lower === "udhar") paymentType = "Credit";
      else if (lower === "card") paymentType = "Card";
      else if (/^\d+$/.test(token)) {
        const val = parseInt(token, 10);
        if (val > 0 && val <= 50 && quantity === 1) {
          quantity = val;
        } else {
          amount = val;
        }
      } else if (/^(?:₹|rs\.?|inr)?\d+$/i.test(token)) {
        amount = parseInt(token.replace(/\D/g, ""), 10);
      } else {
        productWords.push(token);
      }
    });

    let product = productWords.join(" ");
    if (!product) product = "General Item";

    // Auto calculate fallback amount if user only entered "5 Maggi cash"
    if (amount === 0) {
      const matched = initialInventory.find((i) => i.name.toLowerCase().includes(product.toLowerCase()));
      if (matched) {
        amount = matched.unitPrice * quantity;
      } else {
        amount = 50 * quantity;
      }
    }

    return { product, quantity, amount, paymentType, isValid: true };
  }, []);

  const pushAlertToPhone = useCallback((title: string, message: string, type: "reconciliation" | "low_stock" | "insight" = "low_stock") => {
    const newAlert: PhoneAlert = {
      id: `alert-${Date.now()}`,
      title,
      message,
      type,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setPhoneAlerts((prev) => [newAlert, ...prev]);
  }, []);

  const dismissPhoneAlert = useCallback((id: string) => {
    setPhoneAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const reorderProduct = useCallback((productId: string) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, stock: item.stock + 50 } : item))
    );
  }, []);

  const addTransaction = useCallback((input: string) => {
    const parsed = parseQuickEntry(input);
    if (!parsed.isValid) return { success: false };

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const tone: "lime" | "rust" | "teal" = parsed.paymentType === "UPI" ? "teal" : parsed.paymentType === "Cash" ? "lime" : "rust";

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      item: `${parsed.product} · ${parsed.quantity} unit${parsed.quantity > 1 ? "s" : ""}`,
      quantity: parsed.quantity,
      productName: parsed.product,
      detail: `Walk-in · ${parsed.paymentType} · ${timeStr}`,
      amount: parsed.amount,
      amountFormatted: `+ ₹${parsed.amount}`,
      paymentType: parsed.paymentType,
      tone,
      timestamp: timeStr,
      isNewSync: true,
    };

    if (synced) {
      // 1. Prepend to live transactions
      setTransactions((prev) => [newTx, ...prev.map((t) => ({ ...t, isNewSync: false }))]);

      // 2. Deduct Stock in Inventory & check low stock
      setInventory((prev) =>
        prev.map((item) => {
          if (item.name.toLowerCase().includes(parsed.product.toLowerCase())) {
            const newStock = Math.max(0, item.stock - parsed.quantity);
            if (newStock <= item.reorderLevel) {
              pushAlertToPhone(`Low Stock Warning: ${item.name}`, `Only ${newStock} units left! Reorder recommended.`, "low_stock");
            }
            return { ...item, stock: newStock };
          }
          return item;
        })
      );

      setLastSyncedTime(timeStr);
    } else {
      // Queue offline
      setOfflineQueue((prev) => [newTx, ...prev]);
    }

    return { success: true, transaction: newTx };
  }, [synced, parseQuickEntry, pushAlertToPhone]);

  const toggleSync = useCallback(() => {
    setSynced((prev) => {
      const nextState = !prev;
      if (nextState && offlineQueue.length > 0) {
        // Flush offline queue when reconnected
        setTransactions((prevTx) => [...offlineQueue, ...prevTx]);
        setOfflineQueue([]);
        setLastSyncedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      }
      return nextState;
    });
  }, [offlineQueue]);

  // Derived Business Metrics
  const todayRevenue = useMemo(() => {
    return transactions.reduce((acc, t) => acc + t.amount, 7190);
  }, [transactions]);

  const todaySalesCount = useMemo(() => {
    return transactions.reduce((acc, t) => acc + t.quantity, 60);
  }, [transactions]);

  const grossProfit = useMemo(() => {
    return Math.round(todayRevenue * 0.294);
  }, [todayRevenue]);

  const stockValue = useMemo(() => {
    return inventory.reduce((acc, i) => acc + i.stock * i.unitPrice, 0);
  }, [inventory]);

  // Dynamic AI Insights re-evaluated when sales occur
  const aiInsights = useMemo(() => {
    const lowStockItems = inventory.filter((i) => i.stock <= i.reorderLevel);
    const recentTxCount = transactions.length;

    const insights: AIInsight[] = [
      {
        id: "insight-1",
        title: recentTxCount > 3 ? "Sales velocity is peaking right now." : "Your milk margin is quietly improving.",
        what: `Captured ${recentTxCount} sales today totaling ₹${todayRevenue.toLocaleString()}.`,
        why: lowStockItems.length > 0 ? `${lowStockItems.map((i) => i.name).join(", ")} reached reorder threshold.` : "Purchase prices stayed flat, lifting overall net margin.",
        next: lowStockItems.length > 0 ? "Review low-stock alerts and push reorder notice to phone." : "Keep current shelf positioning for top sellers.",
        tag: "LIVE AI DECISION",
      },
    ];

    return insights;
  }, [inventory, transactions, todayRevenue]);

  const value = {
    synced,
    toggleSync,
    transactions,
    inventory,
    phoneAlerts,
    dismissPhoneAlert,
    aiInsights,
    offlineQueue,
    todayRevenue,
    todaySalesCount,
    grossProfit,
    stockValue,
    lastSyncedTime,
    parseQuickEntry,
    addTransaction,
    pushAlertToPhone,
    reorderProduct,
  };

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
}

export function useBusiness() {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error("useBusiness must be used within BusinessProvider");
  return ctx;
}
