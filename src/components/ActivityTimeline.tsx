interface ActivityItem {
  id: string;
  label: string;
  timestamp: string;
}

export const ActivityTimeline = ({ items }: { items: ActivityItem[] }) => (
  <div className="card p-5">
    <div className="mb-5">
      <h2 className="text-lg font-semibold text-slate-950">Activity Timeline</h2>
      <p className="text-sm text-slate-500">Latest movement across your search.</p>
    </div>
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex gap-3">
          <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-600 ring-4 ring-primary-50" />
          <div>
            <p className="text-sm font-medium text-slate-900">{item.label}</p>
            <p className="text-xs text-slate-500">{item.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
