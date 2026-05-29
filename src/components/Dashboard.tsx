import type { Bill } from '../types';
import { getBillStatus, nextDueDate } from '../utils';
import { SummaryStats } from './SummaryStats';
import { BillCard } from './BillCard';
import { EmptyState } from './EmptyState';

interface DashboardProps {
  bills: Bill[];
  onAddBill: () => void;
  onEditBill: (bill: Bill) => void;
  onDeleteBill: (id: string) => void;
  onTogglePaid: (bill: Bill) => void;
}

export function Dashboard({ bills, onAddBill, onEditBill, onDeleteBill, onTogglePaid }: DashboardProps) {
  const now = new Date();

  const sorted = [...bills].sort(
    (a, b) => nextDueDate(a, now).getTime() - nextDueDate(b, now).getTime(),
  );

  const overdue = sorted.filter((b) => getBillStatus(b, now) === 'overdue');
  const dueSoon = sorted.filter((b) => getBillStatus(b, now) === 'due-soon');
  const upcoming = sorted.filter((b) => getBillStatus(b, now) === 'upcoming');
  const paid = sorted.filter((b) => getBillStatus(b, now) === 'paid');

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <SummaryStats bills={bills} />

      {bills.length === 0 && <EmptyState onAddBill={onAddBill} />}

      {overdue.length > 0 && (
        <Section title="⚠️ Overdue" count={overdue.length}>
          {overdue.map((b) => (
            <BillCard key={b.id} bill={b} onEdit={onEditBill} onDelete={onDeleteBill} onTogglePaid={onTogglePaid} />
          ))}
        </Section>
      )}

      {dueSoon.length > 0 && (
        <Section title="🔔 Due Soon" count={dueSoon.length} subtitle="within 7 days">
          {dueSoon.map((b) => (
            <BillCard key={b.id} bill={b} onEdit={onEditBill} onDelete={onDeleteBill} onTogglePaid={onTogglePaid} />
          ))}
        </Section>
      )}

      {upcoming.length > 0 && (
        <Section title="📅 Upcoming" count={upcoming.length}>
          {upcoming.map((b) => (
            <BillCard key={b.id} bill={b} onEdit={onEditBill} onDelete={onDeleteBill} onTogglePaid={onTogglePaid} />
          ))}
        </Section>
      )}

      {paid.length > 0 && (
        <Section title="✅ Paid This Period" count={paid.length}>
          {paid.map((b) => (
            <BillCard key={b.id} bill={b} onEdit={onEditBill} onDelete={onDeleteBill} onTogglePaid={onTogglePaid} />
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  count,
  subtitle,
  children,
}: {
  title: string;
  count: number;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-baseline gap-2 mb-3">
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        <span className="text-sm text-slate-500">
          {count} {count === 1 ? 'bill' : 'bills'}{subtitle ? ` · ${subtitle}` : ''}
        </span>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
