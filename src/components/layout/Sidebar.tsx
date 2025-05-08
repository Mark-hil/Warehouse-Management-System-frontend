import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Warehouse, 
  TruckIcon, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronDown,
  ChevronRight,

  Building, 
  Bell, 
  Shield, 
  Database, 
  Printer, 
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, active, onClick }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
        active
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

interface SidebarGroupProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const SidebarGroup: React.FC<SidebarGroupProps> = ({ 
  label, 
  icon, 
  children,
  defaultOpen = false
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  
  return (
    <div className="mb-2">
      <button
        className="flex items-center justify-between w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <span className="mr-3">{icon}</span>
          <span>{label}</span>
        </div>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      
      {isOpen && (
        <div className="pl-10 mt-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { state: { user }, logout } = useAuth();
  const { state: { sidebarOpen }, toggleSidebar } = useUI();

  const showMenuItem = (requiredRoles: string[]) => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transition-transform duration-300 transform ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <Warehouse className="w-8 h-8 text-blue-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">WMS</span>
          </Link>
          <button
            className="p-1 text-gray-500 rounded-md lg:hidden hover:text-gray-700 hover:bg-gray-100"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Close sidebar</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 px-3 py-4 overflow-y-auto">
          <nav className="space-y-2">
            <SidebarItem
              to="/dashboard"
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              active={isActive('/dashboard')}
            />
            
            {showMenuItem(['admin', 'warehouse_manager', 'team_lead']) && (
              <SidebarGroup 
                label="Inventory" 
                icon={<Package size={20} />}
                defaultOpen={location.pathname.includes('/inventory')}
              >
                <SidebarItem
                  to="/inventory/items"
                  icon={<Package size={18} />}
                  label="Items"
                  active={isActive('/inventory/items')}
                />
                {showMenuItem(['admin', 'warehouse_manager']) && (
                  <SidebarItem
                    to="/inventory/categories"
                    icon={<Package size={18} />}
                    label="Categories"
                    active={isActive('/inventory/categories')}
                  />
                )}
                {showMenuItem(['admin', 'warehouse_manager']) && (
                  <SidebarItem
                    to="/inventory/warehouses"
                    icon={<Warehouse size={18} />}
                    label="Warehouses"
                    active={isActive('/inventory/warehouses')}
                  />
                )}
                {showMenuItem(['admin', 'warehouse_manager', 'team_lead']) && (
                  <SidebarItem
                    to="/inventory/distribution"
                    icon={<TruckIcon size={18} />}
                    label="Distribution"
                    active={isActive('/inventory/distribution')}
                  />
                )}
              </SidebarGroup>
            )}
            
            {showMenuItem(['admin', 'warehouse_manager', 'approver']) && (
              <SidebarGroup 
                label="Procurement" 
                icon={<ShoppingCart size={20} />}
                defaultOpen={location.pathname.includes('/procurement')}
              >
                {showMenuItem(['admin', 'warehouse_manager']) && (
                  <SidebarItem
                    to="/procurement/suppliers"
                    icon={<Users size={18} />}
                    label="Suppliers"
                    active={isActive('/procurement/suppliers')}
                  />
                )}
                {showMenuItem(['admin', 'warehouse_manager']) && (
                  <SidebarItem
                    to="/procurement/purchase-orders"
                    icon={<ShoppingCart size={18} />}
                    label="Purchase Orders"
                    active={isActive('/procurement/purchase-orders')}
                  />
                )}
                <SidebarItem
                  to="/procurement/requests"
                  icon={<ShoppingCart size={18} />}
                  label="Requests"
                  active={isActive('/procurement/requests')}
                />
              </SidebarGroup>
            )}
            
            {showMenuItem(['admin', 'warehouse_manager']) && (
              <SidebarGroup 
                label="Sales" 
                icon={<ShoppingCart size={20} />}
                defaultOpen={location.pathname.includes('/sales')}
              >
                <SidebarItem
                  to="/sales/customers"
                  icon={<Users size={18} />}
                  label="Customers"
                  active={isActive('/sales/customers')}
                />
                <SidebarItem
                  to="/sales/orders"
                  icon={<ShoppingCart size={18} />}
                  label="Orders"
                  active={isActive('/sales/orders')}
                />
                <SidebarItem
                  to="/sales/payments"
                  icon={<ShoppingCart size={18} />}
                  label="Payments"
                  active={isActive('/sales/payments')}
                />
              </SidebarGroup>
            )}
            
            {showMenuItem(['admin', 'warehouse_manager']) && (
              <SidebarGroup 
                label="Reports" 
                icon={<BarChart3 size={20} />}
                defaultOpen={location.pathname.includes('/reports')}
              >
                <SidebarItem
                  to="/reports/sales"
                  icon={<BarChart3 size={18} />}
                  label="Sales Reports"
                  active={isActive('/reports/sales')}
                />
                <SidebarItem
                  to="/reports/inventory"
                  icon={<BarChart3 size={18} />}
                  label="Inventory Reports"
                  active={isActive('/reports/inventory')}
                />
                <SidebarItem
                  to="/reports/procurement"
                  icon={<BarChart3 size={18} />}
                  label="Procurement Reports"
                  active={isActive('/reports/procurement')}
                />
              </SidebarGroup>
            )}
            
            {/* Settings Section */}
            {showMenuItem(['admin']) && (
              <SidebarGroup
                label="Settings"
                icon={<Settings size={20} />}
                defaultOpen={location.pathname.includes('/settings')}
              >
                <SidebarItem
                  to="/settings/company"
                  icon={<Building size={18} />}
                  label="Company"
                  active={isActive('/settings/company')}
                />
                <SidebarItem
                  to="/settings/users"
                  icon={<Users size={18} />}
                  label="Users & Roles"
                  active={isActive('/settings/users')}
                />
                <SidebarItem
                  to="/settings/notifications"
                  icon={<Bell size={18} />}
                  label="Notifications"
                  active={isActive('/settings/notifications')}
                />
                <SidebarItem
                  to="/settings/security"
                  icon={<Shield size={18} />}
                  label="Security"
                  active={isActive('/settings/security')}
                />
                <SidebarItem
                  to="/settings/integrations"
                  icon={<Database size={18} />}
                  label="Integrations"
                  active={isActive('/settings/integrations')}
                />
                <SidebarItem
                  to="/settings/printing"
                  icon={<Printer size={18} />}
                  label="Printing"
                  active={isActive('/settings/printing')}
                />
                <SidebarItem
                  to="/settings/billing"
                  icon={<CreditCard size={18} />}
                  label="Billing"
                  active={isActive('/settings/billing')}
                />
              </SidebarGroup>
            )}
            

          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <button
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
            onClick={logout}
          >
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;