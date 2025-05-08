import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { PurchaseOrder, Supplier } from '../../types/procurement.types';
import { Item } from '../../types/inventory.types';
import Input from '../common/Input';
import Button from '../common/Button';

interface PurchaseOrderFormProps {
  purchaseOrder?: PurchaseOrder;
  suppliers: Supplier[];
  items: Item[];
  onSubmit: (order: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({
  purchaseOrder,
  suppliers,
  items,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = React.useState({
    supplierId: purchaseOrder?.supplierId || '',
    orderDate: purchaseOrder?.orderDate || new Date().toISOString().split('T')[0],
    expectedDeliveryDate: purchaseOrder?.expectedDeliveryDate || '',
    status: purchaseOrder?.status || 'draft',
    notes: purchaseOrder?.notes || '',
    items: purchaseOrder?.items || [],
  });

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          id: `temp-${Date.now()}`,
          purchaseOrderId: purchaseOrder?.id || '',
          itemId: '',
          quantity: 1,
          unitPrice: 0,
          totalPrice: 0,
        },
      ],
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
      totalPrice: field === 'quantity' || field === 'unitPrice'
        ? Number(newItems[index].quantity) * Number(newItems[index].unitPrice)
        : newItems[index].totalPrice,
    };
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      totalAmount: formData.items.reduce((sum, item) => sum + item.totalPrice, 0),
    } as any);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supplier
          </label>
          <select
            value={formData.supplierId}
            onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          >
            <option value="">Select Supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          >
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="ordered">Ordered</option>
            <option value="received">Received</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          type="date"
          label="Order Date"
          value={formData.orderDate}
          onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
          required
          fullWidth
        />
        
        <Input
          type="date"
          label="Expected Delivery Date"
          value={formData.expectedDeliveryDate}
          onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
          required
          fullWidth
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={handleAddItem}
          >
            Add Item
          </Button>
        </div>

        <div className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={item.id} className="flex items-center space-x-4">
              <div className="flex-1">
                <select
                  value={item.itemId}
                  onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                >
                  <option value="">Select Item</option>
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                required
                className="w-24"
              />

              <Input
                type="number"
                step="0.01"
                placeholder="Unit Price"
                value={item.unitPrice}
                onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                required
                className="w-32"
              />

              <div className="w-32 text-right">
                ${item.totalPrice.toFixed(2)}
              </div>

              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          {purchaseOrder ? 'Update Order' : 'Create Order'}
        </Button>
      </div>
    </form>
  );
};

export default PurchaseOrderForm;