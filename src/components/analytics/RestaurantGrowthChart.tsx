import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import Card, { CardBody, CardHeader } from '../ui/Card';
import { TrendingUp } from 'lucide-react';

interface GrowthDataPoint {
  month: string;
  newRestaurants: number;
  activeRestaurants: number;
  churnedRestaurants: number;
}

interface RestaurantGrowthChartProps {
  data: GrowthDataPoint[];
  isLoading?: boolean;
}

const RestaurantGrowthChart: React.FC<RestaurantGrowthChartProps> = ({
  data,
  isLoading,
}) => {
  const formatMonth = (monthString: string): string => {
    const date = new Date(monthString);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Restaurant Growth
            </h3>
          </div>
        </CardHeader>
        <CardBody className="h-96 flex items-center justify-center">
          <div className="text-gray-500">Loading chart data...</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-violet-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Restaurant Growth
            </h3>
          </div>
          <div className="text-sm text-gray-500">Monthly new restaurants</div>
        </div>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip
              formatter={(value: number, name: string) => [
                value,
                name === 'newRestaurants'
                  ? 'New Restaurants'
                  : name === 'activeRestaurants'
                  ? 'Active Restaurants'
                  : 'Churned Restaurants',
              ]}
              labelFormatter={formatMonth}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px',
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) =>
                value === 'newRestaurants'
                  ? 'New Restaurants'
                  : value === 'activeRestaurants'
                  ? 'Active Restaurants'
                  : 'Churned Restaurants'
              }
            />
            <Bar dataKey="newRestaurants" fill="#7c3aed" radius={[8, 8, 0, 0]} />
            <Bar
              dataKey="activeRestaurants"
              fill="#a855f7"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="churnedRestaurants"
              fill="#e9d5ff"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

export default RestaurantGrowthChart;
