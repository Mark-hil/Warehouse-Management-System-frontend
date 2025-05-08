import React, { useState, ChangeEvent, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Table, { Column } from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import { Form, Input, Select, TextArea } from '../../components/forms';
import Button from '../../components/common/Button';
import { Item, Category } from '../../types/inventory.types';
import { getItems, createItem, getCategories } from '../../api/inventory';
import { useAuth } from '../../context/AuthContext';

const UNIT_OPTIONS = [
  { value: '', label: 'Select Unit' },
  { value: 'pcs', label: 'Pieces' },
  { value: 'kg', label: 'Kilograms' },
  { value: 'liter', label: 'Liters' },
  { value: 'box', label: 'Boxes' },
];

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
  const { state: authState } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
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

    if (authState.isAuthenticated) {
      fetchData();
    } else {
      navigate('/login');
    }
  }, [authState.isAuthenticated, navigate]);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category?.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleAddItem = () => {
    setSelectedItem(null);
    resetForm();
    setIsModalOpen(true);
  };
  
  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };
  
  const handleViewItem = (item: Item) => {
    // View item details
    console.log('View item', item);
  };
  
  const handleDeleteItem = (item: Item) => {
    // Delete item
    console.log('Delete item', item);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { name, unitPrice, unitMeasurement, categoryId } = formState;
      
      if (!name || !unitPrice || !unitMeasurement || !categoryId) {
        alert('Please fill in all required fields');
        return;
      }

      const itemData = {
        name,
        description: formState.description,
        unitPrice: parseFloat(unitPrice),
        unitMeasurement,
        categoryId
      };

      console.log('Submitting data:', itemData);
      
      // Create the item
      await createItem(itemData);
      
      // Reset form
      resetForm();
      
      // Close modal
      setIsModalOpen(false);
      
      // Refresh items list
      const updatedItems = await getItems();
      setItems(updatedItems);
    } catch (error: any) {
      console.error('Error creating item:', error);
      alert(`Failed to create item: ${JSON.stringify(error)}`);
    }
  };
  
  const columns: Column<Item>[] = [
    { header: 'Name', accessor: (item: Item) => item.name },
    { header: 'Category', accessor: (item: Item) => item.category?.name },
    { header: 'Price', accessor: (item: Item) => `$${Number(item.unitPrice).toFixed(2)}` },
    { header: 'Unit', accessor: (item: Item) => item.unitMeasurement },
    {
      header: 'Actions',
      accessor: (item: Item) => (
        <div className="flex space-x-2">
          <button
            className="p-1 text-blue-600 hover:text-blue-800"
            onClick={(e) => {
              e.stopPropagation();
              handleViewItem(item);
            }}
          >
            <Eye size={18} />
          </button>
          <button
            className="p-1 text-yellow-600 hover:text-yellow-800"
            onClick={(e) => {
              e.stopPropagation();
              handleEditItem(item);
            }}
          >
            <Edit size={18} />
          </button>
          <button
            className="p-1 text-red-600 hover:text-red-800"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteItem(item);
            }}
          >
            <Trash2 size={18} />
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
          keyExtractor={(item) => item.id}
          onRowClick={handleViewItem}
        />
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
    </div>
  );
};

export default Items;