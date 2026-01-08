import React from 'react';

interface StatusIndicatorProps {
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  const statusConfig = {
    active: {
      color: 'bg-green-500',
      text: 'Active',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
    },
    suspended: {
      color: 'bg-red-500',
      text: 'Suspended',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
    },
    pending: {
      color: 'bg-yellow-500',
      text: 'Pending',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
    },
    inactive: {
      color: 'bg-gray-400',
      text: 'Inactive',
      textColor: 'text-gray-700',
      bgColor: 'bg-gray-50',
    },
  };

  const sizes = {
    sm: {
      dot: 'h-2 w-2',
      text: 'text-xs',
      padding: 'px-2 py-1',
    },
    md: {
      dot: 'h-3 w-3',
      text: 'text-sm',
      padding: 'px-3 py-1.5',
    },
    lg: {
      dot: 'h-4 w-4',
      text: 'text-base',
      padding: 'px-4 py-2',
    },
  };

  const config = statusConfig[status];
  const sizeConfig = sizes[size];

  if (!showLabel) {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <span className={`${sizeConfig.dot} ${config.color} rounded-full`} />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center ${sizeConfig.padding} ${config.bgColor} rounded-full ${className}`}
    >
      <span className={`${sizeConfig.dot} ${config.color} rounded-full mr-2`} />
      <span className={`${sizeConfig.text} ${config.textColor} font-medium`}>
        {config.text}
      </span>
    </div>
  );
};

export default StatusIndicator;
