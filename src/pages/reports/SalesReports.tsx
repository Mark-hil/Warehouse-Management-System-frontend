import React, { useState, useEffect } from 'react';
import {
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';
import Button from '../../components/common/Button';
import Select from '../../components/common/Input'; // Assuming Select is part of Input

interface SalesMetrics {
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  topProducts: {
    name: string;
    revenue: number;
    quantity: number;
  }[];
  topCustomers: {
    name: string;
    revenue: number;
    orderCount: number;
  }[];
  revenueByMonth: {
    month: string;
    revenue: number;
  }[];
  ordersByStatus: {
    status: string;
    count: number;
  }[];
}

const SalesReports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('last_30_days');
  const [metrics, setMetrics] = useState<SalesMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSalesMetrics();
  }, [timeRange]);

  const fetchSalesMetrics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/reports/sales?range=${timeRange}`);
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching sales metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = async (format: 'pdf' | 'csv') => {
    try {
      const response = await fetch(`/api/reports/sales/download?range=${timeRange}&format=${format}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales-report-${timeRange}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const MetricCard = ({ title, value, icon: Icon, trend = 0 }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-full">
          <Icon className="w-6 h-6 text-blue-500" />
        </div>
      </div>
      {trend !== 0 && (
        <div className="mt-2 flex items-center">
          <TrendingUp className={`w-4 h-4 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
          <span className={`ml-1 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(trend)}% from last period
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Reports</h1>
          <p className="text-gray-600">Analyze your sales performance</p>
        </div>
        <div className="flex space-x-4">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-48"
          >
            <option value="today">Today</option>
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="this_year">This Year</option>
          </Select>
          <div className="flex space-x-2">
            <Button
              onClick={() => downloadReport('pdf')}
              variant="secondary"
            >
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button
              onClick={() => downloadReport('csv')}
              variant="secondary"
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : metrics ? (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Revenue"
              value={`$${metrics.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              trend={5.2}
            />
            <MetricCard
              title="Total Orders"
              value={metrics.orderCount}
              icon={ShoppingBag}
              trend={2.1}
            />
            <MetricCard
              title="Average Order Value"
              value={`$${metrics.averageOrderValue.toLocaleString()}`}
              icon={BarChartIcon}
              trend={-1.5}
            />
            <MetricCard
              title="Active Customers"
              value={metrics.topCustomers.length}
              icon={Calendar}
              trend={3.8}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Revenue Trend
              </h2>
              <div className="h-64">
                {/* Add your chart component here */}
                <div className="flex items-center justify-center h-full text-gray-500">
                  <LineChartIcon className="w-8 h-8 mr-2" />
                  <span>Revenue Chart</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Orders by Status
              </h2>
              <div className="h-64">
                {/* Add your chart component here */}
                <div className="flex items-center justify-center h-full text-gray-500">
                  <BarChartIcon className="w-8 h-8 mr-2" />
                  <span>Orders Chart</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Products & Customers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
                <div className="mt-4">
                  {metrics.topProducts.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.quantity} units sold</p>
                      </div>
                      <p className="font-medium">${product.revenue.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900">Top Customers</h2>
                <div className="mt-4">
                  {metrics.topCustomers.map((customer, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.orderCount} orders</p>
                      </div>
                      <p className="font-medium">${customer.revenue.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">Failed to load sales metrics</div>
      )}
    </div>
  );
};

export default SalesReports;
