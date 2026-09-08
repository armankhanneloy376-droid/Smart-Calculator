export type Language = 'en' | 'bn';

export type CostCategory =
  | 'Product'
  | 'Delivery'
  | 'Packaging'
  | 'Labor'
  | 'Service'
  | 'Marketing'
  | 'Tax'
  | 'Commission'
  | 'Other';

export interface CostItem {
  id: string;
  description: string;
  category: string; // can be predefined or custom
  quantity: number;
  unitCost: number;
}

export type PaymentMethod =
  | 'Cash'
  | 'bKash'
  | 'Nagad'
  | 'Bank'
  | 'Card'
  | 'Other';

export interface PaymentRecord {
  id: string;
  date: string;
  method: PaymentMethod | string;
  amount: number;
  reference: string;
  notes: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  invoiceNumber: string;
  date: string;
  notes: string;
}

export interface PaymentDetails {
  sellingPrice: number;
  discount: number;
  tax: number;
  additionalCost: number; // Additional costs/charges to cost
  additionalCharge: number; // Additional charges to bill
  manualPaidAmount?: number; // fallback if user enters paid directly without payment records
}

export interface BusinessSettings {
  businessName: string;
  businessPhone: string;
  businessAddress: string;
  currencySymbol: string;
  currencyCode: string;
  decimalPlaces: number;
  useBengaliNumerals: boolean;
}

export interface CalculationHistoryItem {
  id: string;
  savedAt: string;
  customerInfo: CustomerInfo;
  costItems: CostItem[];
  payments: PaymentRecord[];
  paymentDetails: PaymentDetails;
  totals: {
    subtotalCost: number;
    finalCost: number;
    sellingPrice: number;
    discount: number;
    tax: number;
    additionalCharge: number;
    finalBill: number;
    paidAmount: number;
    dueAmount: number;
    profit: number;
    profitMargin: number;
  };
}
