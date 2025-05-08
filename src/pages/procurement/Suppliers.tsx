import React, { useState, useEffect, ChangeEvent } from 'react';
import { Plus, Edit2, Trash2, Building2, Phone, Mail, Star } from 'lucide-react';
import Modal from '../../components/common/Modal';
import type { Column } from '../../components/common/Table';
import Table from '../../components/common/Table';
import { Form, Input, Select, Button } from '../../components/forms';

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  status: 'active' | 'inactive';
  totalOrders: number;
}

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    status: 'active' as Supplier['status']
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/procurement/suppliers');
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedSupplier) {
        await fetch(`/api/procurement/suppliers/${selectedSupplier.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch('/api/procurement/suppliers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      setIsModalOpen(false);
      setSelectedSupplier(null);
      setFormData({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        status: 'active'
      });
      fetchSuppliers();
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      status: supplier.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await fetch(`/api/procurement/suppliers/${id}`, {
          method: 'DELETE'
        });
        fetchSuppliers();
      } catch (error) {
        console.error('Error deleting supplier:', error);
      }
    }
  };

  const RatingStars = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const columns: Column<Supplier>[] = [
    {
      header: 'Supplier',
      accessor: (row: Supplier) => (
        <div className="flex items-center">
          <Building2 className="w-4 h-4 mr-2 text-blue-500" />
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-sm text-gray-500">{row.contactPerson}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Contact',
      accessor: (row: Supplier) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Mail className="w-4 h-4 mr-2 text-gray-400" />
            {row.email}
          </div>
          <div className="flex items-center text-sm">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            {row.phone}
          </div>
        </div>
      )
    },
    {
      header: 'Address',
      accessor: (row: Supplier) => (
        <div className="text-sm">{row.address}</div>
      )
    },
    {
      header: 'Rating',
      accessor: (row: Supplier) => <RatingStars rating={row.rating} />
    },
    {
      header: 'Status',
      accessor: (row: Supplier) => (
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            row.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      )
    },
    {
      header: 'Total Orders',
      accessor: (row: Supplier) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {row.totalOrders}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: (row: Supplier) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-gray-600">Manage your supplier relationships</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedSupplier(null);
            setFormData({
              name: '',
              contactPerson: '',
              email: '',
              phone: '',
              address: '',
              status: 'active'
            });
            setIsModalOpen(true);
          }}
        >
          <Plus className="mr-2" size={16} />
          Add Supplier
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={suppliers}
          emptyMessage="No suppliers found"
          keyExtractor={(item) => item.id}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedSupplier ? 'Edit Supplier' : 'Add Supplier'}
      >
        <Form
          onSubmit={handleSubmit}
          title={selectedSupplier ? 'Edit Supplier Details' : 'New Supplier Details'}
          description="Enter the supplier information below"
        >
          <Input
            label="Company Name"
            name="name"
            value={formData.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter company name"
            required
          />
          <Input
            label="Contact Person"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, contactPerson: e.target.value })}
            placeholder="Enter contact person name"
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter email address"
            required
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Enter phone number"
            required
          />
          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Enter company address"
            required
          />
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={(value: string) => setFormData({ ...formData, status: value as Supplier['status'] })}
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

export default Suppliers;
