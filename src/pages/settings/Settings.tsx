import React from 'react';
import { useLocation, Link, Outlet } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Building,
  Users,
  Bell,
  Shield,
  Database,
  Printer,
  CreditCard
} from 'lucide-react';

const Settings: React.FC = () => {
  const location = useLocation();
  const activeTab = location.pathname.split('/').pop() || 'company';

  const tabs = [
    { id: 'company', label: 'Company', icon: Building },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Database },
    { id: 'printing', label: 'Printing', icon: Printer },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  return (
    <div className="h-full bg-gray-50">
      {/* Settings navigation sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto shadow-sm">
        <div className="p-6">
          <div className="flex items-center mb-8">
            <SettingsIcon className="w-6 h-6 text-blue-600 mr-2" />
            <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
          </div>
          <nav className="space-y-1">
            {tabs.map(tab => (
              <Link
                key={tab.id}
                to={`/settings/${tab.id}`}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border border-blue-100'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-3" />
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content area */}
      <div className="ml-64 min-h-screen">
        <div className="max-w-5xl mx-auto py-8 px-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
