import React, { useState, useEffect, ChangeEvent } from 'react';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import Modal from '../../components/common/Modal';
import type { Column } from '../../components/common/Table';
import Table from '../../components/common/Table';
import { Form, Input, TextArea, Button } from '../../components/forms';

interface Category {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  createdAt: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Replace with your API call
      const response = await fetch('/api/inventory/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        // Update existing category
        await fetch(`/api/inventory/categories/${selectedCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        // Create new category
        await fetch('/api/inventory/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      setIsModalOpen(false);
      setSelectedCategory(null);
      setFormData({ name: '', description: '' });
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await fetch(`/api/inventory/categories/${id}`, {
          method: 'DELETE'
        });
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
          {row.itemCount}
        </span>
      )
    },
    {
      header: 'Created',
      accessor: 'createdAt' as keyof Category
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
            onClick={() => handleDelete(row.id)}
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
            setFormData({ name: '', description: '' });
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
          keyExtractor={(item) => item.id}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCategory ? 'Edit Category' : 'Add Category'}
      >
        <Form
          onSubmit={handleSubmit}
          title={selectedCategory ? 'Edit Category Details' : 'New Category Details'}
          description="Enter the category information below"
        >
          <Input
            label="Category Name"
            name="name"
            value={formData.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter category name"
            required
          />
          <TextArea
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter category description"
            rows={3}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
