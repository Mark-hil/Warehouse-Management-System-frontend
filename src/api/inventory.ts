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
    return await api.get<Item[]>('/inventory/items/');
  } catch (error) {
    console.error('Error fetching items:', error);
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

interface CreateItemData {
  name: string;
  description: string;
  unitPrice: string | number;
  unitMeasurement: string;
  categoryId: string;
}

export const createItem = async (itemData: CreateItemData): Promise<Item> => {
  try {
    console.log('Sending data to server:', itemData);
    const { data } = await api.post<{ data: Item }>('/inventory/items/', itemData);
    console.log('Server response:', data);
    return data as Item;
  } catch (error: any) {
    console.error('Error creating item:', error.response?.data || error);
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { message: 'Failed to create item' };
  }
};

export const createDistribution = async (data: Omit<Distribution, 'id'>): Promise<Distribution> => {
  return await api.post<Distribution>('/inventory/distributions/', data);
};