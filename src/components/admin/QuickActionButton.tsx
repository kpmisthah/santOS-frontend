interface QuickActionButtonProps {
  icon: string;
  label: string;
  variant: 'primary' | 'purple' | 'warning' | 'success' | 'danger';
  onClick: () => void;
}

const QuickActionButton = ({ icon, label, variant, onClick }: QuickActionButtonProps) => {
  const variantClasses = {
    primary: 'from-cyan-500 to-blue-600 shadow-cyan-900/50',
    purple: 'from-purple-500 to-pink-600 shadow-purple-900/50',
    warning: 'from-orange-500 to-red-600 shadow-orange-900/50',
    success: 'from-green-500 to-emerald-600 shadow-green-900/50',
    danger: 'from-red-500 to-rose-600 shadow-red-900/50',
  };

  return (
    <button
      onClick={onClick}
      className={`group flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r ${variantClasses[variant]} rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all`}
    >
      <span className="text-2xl group-hover:rotate-12 transition-transform">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export default QuickActionButton;
