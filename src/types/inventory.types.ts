export interface Category {
  category_id: number;
  name: string;
  description: string | null;
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
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentCapacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Inventory {
  id: string;
  itemId: string;
  item?: Item;
  warehouseId: string;
  warehouse?: Warehouse;
  quantity: number;
  minimumQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Distribution {
  id: string;
  itemId: string;
  item?: Item;
  sourceWarehouseId: string;
  sourceWarehouse?: Warehouse;
  destinationWarehouseId: string;
  destinationWarehouse?: Warehouse;
  quantity: number;
  userId: string;
  status: 'pending' | 'in_transit' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}