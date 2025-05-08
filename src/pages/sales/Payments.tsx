import React, { useState, useEffect } from 'react';
import { Plus, DollarSign, CreditCard, CheckCircle, AlertCircle, Receipt } from 'lucide-react';
import type { Column } from '../../components/common/Table';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import { Form, Input, Select, TextArea, Button } from '../../components/forms';

interface Payment {
  id: string;
  transactionId: string;
  orderId: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
  };
  amount: number;
  method: 'credit_card' | 'bank_transfer' | 'cash' | 'other';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  notes: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
  };
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    orderId: '',
    method: 'credit_card',
    amount: '',
    notes: ''
  });

  useEffect(() => {
    fetchPayments();
    fetchPendingOrders();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/sales/payments');
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const fetchPendingOrders = async () => {
    try {
      const response = await fetch('/api/sales/orders?payment_status=pending');
      const data = await response.json();
      setPendingOrders(data);
    } catch (error) {
      console.error('Error fetching pending orders:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/sales/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setIsModalOpen(false);
      setFormData({
        orderId: '',
        method: 'credit_card',
        amount: '',
        notes: ''
      });
      fetchPayments();
      fetchPendingOrders();
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  const getStatusBadge = (status: Payment['status']) => {
    const config = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      failed: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
      refunded: { color: 'bg-purple-100 text-purple-800', icon: CreditCard }
    };

    const StatusIcon = config[status].icon;

    return (
      <span className={`flex items-center px-2 py-1 rounded-full text-sm ${config[status].color}`}>
        <StatusIcon className="w-4 h-4 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getMethodBadge = (method: Payment['method']) => {
    const methods = {
      credit_card: 'Credit Card',
      bank_transfer: 'Bank Transfer',
      cash: 'Cash',
      other: 'Other'
    };

    return (
      <span className="flex items-center">
        <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
        {methods[method]}
      </span>
    );
  };

  const columns: Column<Payment>[] = [
    {
      header: 'Transaction',
      accessor: (payment: Payment) => (
        <div className="flex items-center">
          <Receipt className="w-4 h-4 mr-2 text-blue-500" />
          <div>
            <div className="font-medium">{payment.transactionId}</div>
            <div className="text-sm text-gray-500">Order #{payment.orderNumber}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Customer',
      accessor: (payment: Payment) => payment.customer.name
    },
    {
      header: 'Amount',
      accessor: (payment: Payment) => (
        <span className="font-medium">${payment.amount.toLocaleString()}</span>
      )
    },
    {
      header: 'Method',
      accessor: (payment: Payment) => getMethodBadge(payment.method)
    },
    {
      header: 'Status',
      accessor: (payment: Payment) => getStatusBadge(payment.status)
    },
    {
      header: 'Date',
      accessor: (payment: Payment) => new Date(payment.createdAt).toLocaleDateString()
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600">Track and manage order payments</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={pendingOrders.length === 0}
        >
          <Plus className="w-4 h-4 mr-2" />
          Record Payment
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={payments}
          emptyMessage="No payments found"
          keyExtractor={(payment) => payment.id}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Payment"
      >
        <Form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Select
              label="Order"
              name="orderId"
              value={formData.orderId}
              onChange={(value) => {
                const order = pendingOrders.find(o => o.id === value);
                setFormData({
                  ...formData,
                  orderId: value,
                  amount: order ? order.totalAmount.toString() : ''
                });
              }}
              required
              options={[
                { value: '', label: 'Select an order' },
                ...pendingOrders.map(order => ({
                  value: order.id,
                  label: `#${order.orderNumber} - ${order.customer.name} ($${order.totalAmount})`
                }))
              ]}
            />

            <Select
              label="Payment Method"
              name="method"
              value={formData.method}
              onChange={(value) => setFormData({ ...formData, method: value as Payment['method'] })}
              required
              options={[
                { value: 'credit_card', label: 'Credit Card' },
                { value: 'bank_transfer', label: 'Bank Transfer' },
                { value: 'cash', label: 'Cash' },
                { value: 'other', label: 'Other' }
              ]}
            />

            <Input
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              placeholder="Enter payment amount"
              prefix="$"
            />

            <TextArea
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Enter any additional notes"
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
              <DollarSign className="mr-2" size={16} />
              Record Payment
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Payments;
