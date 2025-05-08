import React, { useEffect, useState } from 'react';
import { Package, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Import your API functions
import { getInventoryStats } from '../../api/inventory';
import { getSalesStats } from '../../api/sales';

interface TeamStats {
  assignedTasks: number;
  pendingItems: number;
  completedTasks: number;
  urgentTasks: number;
}

const TeamLeadDashboard: React.FC = () => {
  const { state: { user } } = useAuth();
  const [stats, setStats] = useState<TeamStats>({
    assignedTasks: 0,
    pendingItems: 0,
    completedTasks: 0,
    urgentTasks: 0
  });

  useEffect(() => {
    const fetchTeamStats = async () => {
      try {
        const [inventoryData, salesData] = await Promise.all([
          getInventoryStats(),
          getSalesStats()
        ]);

        // Transform the data for team lead view
        setStats({
          assignedTasks: inventoryData.pendingTasks || 0,
          pendingItems: salesData.pendingDeliveries || 0,
          completedTasks: inventoryData.completedTasks || 0,
          urgentTasks: inventoryData.urgentTasks || 0
        });
      } catch (error) {
        console.error('Error fetching team stats:', error);
      }
    };

    fetchTeamStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }: {
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, Team Lead {user?.firstName} {user?.lastName}</h1>
        <p className="text-gray-600">Here's your team's current status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Assigned Tasks"
          value={stats.assignedTasks}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Pending Items"
          value={stats.pendingItems}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Completed Tasks"
          value={stats.completedTasks}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Urgent Tasks"
          value={stats.urgentTasks}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Today's Tasks
          </h2>
          <div className="space-y-4">
            {/* Add your task list component here */}
            <div className="flex items-center justify-center h-48 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              Task List Component
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Team Performance
          </h2>
          <div className="space-y-4">
            {/* Add your team performance component here */}
            <div className="flex items-center justify-center h-48 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              Team Performance Component
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamLeadDashboard;
