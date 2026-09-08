// Utility for number & currency formatting

const BENGALI_DIGITS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export function convertToBengaliDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (match) => BENGALI_DIGITS[match] || match);
}

export function formatNumber(
  num: number | undefined | null,
  decimals: number = 0,
  useBengaliDigits: boolean = false
): string {
  if (num === undefined || num === null || isNaN(num)) {
    num = 0;
  }

  // Format with standard locale commas
  const fixed = num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (useBengaliDigits) {
    return convertToBengaliDigits(fixed);
  }

  return fixed;
}

export function formatCurrency(
  amount: number | undefined | null,
  symbol: string = '৳',
  decimals: number = 0,
  useBengaliDigits: boolean = false
): string {
  const formattedVal = formatNumber(amount, decimals, useBengaliDigits);
  return `${symbol}${formattedVal}`;
}

export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateInvoiceNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}${month}${day}-${randomSuffix}`;
}

export function generateItemId(): string {
  return `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

export function generatePaymentId(): string {
  return `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}
