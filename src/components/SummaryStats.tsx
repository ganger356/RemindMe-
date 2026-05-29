import type { Bill } from '../types';
import { getBillStatus, isPaidThisCycle, formatCurrency } from '../utils';

interface SummaryStatsProps {
  bills: Bill[];
}

export function SummaryStats({ bills }: SummaryStatsProps) {
  const now = new Date();
  const totalDue = bills.reduce((sum, b) => {
    const status = getBillStatus(b, now);
    if (status !== 'paid') return sum + b.amount;
    return sum;
  }, 0);

  const totalPaid = bills.reduce((sum, b) => {
    if (isPaidThisCycle(b, now)) return sum + b.amount;
    return sum;
  }, 0);

  const overdueCount = bills.filter((b) => getBillStatus(b, now) === 'overdue').length;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total Due</p>
        <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(totalDue)}</p>
        <p className="text-xs text-slate-400 mt-0.5">this period</p>
      </div>
      <div className="bg-white rounded-xl border border-green-200 p-4 text-center shadow-sm">
        <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Paid</p>
        <p className="text-2xl font-bold text-green-700 mt-1">{formatCurrency(totalPaid)}</p>
        <p className="text-xs text-slate-400 mt-0.5">this period</p>
      </div>
      <div className={`rounded-xl border p-4 text-center shadow-sm ${overdueCount > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
        <p className={`text-xs font-medium uppercase tracking-wide ${overdueCount > 0 ? 'text-red-600' : 'text-slate-500'}`}>Overdue</p>
        <p className={`text-2xl font-bold mt-1 ${overdueCount > 0 ? 'text-red-700' : 'text-slate-400'}`}>{overdueCount}</p>
        <p className="text-xs text-slate-400 mt-0.5">{overdueCount === 1 ? 'bill' : 'bills'}</p>
      </div>
    </div>
  );
}
