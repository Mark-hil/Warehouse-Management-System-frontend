import React, { useState, ChangeEvent } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import type { Column } from '../../components/common/Table';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import { Form, Input, Select, TextArea, Button } from '../../components/forms';
import { PurchaseOrder } from '../../types/procurement.types';

const PurchaseOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  
  // Mock data for demonstration
  const purchaseOrders: PurchaseOrder[] = Array.from({ length: 15 }, (_, i) => ({
    id: `po-${i + 1}`,
    supplierId: `supplier-${Math.floor(Math.random() * 5) + 1}`,
    supplier: {
      id: `supplier-${Math.floor(Math.random() * 5) + 1}`,
      name: ['Office Supplies Inc.', 'Tech Solutions', 'Furniture World', 'Raw Materials Co.', 'Packaging Experts'][Math.floor(Math.random() * 5)],
      contactPerson: 'John Doe',
      email: 'contact@example.com',
      phone: '123-456-7890',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    orderDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    expectedDeliveryDate: new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    status: ['draft', 'pending', 'approved', 'ordered', 'received', 'cancelled'][Math.floor(Math.random() * 6)] as any,
    totalAmount: Math.round(Math.random() * 10000) / 10,
    notes: 'Purchase order notes',
    createdById: 'user-1',
    approvedById: Math.random() > 0.5 ? 'user-2' : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
      id: `po-item-${i}-${j}`,
      purchaseOrderId: `po-${i + 1}`,
      itemId: `item-${Math.floor(Math.random() * 20) + 1}`,
      quantity: Math.floor(Math.random() * 100) + 1,
      unitPrice: Math.round(Math.random() * 1000) / 10,
      totalPrice: Math.round(Math.random() * 10000) / 10,
    })),
  }));
  
  const filteredOrders = purchaseOrders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddOrder = () => {
    setSelectedOrder(null);
    setIsModalOpen(true);
  };
  
  const handleEditOrder = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };
  
  const handleViewOrder = (order: PurchaseOrder) => {
    // View order details
    console.log('View order', order);
  };
  
  const handleDeleteOrder = (order: PurchaseOrder) => {
    // Delete order
    console.log('Delete order', order);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save order
    console.log('Save order', selectedOrder);
    setIsModalOpen(false);
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'ordered':
        return 'bg-purple-100 text-purple-800';
      case 'received':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const columns: Column<PurchaseOrder>[] = [
    { header: 'PO Number', accessor: 'id' as keyof PurchaseOrder },
    { header: 'Supplier', accessor: (order: PurchaseOrder) => order.supplier?.name },
    { 
      header: 'Order Date', 
      accessor: (order: PurchaseOrder) => new Date(order.orderDate).toLocaleDateString() 
    },
    { 
      header: 'Expected Delivery', 
      accessor: (order: PurchaseOrder) => new Date(order.expectedDeliveryDate).toLocaleDateString() 
    },
    { 
      header: 'Status', 
      accessor: (order: PurchaseOrder) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      ) 
    },
    { 
      header: 'Total Amount', 
      accessor: (order: PurchaseOrder) => `$${order.totalAmount.toFixed(2)}` 
    },
    {
      header: 'Actions',
      accessor: (order: PurchaseOrder) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              handleViewOrder(order);
            }}
            className="min-w-0 p-2"
          >
            <Eye size={16} className="text-blue-600" />
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleEditOrder(order)}
            className="min-w-0 p-2"
          >
            <Edit size={16} className="text-gray-600" />
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeleteOrder(order)}
            className="min-w-0 p-2"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex justify-between items-center">
          <div className="flex-1 flex items-center space-x-4">
            <div className="relative flex-1 max-w-xs">
              <Input
                label="Search"
                name="search"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Button
            variant="primary"
            onClick={handleAddOrder}
          >
            <Plus className="mr-2" size={16} />
            New Order
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <Table
            columns={columns}
            data={filteredOrders}
            keyExtractor={(order) => order.id}
            onRowClick={handleViewOrder}
          />
        </div>
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedOrder ? 'Edit Purchase Order' : 'New Purchase Order'}
        size="lg"
        footer={
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
            >
              {selectedOrder ? 'Update' : 'Create'}
            </Button>
          </div>
        }
      >
        <Form
          onSubmit={handleSubmit}
          title={selectedOrder ? 'Edit Purchase Order' : 'New Purchase Order'}
          description="Enter the purchase order details below"
        >
          <Select
            label="Supplier"
            name="supplierId"
            value={selectedOrder?.supplierId || ''}
            onChange={(value: string) => setSelectedOrder(prev => prev ? { ...prev, supplierId: value } : null)}
            required
            options={[
              { value: 'supplier-1', label: 'Office Supplies Inc.' },
              { value: 'supplier-2', label: 'Tech Solutions' },
              { value: 'supplier-3', label: 'Furniture World' },
              { value: 'supplier-4', label: 'Raw Materials Co.' },
              { value: 'supplier-5', label: 'Packaging Experts' }
            ]}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Order Date"
              name="orderDate"
              type="date"
              value={selectedOrder?.orderDate?.split('T')[0] || ''}
              onChange={(e) => setSelectedOrder(prev => prev ? { ...prev, orderDate: e.target.value } : null)}
              required
            />
            
            <Input
              label="Expected Delivery Date"
              name="expectedDeliveryDate"
              type="date"
              value={selectedOrder?.expectedDeliveryDate?.split('T')[0] || ''}
              onChange={(e) => setSelectedOrder(prev => prev ? { ...prev, expectedDeliveryDate: e.target.value } : null)}
              required
            />
          </div>
          
          <Select
            label="Status"
            name="status"
            value={selectedOrder?.status || ''}
            onChange={(value: string) => setSelectedOrder(prev => prev ? { ...prev, status: value as PurchaseOrder['status'] } : null)}
            required
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'ordered', label: 'Ordered' },
              { value: 'received', label: 'Received' },
              { value: 'cancelled', label: 'Cancelled' }
            ]}
          />
          
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">Order Items</h3>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedOrder?.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <select
                            className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            value={item.itemId}
                            onChange={(e) => {
                              const newItems = [...selectedOrder.items];
                              newItems[index] = { ...newItems[index], itemId: e.target.value };
                              setSelectedOrder({ ...selectedOrder, items: newItems });
                            }}
                          >
                            <option value="item-1">Item 1</option>
                            <option value="item-2">Item 2</option>
                            <option value="item-3">Item 3</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Input
                            type="number"
                            label="Quantity"
                            name={`item-${index}-quantity`}
                            value={item.quantity.toString()}
                            onChange={(e) => {
                              const newItems = [...selectedOrder.items];
                              newItems[index] = { 
                                ...newItems[index], 
                                quantity: parseInt(e.target.value),
                                totalPrice: parseInt(e.target.value) * newItems[index].unitPrice
                              };
                              setSelectedOrder({ ...selectedOrder, items: newItems });
                            }}
                            min={1}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Input
                            type="number"
                            label="Unit Price"
                            name={`item-${index}-price`}
                            value={item.unitPrice.toString()}
                            onChange={(e) => {
                              const newItems = [...selectedOrder.items];
                              newItems[index] = { 
                                ...newItems[index], 
                                unitPrice: parseFloat(e.target.value),
                                totalPrice: newItems[index].quantity * parseFloat(e.target.value)
                              };
                              setSelectedOrder({ ...selectedOrder, items: newItems });
                            }}
                            min={0}
                            step={0.01}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${item.totalPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Button
                            variant="danger"
                            onClick={() => {
                              const newItems = selectedOrder.items.filter((_, i) => i !== index);
                              setSelectedOrder({ ...selectedOrder, items: newItems });
                            }}
                            className="min-w-0 p-2"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        No items added yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="mt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  const newItem = {
                    id: `temp-item-${Date.now()}`,
                    purchaseOrderId: selectedOrder?.id || '',
                    itemId: '',
                    quantity: 1,
                    unitPrice: 0,
                    totalPrice: 0,
                  };
                  
                  setSelectedOrder(prev => {
                    if (!prev) return null;
                    return {
                      ...prev,
                      items: [...(prev.items || []), newItem],
                    };
                  });
                }}
              >
                <Plus size={14} className="mr-2" />
                Add Item
              </Button>
            </div>
          </div>
          
          <div>
            <TextArea
              label="Notes"
              name="notes"
              value={selectedOrder?.notes || ''}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setSelectedOrder(prev => prev ? { ...prev, notes: e.target.value } : null)}
              rows={3}
              placeholder="Enter any additional notes"
            />
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default PurchaseOrders;