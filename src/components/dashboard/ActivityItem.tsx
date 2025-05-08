import React from 'react';

interface ActivityItemProps {
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  status?: 'success' | 'warning' | 'error' | 'info';
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  title,
  description,
  timestamp,
  icon,
  status = 'info',
}) => {
  const statusClasses = {
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    error: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600',
  };

  return (
    <div className="flex items-start space-x-4 p-4 border-b border-gray-100 last:border-b-0">
      <div className={`p-2 rounded-full ${statusClasses[status]}`}>
        {icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      
      <div className="flex-shrink-0 text-xs text-gray-500">
        {timestamp}
      </div>
    </div>
  );
};

export default ActivityItem;