import React from 'react';
import { Customer } from '../../types/sales.types';
import Input from '../common/Input';
import Button from '../common/Button';

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = React.useState({
    name: customer?.name || '',
    contactPerson: customer?.contactPerson || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    city: customer?.city || '',
    state: customer?.state || '',
    zipCode: customer?.zipCode || '',
    country: customer?.country || '',
    customerType: customer?.customerType || 'individual',
    isActive: customer?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Customer Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          fullWidth
        />
        
        <Input
          label="Contact Person"
          value={formData.contactPerson}
          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
          required
          fullWidth
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          fullWidth
        />
        
        <Input
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          fullWidth
        />
      </div>

      <Input
        label="Address"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        required
        fullWidth
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Input
          label="City"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          required
          fullWidth
        />
        
        <Input
          label="State"
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          required
          fullWidth
        />
        
        <Input
          label="ZIP Code"
          value={formData.zipCode}
          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
          required
          fullWidth
        />
        
        <Input
          label="Country"
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          required
          fullWidth
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Customer Type
        </label>
        <select
          value={formData.customerType}
          onChange={(e) => setFormData({ ...formData, customerType: e.target.value as any })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
        >
          <option value="individual">Individual</option>
          <option value="business">Business</option>
          <option value="government">Government</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Active Customer
        </label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          {customer ? 'Update Customer' : 'Create Customer'}
        </Button>
      </div>
    </form>
  );
};

export default CustomerForm;