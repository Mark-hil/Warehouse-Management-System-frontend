import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Warehouse } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/auth.types';

const TestLogin: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const testUsers = [
    { username: 'admin', password: 'admin123', role: 'admin' as UserRole },
    { username: 'manager', password: 'manager123', role: 'warehouse_manager' as UserRole },
    { username: 'lead', password: 'lead123', role: 'team_lead' as UserRole },
    { username: 'approver', password: 'approver123', role: 'approver' as UserRole }
  ];

  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Warehouse className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Test Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Select a role to test the application
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {testUsers.map((user) => (
            <Button
              key={user.role}
              onClick={() => handleLogin(user)}
              fullWidth
              className="justify-center"
            >
              Login as {user.role.replace('_', ' ').toUpperCase()}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestLogin;
