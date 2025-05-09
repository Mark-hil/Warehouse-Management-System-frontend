import React, { useState, ChangeEvent, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import { Form, Input, Select, TextArea } from '../../components/forms';
import Button from '../../components/common/Button';
import { Item, Category } from '../../types/inventory.types';
import { getItems, createItem, getCategories, updateItem, deleteItem } from '../../api/inventory';
import { useAuth } from '../../context/AuthContext';

const UNIT_OPTIONS = [
  { value: '', label: 'Select Unit' },
  { value: 'pcs', label: 'Pieces' },
  { value: 'kg', label: 'Kilograms' },
  { value: 'liter', label: 'Liters' },
  { value: 'box', label: 'Boxes' },
];

interface ViewModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewModal: React.FC<ViewModalProps> = ({ item, isOpen, onClose }) => {
  if (!item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Item Details"
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Name</h3>
          <p className="mt-1 text-sm text-gray-900">{item.name}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Description</h3>
          <p className="mt-1 text-sm text-gray-900">{item.description || 'No description'}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Unit Price</h3>
            <p className="mt-1 text-sm text-gray-900">${item.unitPrice.toFixed(2)}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Unit Measurement</h3>
            <p className="mt-1 text-sm text-gray-900">{item.unitMeasurement}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Category</h3>
          <p className="mt-1 text-sm text-gray-900">{item.category?.name || 'Uncategorized'}</p>
        </div>
      </div>
    </Modal>
  );
};

const Items: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  
  const categoryOptions = useMemo(() => [
    { value: '', label: 'All Categories' },
    ...categories.map(cat => ({
      value: cat.category_id.toString(),
      label: cat.name
    }))
  ], [categories]);

  console.log('Category options:', categoryOptions);
  const navigate = useNavigate();
  const auth = useAuth();
  const authState = auth?.state;
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    unitPrice: '',
    unitMeasurement: '',
    categoryId: ''
  });

  const resetForm = () => {
    setFormState({
      name: '',
      description: '',
      unitPrice: '',
      unitMeasurement: '',
      categoryId: ''
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [itemsData, categoriesData] = await Promise.all([
          getItems(),
          getCategories()
        ]);
        setItems(itemsData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        if (err instanceof Error && err.message.includes('401')) {
          navigate('/login');
        } else {
          setError(err instanceof Error ? err.message : 'Failed to fetch data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (authState?.isAuthenticated) {
      fetchData();
    } else {
      navigate('/login');
    }
  }, [authState?.isAuthenticated, navigate]);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.category?.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleAddItem = () => {
    setSelectedItem(null);
    resetForm();
    setIsEditModalOpen(true);
  };
  
  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setFormState({
      name: item.name,
      description: item.description || '',
      unitPrice: item.unitPrice.toString(),
      unitMeasurement: item.unitMeasurement,
      categoryId: (item.category?.category_id || '').toString()
    });
    setIsEditModalOpen(true);
  };

  const handleViewItem = (item: Item) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleDeleteItem = async (item: Item) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(item.item_id);
        const updatedItems = await getItems();
        setItems(updatedItems);
        alert('Item deleted successfully');
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item');
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { name, description, unitPrice, unitMeasurement, categoryId } = formState;

      if (!name || !unitPrice || !unitMeasurement || !categoryId) {
        alert('Please fill in all required fields');
        return;
      }

      const itemData = {
        name,
        description,
        unitPrice: parseFloat(unitPrice),
        unitMeasurement,
        categoryId: parseInt(categoryId)
      };

      if (selectedItem) {
        await updateItem(selectedItem.item_id, itemData);
        alert('Item updated successfully');
      } else {
        await createItem(itemData);
        alert('Item created successfully');
      }

      const updatedItems = await getItems();
      setItems(updatedItems);
      resetForm();
      setIsEditModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save item');
    }
  };
  
  type Column = {
    header: string;
    accessor: (item: Item) => React.ReactNode;
  };

  const columns: Column[] = [
    { header: 'Name', accessor: (item: Item) => item.name },
    { header: 'Description', accessor: (item: Item) => item.description || '-' },
    { header: 'Unit Price', accessor: (item: Item) => `$${Number(item.unitPrice).toFixed(2)}` },
    { header: 'Unit', accessor: (item: Item) => item.unitMeasurement },
    { header: 'Category', accessor: (item: Item) => item.category?.name || '-' },
    {
      header: 'Actions',
      accessor: (item: Item) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewItem(item);
            }}
            className="text-gray-600 hover:text-gray-800"
            title="View Details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditItem(item);
            }}
            className="text-blue-600 hover:text-blue-800"
            title="Edit Item"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteItem(item);
            }}
            className="text-red-600 hover:text-red-800"
            title="Delete Item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Items</h1>
        <Button
          variant="primary"
          onClick={handleAddItem}
        >
          <Plus className="mr-2" size={16} />
          Add Item
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-64">
              <Input
                label="Search"
                icon={<Search size={18} />}
                name="search"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                onClick={() => {}}
              >
                <Filter className="mr-2" size={16} />
                Filter
              </Button>
              
              <Select
                label="Category Filter"
                name="categoryFilter"
                options={categoryOptions}
                onChange={() => {}}
                value=""
              />
            </div>
          </div>
        </div>
        
        <Table
          columns={columns}
          data={filteredItems}
          keyExtractor={(item) => item.item_id.toString()}
          onRowClick={() => {}}
        />
      </div>
      
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={selectedItem ? 'Edit Item' : 'Add New Item'}
      >
        <Form
          onSubmit={handleSubmit}
          title={selectedItem ? 'Edit Item' : 'Add New Item'}
          description="Fill in the item details below"
        >
          <Input
            label="Item Name"
            name="name"
            value={formState.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              setFormState(prev => ({ ...prev, name: e.target.value }))
            }
            placeholder="Enter item name"
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Unit Price"
              name="unitPrice"
              type="number"
              step="0.01"
              value={formState.unitPrice}
              onChange={(e: ChangeEvent<HTMLInputElement>) => 
                setFormState(prev => ({ ...prev, unitPrice: e.target.value }))
              }
              placeholder="0.00"
              required
            />
            
            <Select
              label="Unit Measurement"
              name="unitMeasurement"
              value={formState.unitMeasurement}
              onChange={(value: string) => 
                setFormState(prev => ({ ...prev, unitMeasurement: value }))
              }
              required
              options={UNIT_OPTIONS}
            />
          </div>
          
          <Select
            label="Category"
            name="category"
            value={formState.categoryId}
            onChange={(value: string) => 
              setFormState(prev => ({ ...prev, categoryId: value }))
            }
            required
            options={categoryOptions.slice(1)}
          />
          
          <TextArea
            label="Description"
            name="description"
            value={formState.description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => 
              setFormState(prev => ({ ...prev, description: e.target.value }))
            }
            placeholder="Enter item description"
            rows={3}
          />
        </Form>
      </Modal>

      <ViewModal
        item={selectedItem}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />
    </div>
  );
};

export default Items;