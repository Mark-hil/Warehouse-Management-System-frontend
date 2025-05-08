import React from 'react';
import { Payment } from '../../types/sales.types';
import Input from '../common/Input';
import Button from '../common/Button';

interface PaymentFormProps {
  payment?: Payment;
  salesOrderId: string;
  onSubmit: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  payment,
  salesOrderId,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = React.useState({
    salesOrderId,
    amount: payment?.amount || 0,
    paymentMethod: payment?.paymentMethod || 'cash',
    paymentDate: payment?.paymentDate || new Date().toISOString().split('T')[0],
    status: payment?.status || 'pending',
    transactionId: payment?.transactionId || '',
    notes: payment?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        type="number"
        step="0.01"
        label="Amount"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
        required
        fullWidth
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Payment Method
        </label>
        <select
          value={formData.paymentMethod}
          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
        >
          <option value="cash">Cash</option>
          <option value="credit_card">Credit Card</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="check">Check</option>
          <option value="other">Other</option>
        </select>
      </div>

      <Input
        type="date"
        label="Payment Date"
        value={formData.paymentDate}
        onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
        required
        fullWidth
      />

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
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <Input
        label="Transaction ID"
        value={formData.transactionId}
        onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
        fullWidth
      />

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
          {payment ? 'Update Payment' : 'Process Payment'}
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;