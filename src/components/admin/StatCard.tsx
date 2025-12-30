import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  variant: 'primary' | 'purple' | 'warning' | 'success' | 'danger' | 'orange';
}

const StatCard = ({ icon: Icon, label, value, variant }: StatCardProps) => {
  const variants = {
    primary: {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      border: 'border-cyan-500/20'
    },
    purple: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/20'
    },
    success: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20'
    },
    warning: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/20'
    },
    danger: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/20'
    },
    orange: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      border: 'border-orange-500/20'
    }
  };

  const style = variants[variant] || variants.primary;

  return (
    <div className={`p-6 rounded-2xl border backdrop-blur-sm transition-all hover:scale-105 ${style.bg} ${style.border}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-background/50 ${style.text}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-foreground font-display">
          {value.toLocaleString()}
        </h3>
      </div>
    </div>
  );
};

export default StatCard;
