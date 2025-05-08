export interface Category {
  category_id: number;
  name: string;
  description: string | null;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  unitPrice: string | number;
  unitMeasurement: string;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
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