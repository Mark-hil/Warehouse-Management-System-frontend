import { api } from './api';
import { PurchaseOrder, Supplier } from '../types/procurement.types';

export class ProcurementService {
  private static instance: ProcurementService;
  private baseUrl = '/procurement';

  private constructor() {}

  public static getInstance(): ProcurementService {
    if (!ProcurementService.instance) {
      ProcurementService.instance = new ProcurementService();
    }
    return ProcurementService.instance;
  }

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    return api.get<Supplier[]>(`${this.baseUrl}/suppliers`);
  }

  async getSupplier(id: string): Promise<Supplier> {
    return api.get<Supplier>(`${this.baseUrl}/suppliers/${id}`);
  }

  async createSupplier(supplier: Omit<Supplier, 'id'>): Promise<Supplier> {
    return api.post<Supplier>(`${this.baseUrl}/suppliers`, supplier);
  }

  async updateSupplier(id: string, supplier: Partial<Supplier>): Promise<Supplier> {
    return api.put<Supplier>(`${this.baseUrl}/suppliers/${id}`, supplier);
  }

  async deleteSupplier(id: string): Promise<void> {
    return api.delete(`${this.baseUrl}/suppliers/${id}`);
  }

  // Purchase Orders
  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    return api.get<PurchaseOrder[]>(`${this.baseUrl}/purchase-orders`);
  }

  async getPurchaseOrder(id: string): Promise<PurchaseOrder> {
    return api.get<PurchaseOrder>(`${this.baseUrl}/purchase-orders/${id}`);
  }

  async createPurchaseOrder(order: Omit<PurchaseOrder, 'id'>): Promise<PurchaseOrder> {
    return api.post<PurchaseOrder>(`${this.baseUrl}/purchase-orders`, order);
  }

  async updatePurchaseOrder(id: string, order: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    return api.put<PurchaseOrder>(`${this.baseUrl}/purchase-orders/${id}`, order);
  }

  async deletePurchaseOrder(id: string): Promise<void> {
    return api.delete(`${this.baseUrl}/purchase-orders/${id}`);
  }

  // Receiving
  async receivePurchaseOrder(id: string, receivedItems: any[]): Promise<PurchaseOrder> {
    return api.post<PurchaseOrder>(`${this.baseUrl}/purchase-orders/${id}/receive`, { items: receivedItems });
  }

  // Analytics
  async getSupplierStats(supplierId: string): Promise<any> {
    return api.get(`${this.baseUrl}/suppliers/${supplierId}/stats`);
  }

  async getProcurementReport(startDate: string, endDate: string): Promise<any> {
    return api.get(`${this.baseUrl}/reports/procurement`, {
      params: { startDate, endDate }
    });
  }
}

export const procurementService = ProcurementService.getInstance();
