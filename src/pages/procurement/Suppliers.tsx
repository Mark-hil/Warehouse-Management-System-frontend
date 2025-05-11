import React, { useState, useEffect, ChangeEvent } from 'react';
import { Plus, Edit2, Trash2, Building2, Phone, Mail, Star, Eye } from 'lucide-react';
import Modal from '../../components/common/Modal';
import type { Column } from '../../components/common/Table';
import Table from '../../components/common/Table';
import { Form, Input, Select, Button } from '../../components/forms';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../../api/procurement';

import { useAuth } from '../../context/AuthContext';

import type { Supplier as ApiSupplier } from '../../types/procurement.types';
interface ExtendedSupplier extends ApiSupplier {
  rating: number;
  totalOrders: number;
}

const Suppliers: React.FC = () => {
  const { token } = useAuth();
  const [suppliers, setSuppliers] = useState<ExtendedSupplier[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<ExtendedSupplier | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    isActive: true,
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      console.log('Fetching suppliers...'); // Debug log
      if (!token) {
        console.error('No auth token available');
        return;
      }
      const data = await getSuppliers(token);
      console.log('Raw supplier data:', data); // Debug log

      if (!Array.isArray(data)) {
        console.error('Expected array of suppliers but got:', typeof data);
        return;
      }

      // Transform API response to match our interface
      const transformedData: ExtendedSupplier[] = data.map(supplier => ({
        ...supplier,
        rating: 5, // Default rating
        totalOrders: 0 // Default total orders
      }));

      console.log('Transformed data:', transformedData); // Debug log
      setSuppliers(transformedData);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      // Show error in UI
      alert('Failed to load suppliers. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!token) {
        console.error('No auth token available');
        return;
      }

      const supplierData = {
        supplier_name: formData.name,
        contact_name: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        country: formData.country,
        is_active: formData.isActive
      };

      if (selectedSupplier) {
        await updateSupplier(token, selectedSupplier.supplier_id, supplierData);
      } else {
        await createSupplier(token, supplierData);
      }
      setIsModalOpen(false);
      setSelectedSupplier(null);
      setFormData({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        isActive: true,
        city: '',
        state: '',
        zipCode: '',
        country: ''
      });
      fetchSuppliers();
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      name: supplier.supplier_name,
      contactPerson: supplier.contact_name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      isActive: supplier.is_active,
      city: supplier.city,
      state: supplier.state,
      zipCode: supplier.zip_code,
      country: supplier.country
    });
    setIsModalOpen(true);
  };

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingSupplier, setViewingSupplier] = useState<ExtendedSupplier | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<ExtendedSupplier | null>(null);

  const handleView = (supplier: ExtendedSupplier) => {
    setViewingSupplier(supplier);
    setViewModalOpen(true);
  };

  const handleDeleteClick = (supplier: ExtendedSupplier) => {
    setSupplierToDelete(supplier);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (!token || !supplierToDelete) {
        console.error('No auth token or supplier available');
        return;
      }
      await deleteSupplier(token, supplierToDelete.supplier_id);
      setDeleteModalOpen(false);
      setSupplierToDelete(null);
      fetchSuppliers();
      // Show success message
      alert('Supplier deleted successfully');
    } catch (error) {
      console.error('Error deleting supplier:', error);
      alert('Failed to delete supplier. Please try again.');
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

  const columns: Column<ExtendedSupplier>[] = [
    {
      header: 'Company',
      accessor: (row: ExtendedSupplier) => (
        <div className="flex items-center">
          <Building2 size={16} className="text-gray-400 mr-2" />
          <div>
            <div className="font-medium">{row.supplier_name}</div>
            <div className="text-sm text-gray-500">{row.contact_name}</div>
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
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.is_active ? 'Active' : 'Inactive'}
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
            onClick={() => handleView(row)}
            className="min-w-0 p-2"
            title="View Details"
          >
            <Eye size={16} className="text-gray-600" />
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleEdit(row)}
            className="min-w-0 p-2"
            title="Edit Supplier"
          >
            <Edit2 size={16} className="text-blue-600" />
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeleteClick(row)}
            className="min-w-0 p-2"
            title="Delete Supplier"
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
              isActive: true,
              city: '',
              state: '',
              zipCode: '',
              country: ''
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
          keyExtractor={(item) => item.supplier_id}
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
          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Enter city"
            required
          />
          <Input
            label="State/Province"
            name="state"
            value={formData.state}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, state: e.target.value })}
            placeholder="Enter state or province"
            required
          />
          <Input
            label="ZIP/Postal Code"
            name="zipCode"
            value={formData.zipCode}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, zipCode: e.target.value })}
            placeholder="Enter ZIP or postal code"
            required
          />
          <Input
            label="Country"
            name="country"
            value={formData.country}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, country: e.target.value })}
            placeholder="Enter country"
            required
          />
          <Select
            label="Status"
            name="isActive"
            value={formData.isActive ? 'active' : 'inactive'}
            onChange={(value: string) => setFormData({ ...formData, isActive: value === 'active' })}
            required
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
          />
        </Form>
      </Modal>

      {/* View Supplier Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Supplier Details"
      >
        {viewingSupplier && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Company Name</h3>
                <p className="mt-1">{viewingSupplier.supplier_name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Contact Person</h3>
                <p className="mt-1">{viewingSupplier.contact_name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1">{viewingSupplier.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                <p className="mt-1">{viewingSupplier.phone}</p>
              </div>
              <div className="col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p className="mt-1">{viewingSupplier.address}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">City</h3>
                <p className="mt-1">{viewingSupplier.city}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">State/Province</h3>
                <p className="mt-1">{viewingSupplier.state}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">ZIP/Postal Code</h3>
                <p className="mt-1">{viewingSupplier.zip_code}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Country</h3>
                <p className="mt-1">{viewingSupplier.country}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    viewingSupplier.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {viewingSupplier.is_active ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setViewModalOpen(false)}>Close</Button>
              <Button variant="primary" onClick={() => { setViewModalOpen(false); handleEdit(viewingSupplier); }}>Edit</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Supplier"
      >
        {supplierToDelete && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete supplier <span className="font-medium">{supplierToDelete.supplier_name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Suppliers;
