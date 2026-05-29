interface HeaderProps {
  activeTab: 'dashboard' | 'bills';
  onTabChange: (tab: 'dashboard' | 'bills') => void;
  onAddBill: () => void;
}

export function Header({ activeTab, onTabChange, onAddBill }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔔</span>
            <h1 className="text-2xl font-bold text-violet-700 tracking-tight">RemindMe!</h1>
          </div>
          <nav className="flex gap-1">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-violet-100 text-violet-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onTabChange('bills')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'bills'
                  ? 'bg-violet-100 text-violet-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Bills
            </button>
          </nav>
          <button
            onClick={onAddBill}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
          >
            <span className="text-lg leading-none">+</span> Add Bill
          </button>
        </div>
      </div>
    </header>
  );
}
