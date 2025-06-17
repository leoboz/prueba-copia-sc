
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StandardPageHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  children?: React.ReactNode;
  backgroundGradient?: string;
}

const StandardPageHeader: React.FC<StandardPageHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  children,
  backgroundGradient = "from-navy-900 via-navy-800 to-navy-900"
}) => {
  return (
    <div className={`bg-gradient-to-r ${backgroundGradient} rounded-3xl p-8 mb-8 shadow-2xl`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center space-x-4 mb-6 lg:mb-0">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
            <Icon className="h-8 w-8 text-white drop-shadow-sm" />
          </div>
          <div>
            <h1 className="text-4xl font-serif text-white font-bold drop-shadow-sm">
              {title}
            </h1>
            <p className="text-navy-200/90 text-lg font-medium">
              {subtitle}
            </p>
          </div>
        </div>
        {children && (
          <div className="flex-shrink-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default StandardPageHeader;
