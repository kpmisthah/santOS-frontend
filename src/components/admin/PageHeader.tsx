import { ReactNode } from 'react';

interface PageHeaderProps {
  badge?: {
    icon: ReactNode;
    text: string;
  };
  title: string;
  description: string;
  actions?: ReactNode;
}

const PageHeader = ({ badge, title, description, actions }: PageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        {badge && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400 mb-4">
            {badge.icon}
            <span>{badge.text}</span>
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
            {title}
          </span>
        </h1>

        <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>

      {actions && (
        <div className="flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
