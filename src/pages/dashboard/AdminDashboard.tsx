import React from 'react';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TruckIcon, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import ActivityItem from '../../components/dashboard/ActivityItem';

const AdminDashboard: React.FC = () => {
  // Mock data for demonstration
  const stats = [
    { 
      title: 'Total Inventory Items', 
      value: '1,284', 
      icon: <Package size={24} />, 
      change: { value: 12, isPositive: true },
      color: 'blue'
    },
    { 
      title: 'Pending Orders', 
      value: '42', 
      icon: <ShoppingCart size={24} />, 
      change: { value: 8, isPositive: false },
      color: 'yellow'
    },
    { 
      title: 'Active Suppliers', 
      value: '38', 
      icon: <Users size={24} />, 
      change: { value: 2, isPositive: true },
      color: 'green'
    },
    { 
      title: 'Low Stock Items', 
      value: '15', 
      icon: <AlertTriangle size={24} />, 
      change: { value: 5, isPositive: false },
      color: 'red'
    },
  ];
  
  const recentActivities = [
    {
      title: 'New Purchase Order Created',
      description: 'PO-2025-042 was created for Office Supplies Inc.',
      timestamp: '2 hours ago',
      icon: <ShoppingCart size={18} />,
      status: 'info'
    },
    {
      title: 'Inventory Transfer Completed',
      description: 'Transfer #TR-2025-089 from Warehouse A to Warehouse B completed.',
      timestamp: '4 hours ago',
      icon: <TruckIcon size={18} />,
      status: 'success'
    },
    {
      title: 'Low Stock Alert',
      description: 'Item "Printer Paper A4" is below minimum stock level.',
      timestamp: '6 hours ago',
      icon: <AlertTriangle size={18} />,
      status: 'warning'
    },
    {
      title: 'Order Fulfilled',
      description: 'Order #ORD-2025-156 for Acme Corp has been fulfilled.',
      timestamp: '8 hours ago',
      icon: <CheckCircle size={18} />,
      status: 'success'
    },
    {
      title: 'Pending Approval',
      description: 'Purchase request #PR-2025-032 is awaiting your approval.',
      timestamp: '1 day ago',
      icon: <Clock size={18} />,
      status: 'info'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-2">
          <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
          <Button variant="primary">Export Report</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            color="blue"
          />
        ))}
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
            {recentActivities.map((activity, index) => (
              <ActivityItem
                key={index}
                title={activity.title}
                description={activity.description}
                timestamp={activity.timestamp}
                icon={activity.icon}
                status={activity.status as 'success' | 'warning' | 'error' | 'info'}
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
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                    <Package size={24} className="text-gray-500" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">Product {item}</h3>
                    <p className="text-sm text-gray-500">SKU-{1000 + item}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${(Math.random() * 1000).toFixed(2)}</p>
                    <div className="flex items-center text-sm">
                      <span className={`${item % 2 === 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                        {item % 2 === 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                        {(Math.random() * 10).toFixed(1)}%
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
              {[1, 2, 3, 4, 5].map((delivery) => (
                <div key={delivery} className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                    <TruckIcon size={24} className="text-gray-500" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">Delivery #{2000 + delivery}</h3>
                    <p className="text-sm text-gray-500">From Supplier {delivery}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(Date.now() + delivery * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">{delivery} days left</p>
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

// Button component for the dashboard
const Button: React.FC<{
  children: React.ReactNode;
  variant: 'primary' | 'secondary';
  onClick?: () => void;
}> = ({ children, variant, onClick }) => {
  const baseClasses = 'inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    primary: 'border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500',
  };
  
  return (
    <button
      type="button"
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default AdminDashboard;