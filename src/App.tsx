import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import TestLogin from './pages/auth/TestLogin';
import RoleDashboard from './pages/dashboard/RoleDashboard';

// Inventory imports
import Items from './pages/inventory/Items';
import Categories from './pages/inventory/Categories';
import Warehouses from './pages/inventory/Warehouses';
import Distribution from './pages/inventory/Distribution';

// Procurement imports
import PurchaseOrders from './pages/procurement/PurchaseOrders';
import Suppliers from './pages/procurement/Suppliers';
import Requests from './pages/procurement/Requests';

// Sales imports
import Customers from './pages/sales/Customers';
import Orders from './pages/sales/Orders';
import Payments from './pages/sales/Payments';

// Reports imports
import SalesReports from './pages/reports/SalesReports';
import InventoryReports from './pages/reports/InventoryReports';
import ProcurementReports from './pages/reports/ProcurementReports';

// Settings imports
import Settings from './pages/settings/Settings';
import CompanySettings from './pages/settings/CompanySettings';
import SecuritySettings from './pages/settings/SecuritySettings';
import IntegrationSettings from './pages/settings/IntegrationSettings';
import UsersAndRoles from './pages/settings/UsersAndRoles';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state: { isAuthenticated, isLoading } } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/test-login" element={<TestLogin />} />
            
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<RoleDashboard />} />
              
              {/* Inventory Routes */}
              <Route path="inventory/items" element={<Items />} />
              <Route path="inventory/categories" element={<Categories />} />
              <Route path="inventory/warehouses" element={<Warehouses />} />
              <Route path="inventory/distribution" element={<Distribution />} />
              
              {/* Procurement Routes */}
              <Route path="procurement/suppliers" element={<Suppliers />} />
              <Route path="procurement/purchase-orders" element={<PurchaseOrders />} />
              <Route path="procurement/requests" element={<Requests />} />
              
              {/* Sales Routes */}
              <Route path="sales/customers" element={<Customers />} />
              <Route path="sales/orders" element={<Orders />} />
              <Route path="sales/payments" element={<Payments />} />
              
              {/* Reports Routes */}
              <Route path="reports/sales" element={<SalesReports />} />
              <Route path="reports/inventory" element={<InventoryReports />} />
              <Route path="reports/procurement" element={<ProcurementReports />} />
              
              {/* Settings */}
              <Route path="settings" element={<Settings />}>
                <Route index element={<Navigate to="/settings/company" replace />} />
                <Route path="company" element={<CompanySettings />} />
                <Route path="users" element={<UsersAndRoles />} />
                <Route path="notifications" element={<div>Notification Settings</div>} />
                <Route path="security" element={<SecuritySettings />} />
                <Route path="integrations" element={<IntegrationSettings />} />
                <Route path="printing" element={<div>Printing Settings</div>} />
                <Route path="billing" element={<div>Billing Settings</div>} />
              </Route>
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </UIProvider>
    </AuthProvider>
  );
}

export default App;