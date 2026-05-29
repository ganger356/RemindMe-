import { useState, useCallback } from 'react';
import type { Bill } from './types';
import { loadBills, saveBills } from './storage';
import { cycleStart } from './utils';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { BillList } from './components/BillList';
import { BillForm } from './components/BillForm';

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function App() {
  const [bills, setBills] = useState<Bill[]>(() => loadBills());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bills'>('dashboard');
  const [formOpen, setFormOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  function persist(updated: Bill[]) {
    setBills(updated);
    saveBills(updated);
  }

  function handleSave(data: Omit<Bill, 'id' | 'payments'> & { id?: string }) {
    if (data.id) {
      persist(bills.map((b) => (b.id === data.id ? { ...b, ...data, id: b.id, payments: b.payments } : b)));
    } else {
      const newBill: Bill = { ...data, id: generateId(), payments: [] };
      persist([...bills, newBill]);
    }
    setFormOpen(false);
    setEditingBill(null);
  }

  function handleDelete(id: string) {
    if (confirm('Delete this bill? This cannot be undone.')) {
      persist(bills.filter((b) => b.id !== id));
    }
  }

  const handleTogglePaid = useCallback(
    (bill: Bill) => {
      const now = new Date();
      const start = cycleStart(bill, now);
      const alreadyPaid = bill.payments.some((p) => new Date(p.paidDate) >= start);

      const updated = alreadyPaid
        ? { ...bill, payments: bill.payments.filter((p) => new Date(p.paidDate) < start) }
        : {
            ...bill,
            payments: [
              ...bill.payments,
              { id: generateId(), billId: bill.id, paidDate: now.toISOString(), amount: bill.amount },
            ],
          };

      persist(bills.map((b) => (b.id === bill.id ? updated : b)));
    },
    [bills],
  );

  function openAdd() {
    setEditingBill(null);
    setFormOpen(true);
  }

  function openEdit(bill: Bill) {
    setEditingBill(bill);
    setFormOpen(true);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} onAddBill={openAdd} />

      {activeTab === 'dashboard' ? (
        <Dashboard
          bills={bills}
          onAddBill={openAdd}
          onEditBill={openEdit}
          onDeleteBill={handleDelete}
          onTogglePaid={handleTogglePaid}
        />
      ) : (
        <BillList
          bills={bills}
          onAddBill={openAdd}
          onEditBill={openEdit}
          onDeleteBill={handleDelete}
          onTogglePaid={handleTogglePaid}
        />
      )}

      {formOpen && (
        <BillForm
          bill={editingBill}
          onSave={handleSave}
          onClose={() => {
            setFormOpen(false);
            setEditingBill(null);
          }}
        />
      )}
    </div>
  );
}
