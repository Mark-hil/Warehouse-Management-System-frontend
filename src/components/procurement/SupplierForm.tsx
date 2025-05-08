import React from 'react';
import { Supplier } from '../../types/procurement.types';
import Input from '../common/Input';
import Button from '../common/Button';

interface SupplierFormProps {
  supplier?: Supplier;
  onSubmit: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({
  supplier,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = React.useState({
    name: supplier?.name || '',
    contactPerson: supplier?.contactPerson || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    address: supplier?.address || '',
    city: supplier?.city || '',
    state: supplier?.state || '',
    zipCode: supplier?.zipCode || '',
    country: supplier?.country || '',
    isActive: supplier?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Company Name"
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

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Active Supplier
        </label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          {supplier ? 'Update Supplier' : 'Create Supplier'}
        </Button>
      </div>
    </form>
  );
};

export default SupplierForm;