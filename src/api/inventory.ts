import { Category, Item, Distribution, Inventory, Warehouse } from '../types/inventory.types';

export interface CreateDistributionData {
  source_warehouse: number;
  destination_warehouse: number;
  estimated_delivery: string;
  items: { item: number; quantity: number }[];
}
import { api } from './api';

interface InventoryStats {
  totalValue: number;
  lowStockCount: number;
  pendingTasks: number;
  completedTasks: number;
  urgentTasks: number;
}

export const getItems = async (): Promise<Item[]> => {
  try {
    const items = await api.get<Item[]>('/inventory/items/');
    return items.map((item: Item) => ({
      ...item,
      unitPrice: Number(item.unitPrice)
    }));
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export const getInventory = async (): Promise<Inventory[]> => {
  try {
    return await api.get<Inventory[]>('/inventory/inventory/');
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }
};

export const getInventoryByWarehouse = async (warehouseId: string | number): Promise<Inventory[]> => {
  try {
    // First check if warehouse exists
    try {
      const warehouse = await api.get<Warehouse>(`/inventory/warehouses/${warehouseId}/`);
      if (!warehouse) {
        throw new Error('Warehouse not found');
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Warehouse not found');
      }
      // Only throw if it's a server error
      if (error.response?.status >= 500) {
        throw new Error('Server error while checking warehouse. Please try again.');
      }
      // For other errors, continue trying to get inventory
      console.warn('Warning: Could not verify warehouse existence:', error.message);
    }

    // Get inventory directly
    try {
      const response = await api.get<Inventory[]>('/inventory/inventory/', {
        params: { warehouse: warehouseId }
      });

      if (!response || !Array.isArray(response)) {
        console.error('Invalid inventory response format:', response);
        return [];
      }

      const validInventory = response.filter(item => {
        if (!item || !item.item || item.available_quantity === undefined) {
          console.warn('Invalid inventory item:', item);
          return false;
        }
        return true;
      });

      if (validInventory.length === 0) {
        console.warn('No valid inventory items found for warehouse:', warehouseId);
      }

      return validInventory;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn('No inventory found for warehouse:', warehouseId);
        return [];
      }
      if (error.response?.status >= 500) {
        throw new Error('Server error while fetching inventory. Please try again.');
      }
      throw error;
    }
  } catch (error: any) {
    const message = error.response?.data?.detail || 
                   error.response?.data?.error ||
                   error.message || 
                   'Failed to fetch inventory';
    console.error('Error fetching warehouse inventory:', message);
    throw new Error(message);
  }
};

export interface CreateCategoryData {
  name: string;
  description?: string;
  warehouses?: number[];
}

export const createCategory = async (data: CreateCategoryData): Promise<Category> => {
  try {
    return await api.post<Category>('/inventory/categories/', data);
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    return await api.get<Category[]>('/inventory/categories/');
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getWarehouses = async (): Promise<Warehouse[]> => {
  try {
    return await api.get<Warehouse[]>('/inventory/warehouses/');
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    throw error;
  }
};

export const getInventoryStats = async (): Promise<InventoryStats> => {
  // TODO: Replace with actual API call
  return {
    totalValue: 1000000,
    lowStockCount: 5,
    pendingTasks: 12,
    completedTasks: 45,
    urgentTasks: 3
  };
};

import { CreateItemData } from '../types/inventory.types';

export const createItem = async (itemData: CreateItemData): Promise<Item> => {
  try {
    const data = await api.post<Item>('/inventory/items/', {
      ...itemData,
      unitPrice: Number(itemData.unitPrice)
    });
    if (!data) throw new Error('Failed to create item');
    return {
      ...data,
      unitPrice: Number(data.unitPrice)
    };
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

export const updateItem = async (itemId: string | number, itemData: Partial<CreateItemData>): Promise<Item> => {
  try {
    const processedData = itemData.unitPrice ? {
      ...itemData,
      unitPrice: Number(itemData.unitPrice)
    } : itemData;

    const data = await api.put<Item>(`/inventory/items/${itemId}/`, processedData);
    if (!data) throw new Error('Failed to update item');
    return {
      ...data,
      unitPrice: Number(data.unitPrice)
    };
  } catch (error: any) {
    console.error('Error updating item:', error.response?.data || error);
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { message: 'Failed to update item' };
  }
};

export const deleteItem = async (itemId: string | number): Promise<void> => {
  try {
    await api.delete(`/inventory/items/${itemId}/`);
  } catch (error: any) {
    console.error('Error deleting item:', error.response?.data || error);
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { message: 'Failed to delete item' };
  }
};

export interface CreateDistributionData {
  source_warehouse: number;
  destination_warehouse: number;
  estimated_delivery: string;
  items: { item: number; quantity: number; }[];
}

export const createDistribution = async (data: CreateDistributionData): Promise<Distribution> => {
  return await api.post<Distribution>('/inventory/distributions/', data);
};

export const createWarehouse = async (data: { warehouse_name: string; location: string; capacity: number; is_active: boolean }): Promise<Warehouse> => {
  return await api.post<Warehouse>('/inventory/warehouses/', data);
};

export const updateWarehouse = async (id: number, data: Partial<{ warehouse_name: string; location: string; capacity: number; is_active: boolean }>): Promise<Warehouse> => {
  return await api.put<Warehouse>(`/inventory/warehouses/${id}/`, data);
};

export const deleteWarehouse = async (id: number): Promise<void> => {
  await api.delete(`/inventory/warehouses/${id}/`);
};

export const getDistributions = async (): Promise<Distribution[]> => {
  const data = await api.get<Distribution[]>('/inventory/distributions/');
  return data || [];
};



export const updateDistribution = async (id: number, data: Partial<{
  status: 'pending' | 'in_transit' | 'completed' | 'cancelled';
}>): Promise<Distribution> => {
  return await api.put<Distribution>(`/inventory/distributions/${id}/`, data);
};

export const deleteDistribution = async (id: number): Promise<void> => {
  await api.delete(`/inventory/distributions/${id}/`);
};