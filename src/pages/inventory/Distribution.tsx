import React, { useState, useEffect, ChangeEvent } from 'react';
import { TruckIcon, ArrowRightIcon, PackageCheck, AlertTriangle } from 'lucide-react';
import Modal from '../../components/common/Modal';
import type { Column } from '../../components/common/Table';
import Table from '../../components/common/Table';
import { Form, Select, Button } from '../../components/forms';

interface Distribution {
  id: string;
  sourceWarehouse: string;
  destinationWarehouse: string;
  items: {
    id: string;
    name: string;
    quantity: number;
  }[];
  status: 'pending' | 'in_transit' | 'completed' | 'cancelled';
  createdAt: string;
  estimatedDelivery: string;
}

interface Warehouse {
  id: string;
  name: string;
  location: string;
}

const Distribution: React.FC = () => {
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    sourceWarehouse: '',
    destinationWarehouse: '',
    items: [{ id: '', quantity: 0 }]
  });

  useEffect(() => {
    fetchDistributions();
    fetchWarehouses();
  }, []);

  const fetchDistributions = async () => {
    try {
      const response = await fetch('/api/inventory/distributions');
      const data = await response.json();
      setDistributions(data);
    } catch (error) {
      console.error('Error fetching distributions:', error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await fetch('/api/inventory/warehouses');
      const data = await response.json();
      setWarehouses(data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/inventory/distributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setIsModalOpen(false);
      setFormData({
        sourceWarehouse: '',
        destinationWarehouse: '',
        items: [{ id: '', quantity: 0 }]
      });
      fetchDistributions();
    } catch (error) {
      console.error('Error creating distribution:', error);
    }
  };

  const getStatusBadge = (status: Distribution['status']) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      in_transit: { color: 'bg-blue-100 text-blue-800', icon: TruckIcon },
      completed: { color: 'bg-green-100 text-green-800', icon: PackageCheck },
      cancelled: { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`flex items-center px-2 py-1 rounded-full text-sm ${config.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    );
  };

  const columns: Column<Distribution>[] = [
    {
      header: 'Source',
      accessor: 'sourceWarehouse' as keyof Distribution
    },
    {
      header: '',
      accessor: () => (
        <div className="flex justify-center">
          <ArrowRightIcon className="w-4 h-4 text-gray-400" />
        </div>
      )
    },
    {
      header: 'Destination',
      accessor: 'destinationWarehouse' as keyof Distribution
    },
    {
      header: 'Items',
      accessor: (row: Distribution) => (
        <div className="flex items-center">
          <span className="text-sm font-medium">{row.items.length} items</span>
          <button
            className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
            onClick={() => {/* Show items detail modal */}}
          >
            View Details
          </button>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (row: Distribution) => getStatusBadge(row.status)
    },
    {
      header: 'Created',
      accessor: (row: Distribution) => new Date(row.createdAt).toLocaleDateString()
    },
    {
      header: 'Estimated Delivery',
      accessor: (row: Distribution) => new Date(row.estimatedDelivery).toLocaleDateString()
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Distribution</h1>
          <p className="text-gray-600">Manage inventory transfers between warehouses</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
        >
          <TruckIcon className="mr-2" size={16} />
          New Transfer
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table
          columns={columns}
          data={distributions}
          emptyMessage="No distributions found"
          keyExtractor={(item) => item.id}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Distribution"
      >
        <Form
          onSubmit={handleSubmit}
          title="Transfer Details"
          description="Select warehouses for inventory transfer"
        >
          <Select
            label="Source Warehouse"
            name="sourceWarehouse"
            value={formData.sourceWarehouse}
            onChange={(value: string) => setFormData({ ...formData, sourceWarehouse: value })}
            required
            options={[
              { value: '', label: 'Select source warehouse' },
              ...warehouses.map(w => ({ value: w.id, label: w.name }))
            ]}
          />

          <Select
            label="Destination Warehouse"
            name="destinationWarehouse"
            value={formData.destinationWarehouse}
            onChange={(value: string) => setFormData({ ...formData, destinationWarehouse: value })}
            required
            options={[
              { value: '', label: 'Select destination warehouse' },
              ...warehouses
                .filter(w => w.id !== formData.sourceWarehouse)
                .map(w => ({ value: w.id, label: w.name }))
            ]}
          />

          {/* TODO: Add dynamic item selection */}
        </Form>
      </Modal>
    </div>
  );
};

export default Distribution;
