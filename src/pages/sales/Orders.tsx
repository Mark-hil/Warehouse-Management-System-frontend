import React, { useState, useEffect } from 'react';
import { Plus, ShoppingCart, Trash2 } from 'lucide-react';
import type { Column } from '../../components/common/Table';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import { Form, Input, Select, TextArea, Button } from '../../components/forms';

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
  };
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  shippingAddress: string;
}

interface Customer {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    items: [{ productId: '', quantity: 1 }],
    shippingAddress: ''
  });

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/sales/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/sales/customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/inventory/items');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/sales/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setIsModalOpen(false);
      setFormData({
        customerId: '',
        items: [{ productId: '', quantity: 1 }],
        shippingAddress: ''
      });
      fetchOrders();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: 1 }]
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index: number, field: 'productId' | 'quantity', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const getStatusBadge = (status: Order['status']) => {
    const config = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-sm ${config[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: Order['paymentStatus']) => {
    const config = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      refunded: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-sm ${config[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const columns: Column<Order>[] = [
    {
      header: 'Order #',
      accessor: (order: Order) => order.orderNumber
    },
    {
      header: 'Customer',
      accessor: (order: Order) => order.customer?.name
    },
    {
      header: 'Items',
      accessor: (order: Order) => `${order.items.length} items`
    },
    {
      header: 'Total',
      accessor: (order: Order) => `$${order.totalAmount.toFixed(2)}`
    },
    {
      header: 'Status',
      accessor: (order: Order) => getStatusBadge(order.status)
    },
    {
      header: 'Payment',
      accessor: (order: Order) => getPaymentStatusBadge(order.paymentStatus)
    },
    {
      header: 'Created',
      accessor: (order: Order) => new Date(order.createdAt).toLocaleDateString()
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage customer orders</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={orders}
          emptyMessage="No orders found"
          keyExtractor={(order) => order.id}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Order"
      >
        <Form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Select
              label="Customer"
              name="customerId"
              value={formData.customerId}
              onChange={(value) => setFormData({ ...formData, customerId: value })}
              required
              options={customers.map(customer => ({
                value: customer.id,
                label: customer.name
              }))}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <Select
                        label="Product"
                        name={`item-${index}-product`}
                        value={item.productId}
                        onChange={(value) => handleItemChange(index, 'productId', value)}
                        required
                        options={products.map(product => ({
                          value: product.id,
                          label: `${product.name} - $${product.price}`
                        }))}
                      />
                    </div>
                    <div className="w-32">
                      <Input
                        type="number"
                        label="Quantity"
                        name={`item-${index}-quantity`}
                        value={item.quantity.toString()}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                        min={1}
                        required
                      />
                    </div>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => handleRemoveItem(index)}
                        className="mt-6"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddItem}
                  className="w-full"
                >
                  <Plus className="mr-2" size={16} />
                  Add Item
                </Button>
              </div>
            </div>

            <TextArea
              label="Shipping Address"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
              required
              rows={3}
              placeholder="Enter the shipping address"
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
              <ShoppingCart className="mr-2" size={16} />
              Create Order
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Orders;
