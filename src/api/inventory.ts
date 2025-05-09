import { Item, Category, Warehouse, Distribution } from '../types/inventory.types';
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
    const data = await api.get<Item[]>('/inventory/items/');
    return (data || []).map((item: Item) => ({
      ...item,
      unitPrice: Number(item.unitPrice)
    }));
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const data = await api.get<Category[]>('/inventory/categories/');
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getWarehouses = async (): Promise<Warehouse[]> => {
  try {
    const data = await api.get<Warehouse[]>('/inventory/warehouses/');
    return data || [];
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

export const createDistribution = async (data: Omit<Distribution, 'id'>): Promise<Distribution> => {
  return await api.post<Distribution>('/inventory/distributions/', data);
};