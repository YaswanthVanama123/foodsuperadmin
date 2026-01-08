import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { FileText, TrendingUp, Users, CreditCard } from 'lucide-react';

export type ReportType = 'revenue' | 'restaurant-performance' | 'subscription' | 'user-activity';

interface ReportCardProps {
  type: ReportType;
  title: string;
  description: string;
  icon: React.ReactNode;
  onGenerate: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
  title,
  description,
  icon,
  onGenerate,
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {description}
            </p>
            <Button size="sm" onClick={onGenerate}>
              Generate Report
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const getReportConfig = (type: ReportType) => {
  const configs = {
    revenue: {
      title: 'Revenue Report',
      description: 'Comprehensive revenue analysis including subscriptions, transactions, and growth trends.',
      icon: <TrendingUp className="h-6 w-6" />,
    },
    'restaurant-performance': {
      title: 'Restaurant Performance Report',
      description: 'Detailed performance metrics for all restaurants including engagement and subscription status.',
      icon: <FileText className="h-6 w-6" />,
    },
    subscription: {
      title: 'Subscription Report',
      description: 'Overview of subscription plans, renewals, cancellations, and revenue breakdown.',
      icon: <CreditCard className="h-6 w-6" />,
    },
    'user-activity': {
      title: 'User Activity Report',
      description: 'Track admin and restaurant user activity, login patterns, and engagement metrics.',
      icon: <Users className="h-6 w-6" />,
    },
  };

  return configs[type];
};

export default ReportCard;
