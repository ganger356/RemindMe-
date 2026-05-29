import type { Bill, BillStatus } from './types';

/** Returns the start of the current billing cycle window. */
export function cycleStart(bill: Bill, now: Date): Date {
  const y = now.getFullYear();
  const m = now.getMonth();

  if (bill.recurrence === 'monthly') {
    return new Date(y, m, 1);
  }
  if (bill.recurrence === 'yearly') {
    return new Date(y, 0, 1);
  }
  // weekly: start of current week (Monday)
  const d = new Date(now);
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Returns the due date for the bill within the current cycle. */
export function nextDueDate(bill: Bill, now = new Date()): Date {
  const y = now.getFullYear();
  const m = now.getMonth();

  if (bill.recurrence === 'monthly') {
    const lastDay = new Date(y, m + 1, 0).getDate();
    const day = Math.min(bill.dueDayOfMonth, lastDay);
    return new Date(y, m, day);
  }

  if (bill.recurrence === 'yearly') {
    const month = (bill.dueMonth ?? 1) - 1;
    const lastDay = new Date(y, month + 1, 0).getDate();
    const day = Math.min(bill.dueDayOfMonth, lastDay);
    return new Date(y, month, day);
  }

  // weekly: find next occurrence of the target weekday
  // dueDayOfMonth: 1=Mon … 7=Sun
  const targetDay = bill.dueDayOfMonth % 7; // convert to JS getDay() (0=Sun)
  const start = cycleStart(bill, now);
  const startDay = start.getDay();
  let diff = targetDay - startDay;
  if (diff < 0) diff += 7;
  return new Date(start.getFullYear(), start.getMonth(), start.getDate() + diff);
}

/** True if bill has a payment recorded in the current cycle. */
export function isPaidThisCycle(bill: Bill, now = new Date()): boolean {
  const start = cycleStart(bill, now);
  return bill.payments.some((p) => new Date(p.paidDate) >= start);
}

/** Compute the display status of a bill. */
export function getBillStatus(bill: Bill, now = new Date()): BillStatus {
  if (isPaidThisCycle(bill, now)) return 'paid';
  const due = nextDueDate(bill, now);
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / 86_400_000);
  if (diffDays < 0) return 'overdue';
  if (diffDays <= 7) return 'due-soon';
  return 'upcoming';
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export const CATEGORY_LABELS: Record<string, string> = {
  utilities: 'Utilities',
  subscriptions: 'Subscriptions',
  insurance: 'Insurance',
  rent: 'Rent',
  loans: 'Loans',
  other: 'Other',
};

export const WEEKDAY_LABELS = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const MONTH_LABELS = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
