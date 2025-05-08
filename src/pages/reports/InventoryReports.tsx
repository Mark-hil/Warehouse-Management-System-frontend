import React, { useState, useEffect } from 'react';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Download,
  Package,
  AlertTriangle,
  TrendingUp,
  Warehouse
} from 'lucide-react';
import Button from '../../components/common/Button';
import Select from '../../components/common/Input'; // Assuming Select is part of Input

interface InventoryMetrics {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  warehouseUtilization: number;
  itemsByCategory: {
    category: string;
    count: number;
    value: number;
  }[];
  stockMovement: {
    date: string;
    inbound: number;
    outbound: number;
  }[];
  warehouseStatus: {
    name: string;
    capacity: number;
    used: number;
    items: number;
  }[];
  criticalItems: {
    name: string;
    currentStock: number;
    minimumStock: number;
    category: string;
  }[];
}

const InventoryReports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('last_30_days');
  const [metrics, setMetrics] = useState<InventoryMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInventoryMetrics();
  }, [timeRange]);

  const fetchInventoryMetrics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/reports/inventory?range=${timeRange}`);
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching inventory metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = async (format: 'pdf' | 'csv') => {
    try {
      const response = await fetch(
        `/api/reports/inventory/download?range=${timeRange}&format=${format}`
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-report-${timeRange}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const MetricCard = ({ title, value, icon: Icon, trend = 0, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 bg-${color}-50 rounded-full`}>
          <Icon className={`w-6 h-6 text-${color}-500`} />
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
          <h1 className="text-2xl font-bold text-gray-900">Inventory Reports</h1>
          <p className="text-gray-600">Monitor your inventory status and movements</p>
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
              title="Total Items"
              value={metrics.totalItems.toLocaleString()}
              icon={Package}
            />
            <MetricCard
              title="Total Value"
              value={`$${metrics.totalValue.toLocaleString()}`}
              icon={BarChartIcon}
              trend={3.2}
            />
            <MetricCard
              title="Low Stock Items"
              value={metrics.lowStockItems}
              icon={AlertTriangle}
              color="yellow"
            />
            <MetricCard
              title="Warehouse Utilization"
              value={`${metrics.warehouseUtilization}%`}
              icon={Warehouse}
              trend={-2.5}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Stock Movement
              </h2>
              <div className="h-64">
                {/* Add your chart component here */}
                <div className="flex items-center justify-center h-full text-gray-500">
                  <BarChartIcon className="w-8 h-8 mr-2" />
                  <span>Stock Movement Chart</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Items by Category
              </h2>
              <div className="h-64">
                {/* Add your chart component here */}
                <div className="flex items-center justify-center h-full text-gray-500">
                  <PieChartIcon className="w-8 h-8 mr-2" />
                  <span>Category Distribution Chart</span>
                </div>
              </div>
            </div>
          </div>

          {/* Warehouse Status & Critical Items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900">Warehouse Status</h2>
                <div className="mt-4 space-y-4">
                  {metrics.warehouseStatus.map((warehouse, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{warehouse.name}</span>
                        <span className="text-gray-500">
                          {warehouse.items} items
                        </span>
                      </div>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-blue-600">
                              {Math.round((warehouse.used / warehouse.capacity) * 100)}%
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-blue-600">
                              {warehouse.used}/{warehouse.capacity}
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                          <div
                            style={{ width: `${(warehouse.used / warehouse.capacity) * 100}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900">Critical Items</h2>
                <div className="mt-4">
                  {metrics.criticalItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-red-600">
                          {item.currentStock} / {item.minimumStock}
                        </p>
                        <p className="text-sm text-gray-500">Current / Minimum</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">Failed to load inventory metrics</div>
      )}
    </div>
  );
};

export default InventoryReports;
