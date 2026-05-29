export type Category = 'utilities' | 'subscriptions' | 'insurance' | 'rent' | 'loans' | 'other';
export type Recurrence = 'weekly' | 'monthly' | 'yearly';
export type BillStatus = 'paid' | 'overdue' | 'due-soon' | 'upcoming';

export interface Payment {
  id: string;
  billId: string;
  paidDate: string;
  amount: number;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  /** For monthly/yearly: day of month (1–31). For weekly: day of week (1=Mon … 7=Sun). */
  dueDayOfMonth: number;
  /** For yearly bills only: month (1–12). */
  dueMonth?: number;
  category: Category;
  recurrence: Recurrence;
  notes?: string;
  payments: Payment[];
}
