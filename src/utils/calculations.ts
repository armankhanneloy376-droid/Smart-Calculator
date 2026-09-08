import { CostItem, PaymentRecord, PaymentDetails } from '../types';

export interface CalculationResults {
  subtotalCost: number;
  finalCost: number;
  sellingPrice: number;
  discount: number;
  tax: number;
  additionalCost: number;
  additionalCharge: number;
  finalBill: number;
  paidAmount: number;
  dueAmount: number;
  overpaidAmount: number;
  profit: number;
  profitMargin: number;
  isProfit: boolean;
  isBreakEven: boolean;
  isLoss: boolean;
  isOverpaid: boolean;
}

/**
 * Safely parses any value to a non-negative finite number.
 */
export function sanitizeNumber(value: unknown): number {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  const parsed = typeof value === 'number' ? value : parseFloat(String(value));
  if (isNaN(parsed) || !isFinite(parsed) || parsed < 0) {
    return 0;
  }
  return parsed;
}

/**
 * Calculates row total for an individual cost item
 */
export function calculateItemTotal(item: CostItem): number {
  const qty = sanitizeNumber(item.quantity);
  const cost = sanitizeNumber(item.unitCost);
  return Math.round(qty * cost * 100) / 100;
}

/**
 * Calculates sum of all payments recorded in the payment history
 */
export function calculateTotalPayments(payments: PaymentRecord[]): number {
  return payments.reduce((acc, p) => acc + sanitizeNumber(p.amount), 0);
}

/**
 * Computes all totals strictly conforming to business calculator formulas.
 */
export function computeTotals(
  costItems: CostItem[],
  details: PaymentDetails,
  payments: PaymentRecord[]
): CalculationResults {
  // 1. Subtotal Cost = Sum of (Qty * UnitCost) of each cost item
  const subtotalCost = costItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  // 2. Final Cost = Subtotal Cost + Additional Direct Costs
  const additionalCost = sanitizeNumber(details.additionalCost);
  const finalCost = subtotalCost + additionalCost;

  // 3. Billing fields
  const sellingPrice = sanitizeNumber(details.sellingPrice);
  const discount = sanitizeNumber(details.discount);
  const tax = sanitizeNumber(details.tax);
  const additionalCharge = sanitizeNumber(details.additionalCharge);

  // 4. Final Bill = Selling Price - Discount + Tax/VAT + Additional Charge
  // Clamped to 0 to prevent negative billing
  const rawFinalBill = sellingPrice - discount + tax + additionalCharge;
  const finalBill = Math.max(0, rawFinalBill);

  // 5. Paid Amount: Sum of payment records. If no records exist but manualPaidAmount was typed, use that.
  const recordedPayments = calculateTotalPayments(payments);
  const paidAmount = payments.length > 0 
    ? recordedPayments 
    : sanitizeNumber(details.manualPaidAmount);

  // 6. Due Amount: Final Bill - Paid Amount
  // If paid > finalBill, due is 0 and overpaid is difference
  const dueAmount = Math.max(0, finalBill - paidAmount);
  const overpaidAmount = Math.max(0, paidAmount - finalBill);
  const isOverpaid = paidAmount > finalBill;

  // 7. Profit = Final Bill - Final Cost
  const profit = finalBill - finalCost;

  // 8. Profit Margin = (Profit / Final Bill) * 100
  let profitMargin = 0;
  if (finalBill > 0) {
    profitMargin = Math.round((profit / finalBill) * 10000) / 100; // rounded to 2 decimal places
  }

  const isBreakEven = profit === 0;
  const isProfit = profit > 0;
  const isLoss = profit < 0;

  return {
    subtotalCost,
    finalCost,
    sellingPrice,
    discount,
    tax,
    additionalCost,
    additionalCharge,
    finalBill,
    paidAmount,
    dueAmount,
    overpaidAmount,
    profit,
    profitMargin,
    isProfit,
    isBreakEven,
    isLoss,
    isOverpaid,
  };
}

/**
 * Test case verification conforming to Section 19 of user prompt:
 * Product: Qty 10, Unit ৳500 = ৳5,000
 * Delivery: Qty 1, Unit ৳120 = ৳120
 * Packaging: Qty 10, Unit ৳20 = ৳200
 * Service: Qty 1, Unit ৳100 = ৳100
 * Subtotal = ৳5,420
 * Selling = ৳8,000, Discount = ৳200, Tax = ৳0 => Final Bill = ৳7,800
 * Paid = ৳5,000 => Due = ৳2,800
 * Profit = ৳7,800 - ৳5,420 = ৳2,380
 * Profit Margin = 30.51%
 */
export function getExampleData() {
  const exampleCostItems: CostItem[] = [
    {
      id: 'req19_1',
      description: 'Product',
      category: 'Product',
      quantity: 10,
      unitCost: 500,
    },
    {
      id: 'req19_2',
      description: 'Delivery',
      category: 'Delivery',
      quantity: 1,
      unitCost: 120,
    },
    {
      id: 'req19_3',
      description: 'Packaging',
      category: 'Packaging',
      quantity: 10,
      unitCost: 20,
    },
    {
      id: 'req19_4',
      description: 'Service',
      category: 'Service',
      quantity: 1,
      unitCost: 100,
    },
  ];

  const examplePaymentDetails: PaymentDetails = {
    sellingPrice: 8000,
    discount: 200,
    tax: 0,
    additionalCost: 0,
    additionalCharge: 0,
    manualPaidAmount: 5000,
  };

  const examplePayments: PaymentRecord[] = [
    {
      id: 'pay_example_1',
      date: new Date().toISOString().split('T')[0],
      method: 'bKash',
      amount: 5000,
      reference: 'TRX-9482711',
      notes: 'Initial advance payment',
    },
  ];

  return {
    customerInfo: {
      name: 'Rahim Uddin',
      phone: '01712-345678',
      invoiceNumber: 'INV-SAMPLE-REQ19',
      date: new Date().toISOString().split('T')[0],
      notes: 'Standard business order with separate cost items and advance payment.',
    },
    costItems: exampleCostItems,
    paymentDetails: examplePaymentDetails,
    payments: examplePayments,
  };
}
