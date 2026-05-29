import type { Bill } from './types';

const KEY = 'remindme_bills';

export function loadBills(): Bill[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Bill[];
  } catch {
    return [];
  }
}

export function saveBills(bills: Bill[]): void {
  localStorage.setItem(KEY, JSON.stringify(bills));
}
