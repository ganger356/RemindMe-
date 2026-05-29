interface EmptyStateProps {
  onAddBill: () => void;
  message?: string;
}

export function EmptyState({ onAddBill, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">🧾</div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">
        {message ?? 'No bills yet'}
      </h3>
      <p className="text-slate-500 text-sm mb-6 max-w-xs">
        {message
          ? 'Try adjusting your filters.'
          : 'Add your first bill to start tracking payments and stay on top of due dates.'}
      </p>
      {!message && (
        <button
          onClick={onAddBill}
          className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          Add Your First Bill
        </button>
      )}
    </div>
  );
}
