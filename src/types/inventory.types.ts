export interface Category {
  category_id: number;
  name: string;
  description: string;
  created_at: string;
  item_count: number;
  warehouses?: number[];
}

export interface Item {
  item_id: number;
  name: string;
  description: string | null;
  unitPrice: number;
  unitMeasurement: string;
  category?: Category;
}

export interface CreateItemData {
  name: string;
  description: string;
  unitPrice: number;
  unitMeasurement: string;
  categoryId: number;
}

export interface Warehouse {
  warehouse_id: number;
  warehouse_name: string;
  location: string;
  capacity: number;
  current_capacity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DistributionItem {
  distribution_item_id: number;
  item: number;
  item_name: string;
  quantity: number;
}

export interface Distribution {
  distribution_id: number;
  source_warehouse: number;
  source_warehouse_name: string;
  destination_warehouse: number;
  destination_warehouse_name: string;
  created_by: number;
  created_by_name: string;
  created_at: string;
  estimated_delivery: string;
  status: 'pending' | 'in_transit' | 'completed' | 'cancelled';
  items: DistributionItem[];
}

export interface Inventory {
  inventory_id: number;
  warehouse: Warehouse;
  item: Item;
  available_quantity: number;
  minimum_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CreateDistributionData {
  source_warehouse: number;
  destination_warehouse: number;
  estimated_delivery: string;
  items: { item: number; quantity: number }[];
}