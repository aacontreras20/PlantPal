type HealthBarProps = {
  value: number;
  color?: 'blue' | 'amber' | 'green' | 'neutral';
  size?: 'sm' | 'md';
  showValue?: boolean;
};

export function HealthBar({ value, color = 'green', size = 'md', showValue = false }: HealthBarProps) {
  const colorClasses = {
    blue: 'bg-blue-600',
    amber: 'bg-amber-600',
    green: 'bg-green-600',
    neutral: 'bg-neutral-600',
  };

  const bgColorClasses = {
    blue: 'bg-blue-100',
    amber: 'bg-amber-100',
    green: 'bg-green-100',
    neutral: 'bg-neutral-100',
  };

  const height = size === 'sm' ? 'h-1.5' : 'h-2';

  return (
    <div className="flex-1 flex items-center gap-2">
      <div className={`flex-1 ${bgColorClasses[color]} rounded-full ${height} overflow-hidden`}>
        <div
          className={`${colorClasses[color]} ${height} rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showValue && (
        <span className="text-sm text-neutral-600 w-10 text-right">
          {Math.round(value)}%
        </span>
      )}
    </div>
  );
}
