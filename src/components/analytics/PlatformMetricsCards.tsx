import React from 'react';
import { DollarSign, TrendingUp, ShoppingCart, Users } from 'lucide-react';
import Card, { CardBody } from '../ui/Card';

interface MetricCardData {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

interface PlatformMetricsCardsProps {
  totalRevenue: number;
  avgRevenuePerRestaurant: number;
  totalOrders: number;
  activeUsers: number;
  revenueGrowth: number;
  avgRevenueGrowth: number;
  ordersGrowth: number;
  usersGrowth: number;
}

const PlatformMetricsCards: React.FC<PlatformMetricsCardsProps> = ({
  totalRevenue,
  avgRevenuePerRestaurant,
  totalOrders,
  activeUsers,
  revenueGrowth,
  avgRevenueGrowth,
  ordersGrowth,
  usersGrowth,
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const metrics: MetricCardData[] = [
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      change: revenueGrowth,
      icon: <DollarSign className="h-6 w-6" />,
      iconBgColor: 'bg-violet-100',
      iconColor: 'text-violet-600',
    },
    {
      title: 'Avg Revenue per Restaurant',
      value: formatCurrency(avgRevenuePerRestaurant),
      change: avgRevenueGrowth,
      icon: <TrendingUp className="h-6 w-6" />,
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Total Orders',
      value: formatNumber(totalOrders),
      change: ordersGrowth,
      icon: <ShoppingCart className="h-6 w-6" />,
      iconBgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
    },
    {
      title: 'Active Users',
      value: formatNumber(activeUsers),
      change: usersGrowth,
      icon: <Users className="h-6 w-6" />,
      iconBgColor: 'bg-fuchsia-100',
      iconColor: 'text-fuchsia-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} hover>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {metric.value}
                </p>
                <div className="flex items-center gap-1">
                  <TrendingUp
                    className={`h-4 w-4 ${
                      metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  />
                  <span
                    className={`text-sm font-semibold ${
                      metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {metric.change >= 0 ? '+' : ''}
                    {metric.change.toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div
                className={`${metric.iconBgColor} ${metric.iconColor} p-3 rounded-xl`}
              >
                {metric.icon}
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default PlatformMetricsCards;
