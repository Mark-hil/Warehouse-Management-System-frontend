import React, { useEffect, useState } from 'react';
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Truck as TruckIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/dashboard/StatCard';
import ActivityItem from '../../components/dashboard/ActivityItem';
import Button from '../../components/common/Button';

// API function types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// API functions
const getInventoryStats = async (): Promise<ApiResponse<InventoryStats>> => {
  // TODO: Implement actual API call
  return {
    success: true,
    data: {
      totalValue: 1000000,
      lowStockCount: 5
    }
  };
};

const getSalesStats = async (): Promise<ApiResponse<SalesStats>> => {
  // TODO: Implement actual API call
  return {
    success: true,
    data: {
      monthlyRevenue: 250000
    }
  };
};

const getProcurementStats = async (): Promise<ApiResponse<ProcurementStats>> => {
  // TODO: Implement actual API call
  return {
    success: true,
    data: {
      pendingOrdersCount: 12
    }
  };
};

interface InventoryStats {
  totalValue: number;
  lowStockCount: number;
}

interface SalesStats {
  monthlyRevenue: number;
}

interface ProcurementStats {
  pendingOrdersCount: number;
}

interface DashboardStats {
  totalInventoryValue: number;
  lowStockItems: number;
  pendingOrders: number;
  monthlyRevenue: number;
  recentActivities: {
    title: string;
    description: string;
    timestamp: string;
    icon: React.ReactNode;
    status: 'success' | 'warning' | 'error' | 'info';
  }[];
  topSellingItems: {
    id: string;
    name: string;
    sku: string;
    revenue: number;
    trend: number;
  }[];
  upcomingDeliveries: {
    id: string;
    deliveryNumber: string;
    supplier: string;
    expectedDate: string;
    daysLeft: number;
  }[];
}

const ManagerDashboard: React.FC = () => {
  const { state: { user } } = useAuth();
  type TimeRange = 'last_7_days' | 'last_30_days' | 'last_90_days' | 'this_year';
const [timeRange, setTimeRange] = useState<TimeRange>('last_7_days');
  const [stats, setStats] = useState<DashboardStats>({
    totalInventoryValue: 0,
    lowStockItems: 0,
    pendingOrders: 0,
    monthlyRevenue: 0,
    recentActivities: [],
    topSellingItems: [],
    upcomingDeliveries: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [inventoryResponse, salesResponse, procurementResponse] = await Promise.all([
          getInventoryStats(),
          getSalesStats(),
          getProcurementStats()
        ]);

        if (inventoryResponse.success && salesResponse.success && procurementResponse.success) {
          setStats((prevStats: DashboardStats) => ({
            ...prevStats,
            totalInventoryValue: inventoryResponse.data.totalValue,
            lowStockItems: inventoryResponse.data.lowStockCount,
            pendingOrders: procurementResponse.data.pendingOrdersCount,
            monthlyRevenue: salesResponse.data.monthlyRevenue
          }));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName} {user?.lastName}</h1>
          <p className="text-gray-600">Here's what's happening in your warehouse today.</p>
        </div>
        <div className="flex space-x-2">
          <select 
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            value={timeRange}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTimeRange(e.target.value as TimeRange)}
          >
            <option value="last_7_days">Last 7 days</option>
            <option value="last_30_days">Last 30 days</option>
            <option value="last_90_days">Last 90 days</option>
            <option value="this_year">This year</option>
          </select>
          <Button variant="primary">Export Report</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Inventory Value"
          value={`$${stats.totalInventoryValue.toLocaleString()}`}
          icon={<Package size={24} />}
          change={{ value: 12, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems.toString()}
          icon={<AlertTriangle size={24} />}
          change={{ value: 5, isPositive: false }}
          color="yellow"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders.toString()}
          icon={<ShoppingCart size={24} />}
          change={{ value: 8, isPositive: false }}
          color="red"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          icon={<DollarSign size={24} />}
          change={{ value: 15, isPositive: true }}
          color="green"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Inventory Overview</h2>
          </div>
          <div className="p-6">
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
              <p className="text-gray-500">Inventory chart will be displayed here</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentActivities.map((activity: DashboardStats['recentActivities'][0], index: number) => (
              <ActivityItem
                key={index}
                title={activity.title}
                description={activity.description}
                timestamp={activity.timestamp}
                icon={activity.icon}
                status={activity.status}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Top Selling Items</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.topSellingItems.map((item: DashboardStats['topSellingItems'][0]) => (
                <div key={item.id} className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                    <Package size={24} className="text-gray-500" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${item.revenue.toLocaleString()}</p>
                    <div className="flex items-center text-sm">
                      <span className={`${item.trend > 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                        {item.trend > 0 ? <ArrowUpRight size={16} className="text-green-500" /> : <ArrowDownRight size={16} className="text-red-500" />}
                        {Math.abs(item.trend)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Upcoming Deliveries</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.upcomingDeliveries.map((delivery: DashboardStats['upcomingDeliveries'][0]) => (
                <div key={delivery.id} className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                    <TruckIcon size={24} className="text-gray-500" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{delivery.deliveryNumber}</h3>
                    <p className="text-sm text-gray-500">From {delivery.supplier}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{delivery.expectedDate}</p>
                    <p className="text-sm text-gray-500">{delivery.daysLeft} days left</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
