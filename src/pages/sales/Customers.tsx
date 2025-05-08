import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, User, Mail, Phone, MapPin } from 'lucide-react';
import type { Column } from '../../components/common/Table';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import { Form, Input, TextArea, Button } from '../../components/forms';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'active' | 'inactive';
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/sales/customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCustomer) {
        await fetch(`/api/sales/customers/${selectedCustomer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch('/api/sales/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      setIsModalOpen(false);
      setSelectedCustomer(null);
      setFormData({ name: '', email: '', phone: '', address: '' });
      fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await fetch(`/api/sales/customers/${id}`, {
          method: 'DELETE'
        });
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const columns: Column<Customer>[] = [
    {
      header: 'Customer',
      accessor: (customer: Customer) => (
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2 text-blue-500" />
          <div>
            <div className="font-medium">{customer.name}</div>
            <div className="text-sm text-gray-500">{customer.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Contact',
      accessor: (customer: Customer) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            {customer.phone}
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            {customer.address}
          </div>
        </div>
      )
    },
    {
      header: 'Orders',
      accessor: (customer: Customer) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
          {customer.totalOrders}
        </span>
      )
    },
    {
      header: 'Total Spent',
      accessor: (customer: Customer) => (
        <span className="font-medium text-gray-900">
          ${customer.totalSpent.toLocaleString()}
        </span>
      )
    },
    {
      header: 'Last Order',
      accessor: (customer: Customer) => (
        <span className="text-gray-500">
          {new Date(customer.lastOrderDate).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: (customer: Customer) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            customer.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: (customer: Customer) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={() => handleEdit(customer)}
            className="p-2"
          >
            <Edit2 size={16} />
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDelete(customer.id)}
            className="p-2"
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
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage your customer relationships</p>
        </div>
        <Button
          onClick={() => {
            setSelectedCustomer(null);
            setFormData({ name: '', email: '', phone: '', address: '' });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={customers}
          emptyMessage="No customers found"
          keyExtractor={(customer) => customer.id}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCustomer ? 'Edit Customer' : 'Add Customer'}
      >
        <Form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter customer name"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="Enter email address"
            />
            <Input
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              placeholder="Enter phone number"
            />
            <TextArea
              label="Address"
              name="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              rows={3}
              placeholder="Enter full address"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {selectedCustomer ? (
                <>
                  <Edit2 className="mr-2" size={16} />
                  Update Customer
                </>
              ) : (
                <>
                  <Plus className="mr-2" size={16} />
                  Create Customer
                </>
              )}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Customers;
