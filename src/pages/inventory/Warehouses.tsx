import React, { useState, useEffect, ChangeEvent } from 'react';
import { Plus, Edit2, Trash2, MapPin, Package } from 'lucide-react';
import Modal from '../../components/common/Modal';
import type { Column } from '../../components/common/Table';
import Table from '../../components/common/Table';
import { Form, Input, Select, Button } from '../../components/forms';
import { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } from '../../api/inventory';
import type { Warehouse } from '../../types/inventory.types';



const Warehouses: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [formData, setFormData] = useState<{
    warehouse_name: string;
    location: string;
    capacity: string;
    is_active: boolean;
  }>({
    warehouse_name: '',
    location: '',
    capacity: '',
    is_active: true
  });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const data = await getWarehouses();
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
        await updateWarehouse(selectedWarehouse.warehouse_id, payload);
      } else {
        await createWarehouse(payload);
      }
      setIsModalOpen(false);
      setSelectedWarehouse(null);
      setFormData({ warehouse_name: '', location: '', capacity: '', is_active: true });
      fetchWarehouses();
    } catch (error) {
      console.error('Error saving warehouse:', error);
    }
  };

  const handleEdit = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setFormData({
      warehouse_name: warehouse.warehouse_name,
      location: warehouse.location,
      capacity: warehouse.capacity.toString(),
      is_active: warehouse.is_active
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this warehouse?')) {
      try {
        await deleteWarehouse(id);
        fetchWarehouses();
      } catch (error) {
        console.error('Error deleting warehouse:', error);
      }
    }
  };

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const columns: Column<Warehouse>[] = [
    {
      header: 'Name',
      accessor: (row: Warehouse) => (
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
          {row.warehouse_name}
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
            <div className="text-sm font-medium">{row.current_capacity} / {row.capacity}</div>
            <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
              <div
                className="h-2 bg-blue-500 rounded-full"
                style={{ width: `${(row.current_capacity / row.capacity) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )
    },

    {
      header: 'Status',
      accessor: (row: Warehouse) => (
        <span className={`px-2 py-1 rounded-full text-sm ${getStatusBadgeColor(row.is_active)}`}>
          {row.is_active ? 'Active' : 'Inactive'}
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
            onClick={() => handleDelete(row.warehouse_id)}
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
            setFormData({ warehouse_name: '', location: '', capacity: '', is_active: true });
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
          keyExtractor={(item) => item.warehouse_id.toString()}
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
            name="warehouse_name"
            value={formData.warehouse_name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, warehouse_name: e.target.value })}
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
          <Select
            label="Status"
            name="is_active"
            value={formData.is_active ? 'active' : 'inactive'}
            onChange={(value: string) => setFormData({ ...formData, is_active: value === 'active' })}
            required
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default Warehouses;
