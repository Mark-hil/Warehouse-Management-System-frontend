export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  warehouseId?: string;
  categoryId?: string;
  itemId?: string;
  supplierId?: string;
  customerId?: string;
  status?: string;
}

export interface SalesReport {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  totalSales: number;
  totalOrders: number;
  topSellingItems: {
    itemId: string;
    itemName: string;
    quantity: number;
    totalAmount: number;
  }[];
  salesByStore: {
    storeId: string;
    storeName: string;
    totalAmount: number;
  }[];
  createdById: string;
  createdAt: string;
}

export interface InventoryReport {
  id: string;
  title: string;
  description: string;
  date: string;
  warehouseId?: string;
  warehouseName?: string;
  totalItems: number;
  lowStockItems: {
    itemId: string;
    itemName: string;
    currentQuantity: number;
    minimumQuantity: number;
  }[];
  inventoryValue: number;
  createdById: string;
  createdAt: string;
}

export interface ProcurementReport {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  totalPurchases: number;
  totalAmount: number;
  supplierBreakdown: {
    supplierId: string;
    supplierName: string;
    orderCount: number;
    totalAmount: number;
  }[];
  createdById: string;
  createdAt: string;
}

export interface MaintenanceRecord {
  id: string;
  itemId: string;
  itemName: string;
  maintenanceType: 'routine' | 'repair' | 'inspection';
  description: string;
  performedBy: string;
  cost: number;
  date: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}