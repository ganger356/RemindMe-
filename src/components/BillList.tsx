import { useState } from 'react';
import type { Bill, Category, BillStatus } from '../types';
import { getBillStatus, nextDueDate, CATEGORY_LABELS } from '../utils';
import { BillCard } from './BillCard';
import { EmptyState } from './EmptyState';

interface BillListProps {
  bills: Bill[];
  onAddBill: () => void;
  onEditBill: (bill: Bill) => void;
  onDeleteBill: (id: string) => void;
  onTogglePaid: (bill: Bill) => void;
}

const STATUS_OPTIONS: { value: BillStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'due-soon', label: 'Due Soon' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'paid', label: 'Paid' },
];

const CATEGORY_OPTIONS: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
    value: value as Category,
    label,
  })),
];

export function BillList({ bills, onAddBill, onEditBill, onDeleteBill, onTogglePaid }: BillListProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BillStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');

  const now = new Date();

  const filtered = bills
    .filter((b) => b.name.toLowerCase().includes(search.toLowerCase()))
    .filter((b) => statusFilter === 'all' || getBillStatus(b, now) === statusFilter)
    .filter((b) => categoryFilter === 'all' || b.category === categoryFilter)
    .sort((a, b) => nextDueDate(a, now).getTime() - nextDueDate(b, now).getTime());

  const hasFilters = search !== '' || statusFilter !== 'all' || categoryFilter !== 'all';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search bills…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as BillStatus | 'all')}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as Category | 'all')}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          {CATEGORY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {bills.length === 0 ? (
        <EmptyState onAddBill={onAddBill} />
      ) : filtered.length === 0 ? (
        <EmptyState onAddBill={onAddBill} message="No bills match your filters." />
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-4">
            {filtered.length} {filtered.length === 1 ? 'bill' : 'bills'}
            {hasFilters ? ' matching filters' : ' total'}
          </p>
          <div className="flex flex-col gap-3">
            {filtered.map((b) => (
              <BillCard
                key={b.id}
                bill={b}
                onEdit={onEditBill}
                onDelete={onDeleteBill}
                onTogglePaid={onTogglePaid}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
