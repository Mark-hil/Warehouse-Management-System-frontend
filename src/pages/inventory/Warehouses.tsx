import React, { useState, useEffect, ChangeEvent } from 'react';
import { Plus, Edit2, Trash2, MapPin, Package } from 'lucide-react';
import Modal from '../../components/common/Modal';
import type { Column } from '../../components/common/Table';
import Table from '../../components/common/Table';
import { Form, Input, Select, Button } from '../../components/forms';

interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentStock: number;
  manager: string;
  status: 'active' | 'inactive' | 'maintenance';
}

const Warehouses: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    manager: '',
    status: 'active' as Warehouse['status']
  });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      // Replace with your API call
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
      const payload = {
        ...formData,
        capacity: parseInt(formData.capacity)
      };

      if (selectedWarehouse) {
        await fetch(`/api/inventory/warehouses/${selectedWarehouse.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('/api/inventory/warehouses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      setIsModalOpen(false);
      setSelectedWarehouse(null);
      setFormData({ name: '', location: '', capacity: '', manager: '', status: 'active' });
      fetchWarehouses();
    } catch (error) {
      console.error('Error saving warehouse:', error);
    }
  };

  const handleEdit = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setFormData({
      name: warehouse.name,
      location: warehouse.location,
      capacity: warehouse.capacity.toString(),
      manager: warehouse.manager,
      status: warehouse.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this warehouse?')) {
      try {
        await fetch(`/api/inventory/warehouses/${id}`, {
          method: 'DELETE'
        });
        fetchWarehouses();
      } catch (error) {
        console.error('Error deleting warehouse:', error);
      }
    }
  };

  const getStatusBadgeColor = (status: Warehouse['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: Column<Warehouse>[] = [
    {
      header: 'Name',
      accessor: (row: Warehouse) => (
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
          {row.name}
        </div>
      )
    },
    { header: 'Location', accessor: 'location' as keyof Warehouse },
    {
      header: 'Capacity',
      accessor: (row: Warehouse) => (
        <div className="flex items-center">
          <Package className="w-4 h-4 mr-2 text-gray-500" />
          <div>
            <div className="text-sm font-medium">{row.currentStock} / {row.capacity}</div>
            <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
              <div
                className="h-2 bg-blue-500 rounded-full"
                style={{ width: `${(row.currentStock / row.capacity) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )
    },
    { header: 'Manager', accessor: 'manager' as keyof Warehouse },
    {
      header: 'Status',
      accessor: (row: Warehouse) => (
        <span className={`px-2 py-1 rounded-full text-sm ${getStatusBadgeColor(row.status)}`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: (row: Warehouse) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={() => handleEdit(row)}
            className="min-w-0 p-2"
          >
            <Edit2 size={16} className="text-blue-600" />
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDelete(row.id)}
            className="min-w-0 p-2"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warehouses</h1>
          <p className="text-gray-600">Manage your warehouse locations</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedWarehouse(null);
            setFormData({ name: '', location: '', capacity: '', manager: '', status: 'active' });
            setIsModalOpen(true);
          }}
        >
          <Plus className="mr-2" size={16} />
          Add Warehouse
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={warehouses}
          emptyMessage="No warehouses found"
          keyExtractor={(item) => item.id}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedWarehouse ? 'Edit Warehouse' : 'Add Warehouse'}
      >
        <Form
          onSubmit={handleSubmit}
          title={selectedWarehouse ? 'Edit Warehouse Details' : 'New Warehouse Details'}
          description="Enter the warehouse information below"
        >
          <Input
            label="Warehouse Name"
            name="name"
            value={formData.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter warehouse name"
            required
          />
          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Enter warehouse location"
            required
          />
          <Input
            label="Capacity"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, capacity: e.target.value })}
            placeholder="Enter warehouse capacity"
            required
          />
          <Input
            label="Manager"
            name="manager"
            value={formData.manager}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, manager: e.target.value })}
            placeholder="Enter warehouse manager"
            required
          />
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={(value: string) => setFormData({ ...formData, status: value as Warehouse['status'] })}
            required
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'maintenance', label: 'Maintenance' }
            ]}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default Warehouses;
