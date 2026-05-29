import { useState, useEffect } from 'react';
import type { Bill, Category, Recurrence } from '../types';
import { CATEGORY_LABELS, WEEKDAY_LABELS, MONTH_LABELS } from '../utils';

interface BillFormProps {
  bill?: Bill | null;
  onSave: (bill: Omit<Bill, 'id' | 'payments'> & { id?: string }) => void;
  onClose: () => void;
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];
const RECURRENCES: Recurrence[] = ['monthly', 'weekly', 'yearly'];

function emptyForm() {
  return {
    name: '',
    amount: '',
    dueDayOfMonth: '1',
    dueMonth: '1',
    category: 'utilities' as Category,
    recurrence: 'monthly' as Recurrence,
    notes: '',
  };
}

export function BillForm({ bill, onSave, onClose }: BillFormProps) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (bill) {
      setForm({
        name: bill.name,
        amount: String(bill.amount),
        dueDayOfMonth: String(bill.dueDayOfMonth),
        dueMonth: String(bill.dueMonth ?? 1),
        category: bill.category,
        recurrence: bill.recurrence,
        notes: bill.notes ?? '',
      });
    } else {
      setForm(emptyForm());
    }
  }, [bill]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    const dueDayOfMonth = parseInt(form.dueDayOfMonth, 10);
    if (!form.name.trim() || isNaN(amount) || amount <= 0 || isNaN(dueDayOfMonth)) return;

    onSave({
      ...(bill?.id ? { id: bill.id } : {}),
      name: form.name.trim(),
      amount,
      dueDayOfMonth,
      dueMonth: form.recurrence === 'yearly' ? parseInt(form.dueMonth, 10) : undefined,
      category: form.category,
      recurrence: form.recurrence,
      notes: form.notes.trim() || undefined,
    });
  }

  const isEditing = !!bill;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditing ? 'Edit Bill' : 'Add New Bill'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none p-1"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 flex flex-col gap-4">
          <Field label="Bill Name">
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Internet Service"
              className={INPUT}
            />
          </Field>

          <Field label="Amount ($)">
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(e) => set('amount', e.target.value)}
              placeholder="0.00"
              className={INPUT}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value as Category)}
                className={INPUT}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </Field>

            <Field label="Recurrence">
              <select
                value={form.recurrence}
                onChange={(e) => set('recurrence', e.target.value as Recurrence)}
                className={INPUT}
              >
                {RECURRENCES.map((r) => (
                  <option key={r} value={r} className="capitalize">{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
            </Field>
          </div>

          {form.recurrence === 'weekly' && (
            <Field label="Due on">
              <select
                value={form.dueDayOfMonth}
                onChange={(e) => set('dueDayOfMonth', e.target.value)}
                className={INPUT}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <option key={d} value={d}>{WEEKDAY_LABELS[d]}</option>
                ))}
              </select>
            </Field>
          )}

          {form.recurrence === 'monthly' && (
            <Field label="Due on day of month">
              <input
                type="number"
                required
                min="1"
                max="28"
                value={form.dueDayOfMonth}
                onChange={(e) => set('dueDayOfMonth', e.target.value)}
                className={INPUT}
              />
              <p className="text-xs text-slate-400 mt-1">Use 1–28 to ensure the date exists every month.</p>
            </Field>
          )}

          {form.recurrence === 'yearly' && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Month">
                <select
                  value={form.dueMonth}
                  onChange={(e) => set('dueMonth', e.target.value)}
                  className={INPUT}
                >
                  {MONTH_LABELS.slice(1).map((m, i) => (
                    <option key={i + 1} value={i + 1}>{m}</option>
                  ))}
                </select>
              </Field>
              <Field label="Day">
                <input
                  type="number"
                  required
                  min="1"
                  max="28"
                  value={form.dueDayOfMonth}
                  onChange={(e) => set('dueDayOfMonth', e.target.value)}
                  className={INPUT}
                />
              </Field>
            </div>
          )}

          <Field label="Notes (optional)">
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Any additional details…"
              rows={2}
              className={INPUT + ' resize-none'}
            />
          </Field>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium transition-colors"
            >
              {isEditing ? 'Save Changes' : 'Add Bill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

const INPUT =
  'w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 text-slate-800';
