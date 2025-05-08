import { api } from './api';
import { Item, Category } from '../types/inventory.types';

export class InventoryService {
  private static instance: InventoryService;
  private baseUrl = '/inventory';

  private constructor() {}

  public static getInstance(): InventoryService {
    if (!InventoryService.instance) {
      InventoryService.instance = new InventoryService();
    }
    return InventoryService.instance;
  }

  // Items
  async getItems(): Promise<Item[]> {
    return api.get<Item[]>(`${this.baseUrl}/items`);
  }

  async getItem(id: string): Promise<Item> {
    return api.get<Item>(`${this.baseUrl}/items/${id}`);
  }

  async createItem(item: Omit<Item, 'id'>): Promise<Item> {
    return api.post<Item>(`${this.baseUrl}/items`, item);
  }

  async updateItem(id: string, item: Partial<Item>): Promise<Item> {
    return api.put<Item>(`${this.baseUrl}/items/${id}`, item);
  }

  async deleteItem(id: string): Promise<void> {
    return api.delete(`${this.baseUrl}/items/${id}`);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return api.get<Category[]>(`${this.baseUrl}/categories`);
  }

  async getCategory(id: string): Promise<Category> {
    return api.get<Category>(`${this.baseUrl}/categories/${id}`);
  }

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    return api.post<Category>(`${this.baseUrl}/categories`, category);
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    return api.put<Category>(`${this.baseUrl}/categories/${id}`, category);
  }

  async deleteCategory(id: string): Promise<void> {
    return api.delete(`${this.baseUrl}/categories/${id}`);
  }
}

export const inventoryService = InventoryService.getInstance();
