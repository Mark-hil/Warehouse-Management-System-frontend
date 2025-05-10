import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import Modal from '../../components/common/Modal';
import type { Column } from '../../components/common/Table';
import Table from '../../components/common/Table';
import { Form, Button } from '../../components/forms';
import { getCategories, getWarehouses } from '../../api/inventory';
import { api } from '../../api/api';

import { Category, Warehouse } from '../../types/inventory.types';
import { CreateCategoryData } from '../../api/inventory';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: '',
    description: '',
    warehouses: []
  });

  useEffect(() => {
    fetchWarehouses();
    fetchCategories();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const data = await getWarehouses();
      setWarehouses(data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      setError('Failed to fetch warehouses');
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWarehouseChange = (warehouseId: number) => {
    // Verify the warehouse exists before adding it
    const warehouseExists = warehouses.some(w => w.warehouse_id === warehouseId);
    if (!warehouseExists) {
      console.warn(`Attempted to select non-existent warehouse ID: ${warehouseId}`);
      setError('Selected warehouse no longer exists');
      return;
    }

    setFormData(prev => {
      const currentWarehouses = prev.warehouses || [];
      const newWarehouses = currentWarehouses.includes(warehouseId)
        ? currentWarehouses.filter(id => id !== warehouseId)
        : [...currentWarehouses, warehouseId];
      return { ...prev, warehouses: newWarehouses };
    });
    setError(null);
  };

  const handleSelectAllWarehouses = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      warehouses: checked ? warehouses.map(w => w.warehouse_id) : []
    }));
    setError(null);
  };

  const createCategory = async (data: any) => {
    try {
      if (selectedCategory) {
        // Update existing category
        await api.put(`/inventory/categories/${selectedCategory.category_id}/`, data);
      } else {
        // Create new category
        await api.post('/inventory/categories/', data);
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!formData.name) {
        setError('Category name is required');
        return;
      }

      // Filter out any warehouses that don't exist in the database
      const validWarehouses = formData.warehouses?.filter(id => 
        warehouses.some(w => w.warehouse_id === id)
      ) || [];

      if (formData.warehouses?.length !== validWarehouses.length) {
        console.warn('Some selected warehouses were not found in the database');
      }

      await createCategory({
        name: formData.name,
        description: formData.description,
        warehouses: validWarehouses,
      });

      setIsModalOpen(false);
      fetchCategories();
      setFormData({
        name: '',
        description: '',
        warehouses: [],
      });
    } catch (error) {
      console.error('Error creating category:', error);
      setError('Failed to create category');
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      warehouses: category.warehouses || []
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/inventory/categories/${id}/`);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const columns: Column<Category>[] = [
    {
      header: 'Name',
      accessor: (row: Category) => (
        <div className="flex items-center">
          <Tag className="w-4 h-4 mr-2 text-blue-500" />
          {row.name}
        </div>
      )
    },
    { header: 'Description', accessor: 'description' as keyof Category },
    {
      header: 'Items',
      accessor: (row: Category) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {row.item_count}
        </span>
      )
    },
    {
      header: 'Created',
      accessor: (row: Category) => {
        const date = new Date(row.created_at);
        return date.toLocaleDateString();
      }
    },
    {
      header: 'Actions',
      accessor: (row: Category) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={() => handleEdit(row)}
            className="min-w-0 p-2"
          >
            <Edit2 size={16} className="text-blue-600" />
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDelete(row.category_id)}
            className="min-w-0 p-2"
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
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage your inventory categories</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedCategory(null);
            setFormData({ name: '', description: '', warehouses: [] });
            setIsModalOpen(true);
          }}
        >
          <Plus className="mr-2" size={16} />
          Add Category
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={categories}
          emptyMessage="No categories found"
          keyExtractor={(item) => item.category_id.toString()}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
          setFormData({ name: '', description: '', warehouses: [] });
        }}
        title={selectedCategory ? 'Edit Category' : 'Add Category'}
      >
        <Form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-8">
              {/* Name Field */}
              <div className="relative">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-2">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 bg-white text-gray-900 text-base rounded-lg border border-gray-200
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder:text-gray-400 transition duration-200"
                  placeholder="e.g., Electronics, Furniture"
                />
              </div>

              {/* Description Field */}
              <div className="relative">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white text-gray-900 text-base rounded-lg border border-gray-200
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder:text-gray-400 transition duration-200 resize-none"
                  placeholder="Describe what types of items belong in this category..."
                />
              </div>

              {/* Warehouse Selection */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="warehouses" className="block text-sm font-semibold text-gray-800">
                    Assign to Warehouses <span className="text-rose-500">*</span>
                  </label>
                  <div className="tooltip" data-tip="Hold Ctrl/Cmd to select multiple warehouses">
                    <svg className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help transition-colors" 
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 divide-y divide-gray-200">
                  {/* Select All Header */}
                  <div className="p-3 bg-gray-50">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.warehouses?.length === warehouses.length}
                        onChange={(e) => handleSelectAllWarehouses(e.target.checked)}
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        Select All Warehouses
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({formData.warehouses?.length || 0} of {warehouses.length} selected)
                      </span>
                    </label>
                  </div>

                  {/* Warehouse List */}
                  <div className="max-h-48 overflow-y-auto p-1 space-y-1">
                    {warehouses.map(warehouse => {
                      const isChecked = formData.warehouses?.includes(warehouse.warehouse_id) || false;
                      return (
                        <label
                          key={warehouse.warehouse_id}
                          className={`flex items-center p-2 rounded-md cursor-pointer transition-colors
                                    ${isChecked ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleWarehouseChange(warehouse.warehouse_id)}
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-700">{warehouse.warehouse_name}</p>
                                <p className="text-xs text-gray-500">{warehouse.location}</p>
                              </div>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            {error && (
            <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-end gap-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedCategory(null);
                  setFormData({ name: '', description: '', warehouses: [] });
                }}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300
                           rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200
                           transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg
                           hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                           transition duration-200"
              >
                {selectedCategory ? 'Update' : 'Create'} Category
              </button>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
