import React, { useState, useEffect } from 'react';
import { TruckIcon, ArrowRightIcon, PackageCheck, AlertTriangle } from 'lucide-react';
import Modal from '../../components/common/Modal';
import type { Column } from '../../components/common/Table';
import Table from '../../components/common/Table';
import { Form, Select, Button } from '../../components/forms';
import type { Warehouse, Distribution, Inventory, CreateDistributionData } from '../../types/inventory.types';
type DistributionType = Distribution;
import { getWarehouses, getInventoryByWarehouse } from '../../api/inventory';
import { getDistributions, createDistribution } from '../../api/distribution';

const DistributionPage: React.FC = () => {
  // Add a container class for better spacing and organization
  const containerClass = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8';
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sourceInventory, setSourceInventory] = useState<Inventory[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    sourceWarehouse: string;
    destinationWarehouse: string;
    items: { id: string; quantity: number; }[];
  }>({
    sourceWarehouse: '',
    destinationWarehouse: '',
    items: [{ id: '', quantity: 0 }]
  });


  useEffect(() => {
    fetchDistributions();
    fetchWarehouses();
  }, []);

  const fetchDistributions = async () => {
    try {
      const data = await getDistributions();
      setDistributions(data);
    } catch (error) {
      console.error('Error fetching distributions:', error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const data = await getWarehouses();
      setWarehouses(data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  const handleWarehouseChange = async (name: string, value: string) => {
    setError(null);
    
    // Reset form data first
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Only reset items when warehouse changes
      ...(name === 'sourceWarehouse' ? { items: [{ id: '', quantity: 0 }] } : {})
    }));

    if (name === 'sourceWarehouse') {
      setSourceInventory([]); // Clear inventory immediately

      if (value) {
        try {
          // First verify the warehouse exists
          const warehouseExists = warehouses.some(w => w.warehouse_id.toString() === value);
          if (!warehouseExists) {
            setError('Selected warehouse does not exist');
            setFormData(prev => ({
              ...prev,
              [name]: '',
              items: [{ id: '', quantity: 0 }]
            }));
            return;
          }

          // Then fetch inventory
          const inventory = await getInventoryByWarehouse(value);
          if (!inventory || inventory.length === 0) {
            setError('No items available in this warehouse. Please add inventory first.');
            setSourceInventory([]);
          } else {
            setSourceInventory(inventory);
            setError(null);
          }
        } catch (error: any) {
          console.error('Error fetching warehouse inventory:', error);
          const errorMessage = error.response?.data?.detail || 
                             error.response?.data?.error ||
                             error.message || 
                             'Failed to fetch warehouse inventory';
          setError(errorMessage);
          setSourceInventory([]);
          
          // Reset warehouse selection if warehouse doesn't exist
          if (errorMessage.includes('not found') || errorMessage.includes('does not exist')) {
            setFormData(prev => ({
              ...prev,
              [name]: '',
              items: [{ id: '', quantity: 0 }]
            }));
          }
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!formData.sourceWarehouse || !formData.destinationWarehouse) {
        setError('Please select both source and destination warehouses');
        return;
      }

      if (!formData.items.length || formData.items.some(item => !item.id || item.quantity <= 0)) {
        setError('Please add at least one item with valid quantity');
        return;
      }

      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 7); // Default to 7 days from now

      const distributionData: CreateDistributionData = {
        source_warehouse: parseInt(formData.sourceWarehouse),
        destination_warehouse: parseInt(formData.destinationWarehouse),
        estimated_delivery: estimatedDelivery.toISOString(),
        items: formData.items.map(item => ({
          item: parseInt(item.id),
          quantity: item.quantity
        }))
      };

      console.log('Creating distribution:', distributionData);
      await createDistribution(distributionData);

      setIsModalOpen(false);
      setFormData({
        sourceWarehouse: '',
        destinationWarehouse: '',
        items: [{ id: '', quantity: 0 }]
      });
      fetchDistributions();
    } catch (error) {
      console.error('Error creating distribution:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred while creating the distribution');
      }
    }
  };

  const getStatusBadge = (status: Distribution['status']) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      in_transit: { color: 'bg-blue-100 text-blue-800', icon: TruckIcon },
      completed: { color: 'bg-green-100 text-green-800', icon: PackageCheck },
      cancelled: { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`flex items-center px-2 py-1 rounded-full text-sm ${config.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    );
  };

  const columns: Column<Distribution>[] = [
    {
      header: 'Source',
      accessor: (row: Distribution) => row.source_warehouse_name
    },
    {
      header: '',
      accessor: () => (
        <div className="flex justify-center">
          <ArrowRightIcon className="w-4 h-4 text-gray-400" />
        </div>
      )
    },
    {
      header: 'Destination',
      accessor: (row: Distribution) => row.destination_warehouse_name
    },
    {
      header: 'Items',
      accessor: (row: Distribution) => row.items.length,
      cell: ({ row }: { row: { original: Distribution } }) => (
        <div className="flex items-center">
          <span className="text-sm font-medium">{row.original.items.length} items</span>
          <button
            className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
            onClick={() => {/* Show items detail modal */}}
          >
            View
          </button>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (row: DistributionType) => getStatusBadge(row.status)
    },
    {
      header: 'Created',
      accessor: (row: Distribution) => new Date(row.created_at).toLocaleDateString()
    },
    {
      header: 'Estimated Delivery',
      accessor: (row: Distribution) => new Date(row.estimated_delivery).toLocaleDateString()
    }
  ];

  return (
    <div className={containerClass}>
      <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <TruckIcon className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Distribution</h1>
        </div>
        <p className="text-gray-600">Manage inventory transfers between warehouses</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
        >
          <PackageCheck className="h-5 w-5" />
          Add New Distribution
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
          <Table
            columns={columns}
            data={distributions}
            emptyMessage="No distributions found"
            keyExtractor={(item) => item.distribution_id.toString()}
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Distribution"
        size="lg"
      >
        <Form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center pb-5 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">New Distribution Request</h2>
              <p className="mt-1 text-sm text-gray-500">
                Transfer items between warehouses by creating a new distribution request.
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}
            {/* Warehouse Selection Section */}
            <div className="bg-white shadow sm:rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                  <div className="md:col-span-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="rounded-md bg-indigo-50 p-3">
                          <TruckIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Warehouse Selection</h3>
                        <p className="mt-1 text-sm text-gray-500">Choose source and destination warehouses for the distribution.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="w-full">
                          <Select
                            label="Source Warehouse"
                            name="sourceWarehouse"
                            value={formData.sourceWarehouse}
                            onChange={(value: string) => handleWarehouseChange('sourceWarehouse', value)}
                            options={[
                              { value: '', label: 'Select source warehouse' },
                              ...warehouses.map(w => ({ value: w.warehouse_id.toString(), label: w.warehouse_name }))
                            ]}
                          />
                        </div>

                        <div className="flex items-center justify-center">
                          <div className="rounded-full bg-gray-100 p-2">
                            <ArrowRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                        </div>

                        <div className="w-full">
                          <Select
                            label="Destination Warehouse"
                            name="destinationWarehouse"
                            value={formData.destinationWarehouse}
                            onChange={(value: string) => handleWarehouseChange('destinationWarehouse', value)}
                            options={[
                              { value: '', label: 'Select destination warehouse' },
                              ...warehouses
                                .filter(w => w.warehouse_id.toString() !== formData.sourceWarehouse)
                                .map(w => ({ value: w.warehouse_id.toString(), label: w.warehouse_name }))
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div className="bg-white shadow sm:rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                  <div className="md:col-span-1">
                    <div>
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="rounded-md bg-gray-100 p-2">
                            <PackageCheck className="h-5 w-5 text-gray-600" aria-hidden="true" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Distribution Items</h3>
                          <p className="mt-1 text-sm text-gray-500">Select items from source warehouse and specify quantities for distribution.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="space-y-4">
                      {/* Add Item Button */}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            items: [...formData.items, { id: '', quantity: 0 }]
                          })}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!formData.sourceWarehouse}
                        >
                          Add New Item
                        </button>
                      </div>

                      {/* Items List */}
                      <div className="space-y-4">
                        <div className="space-y-4">
                          {formData.items.map((item, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                              <div className="p-4">
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                                  <div className="sm:col-span-10">
                                    <div className="bg-white p-4 rounded border border-gray-200 w-full">
                                      <div className="grid grid-cols-12 gap-2 items-end">
                                        {/* Item Selection */}
                                        <div className="col-span-6">
                                          <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
                                          <select
                                            value={item.id}
                                            onChange={(e) => {
                                              const selectedId = e.target.value;
                                              const newItems = [...formData.items];
                                              newItems[index] = { ...newItems[index], id: selectedId, quantity: 0 };
                                              setFormData(prev => ({ ...prev, items: newItems }));
                                            }}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 bg-white font-medium text-gray-900"
                                            required
                                          >
                                            <option value="" className="text-gray-500">Select Item</option>
                                            {sourceInventory && sourceInventory.length > 0 ? (
                                              sourceInventory.map((inv) => (
                                                <option 
                                                  key={inv.item.item_id} 
                                                  value={inv.item.item_id}
                                                  className="font-medium text-gray-900"
                                                >
                                                  {inv.item.name}
                                                </option>
                                              ))
                                            ) : (
                                              <option disabled className="text-gray-500">No items available</option>
                                            )}
                                          </select>
                                        </div>

                                        {/* Available Quantity Display */}
                                        <div className="col-span-3 text-center">
                                          <label className="block text-sm font-medium text-gray-700 mb-2">Available</label>
                                          <div className="h-10 w-16 mx-auto px-2 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-600 flex items-center justify-center font-medium">
                                            {item.id ? sourceInventory?.find(inv => inv.item.item_id.toString() === item.id)?.available_quantity || 0 : '-'}
                                          </div>
                                        </div>

                                        {/* Distribution Quantity Input */}
                                        <div className="col-span-3 text-center">
                                          <label className="block text-sm font-medium text-gray-700 mb-2">Distribute *</label>
                                          <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => {
                                              const newItems = [...formData.items];
                                              newItems[index] = { ...newItems[index], quantity: parseInt(e.target.value) || 0 };
                                              setFormData({ ...formData, items: newItems });
                                            }}
                                            className="block w-16 mx-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 text-center"
                                            placeholder="Quantity"
                                            min="1"
                                            max={item.id ? sourceInventory?.find(inv => inv.item.item_id.toString() === item.id)?.available_quantity : undefined}
                                            required
                                          />
                                        </div>
                                      </div>

                                      {/* Show max quantity warning if needed */}
                                      {item.id && item.quantity > 0 && (
                                        <div className="mt-2 text-sm">
                                          {(() => {
                                            const availableQty = sourceInventory?.find(inv => inv.item.item_id.toString() === item.id)?.available_quantity || 0;
                                            if (item.quantity > availableQty) {
                                              return (
                                                <div className="flex items-center gap-2 text-red-600">
                                                  <AlertTriangle className="h-4 w-4" />
                                                  <p>Cannot distribute more than available quantity ({availableQty})</p>
                                                </div>
                                              );
                                            } else if (item.quantity === availableQty) {
                                              return (
                                                <div className="flex items-center gap-2 text-orange-600">
                                                  <AlertTriangle className="h-4 w-4" />
                                                  <p>This will distribute all available items</p>
                                                </div>
                                              );
                                            }
                                            return null;
                                          })()}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="sm:col-span-2 flex justify-end">
                                    {index > 0 && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newItems = formData.items.filter((_, i) => i !== index);
                                          setFormData({ ...formData, items: newItems });
                                        }}
                                        className="inline-flex items-center px-3 py-2 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                      >
                                        Remove
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="bg-gray-50 px-6 py-4 sm:px-8 rounded-lg flex items-center justify-between mt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                All fields marked with * are required
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Cancel
                </button>
                <Button 
                  type="submit" 
                  variant="primary"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  <TruckIcon className="h-5 w-5" />
                  Create Distribution
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DistributionPage;
