import { useState, useCallback } from 'react';
import * as inventoryApi from '../api/inventory';
import { Item, Category, Warehouse } from '../types/inventory.types';

export const useInventory = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await inventoryApi.getItems();
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await inventoryApi.getCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWarehouses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await inventoryApi.getWarehouses();
      setWarehouses(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch warehouses');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    items,
    categories,
    warehouses,
    loading,
    error,
    fetchItems,
    fetchCategories,
    fetchWarehouses,
  };
};