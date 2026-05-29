import type { Bill, BillStatus } from '../types';
import { getBillStatus, nextDueDate, formatCurrency, formatDate, CATEGORY_LABELS } from '../utils';

interface BillCardProps {
  bill: Bill;
  onEdit: (bill: Bill) => void;
  onDelete: (id: string) => void;
  onTogglePaid: (bill: Bill) => void;
}

const STATUS_STYLES: Record<BillStatus, { card: string; badge: string; label: string }> = {
  overdue: {
    card: 'border-red-200 bg-red-50',
    badge: 'bg-red-100 text-red-700',
    label: 'Overdue',
  },
  'due-soon': {
    card: 'border-amber-200 bg-amber-50',
    badge: 'bg-amber-100 text-amber-700',
    label: 'Due Soon',
  },
  paid: {
    card: 'border-green-200 bg-green-50',
    badge: 'bg-green-100 text-green-700',
    label: 'Paid',
  },
  upcoming: {
    card: 'border-slate-200 bg-white',
    badge: 'bg-slate-100 text-slate-600',
    label: 'Upcoming',
  },
};

export function BillCard({ bill, onEdit, onDelete, onTogglePaid }: BillCardProps) {
  const now = new Date();
  const status = getBillStatus(bill, now);
  const dueDate = nextDueDate(bill, now);
  const styles = STATUS_STYLES[status];

  return (
    <div className={`rounded-xl border-2 p-4 ${styles.card} transition-all`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-slate-800 truncate">{bill.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles.badge}`}>
              {styles.label}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
              {CATEGORY_LABELS[bill.category]}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-sm text-slate-600 flex-wrap">
            <span className="font-bold text-slate-800 text-base">{formatCurrency(bill.amount)}</span>
            <span>Due {formatDate(dueDate)}</span>
            <span className="capitalize">{bill.recurrence}</span>
          </div>
          {bill.notes && (
            <p className="mt-1 text-xs text-slate-500 truncate">{bill.notes}</p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onTogglePaid(bill)}
            title={status === 'paid' ? 'Mark unpaid' : 'Mark paid'}
            className={`p-2 rounded-lg text-sm transition-colors ${
              status === 'paid'
                ? 'bg-green-200 text-green-700 hover:bg-green-300'
                : 'bg-white text-slate-500 hover:bg-green-100 hover:text-green-700 border border-slate-200'
            }`}
          >
            ✓
          </button>
          <button
            onClick={() => onEdit(bill)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors border border-transparent"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(bill.id)}
            className="p-2 rounded-lg text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors border border-transparent"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
