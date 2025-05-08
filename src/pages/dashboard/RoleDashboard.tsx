import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import TeamLeadDashboard from './TeamLeadDashboard';

const RoleDashboard: React.FC = () => {
  const { state: { user } } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'warehouse_manager':
      return <ManagerDashboard />;
    case 'team_lead':
      return <TeamLeadDashboard />;
    case 'approver':
      return <Navigate to="/procurement/requests" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default RoleDashboard;
