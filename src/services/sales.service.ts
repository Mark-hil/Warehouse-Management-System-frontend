import { api } from './api';
import { Customer, Order } from '../types/sales.types';

export class SalesService {
  private static instance: SalesService;
  private baseUrl = '/sales';

  private constructor() {}

  public static getInstance(): SalesService {
    if (!SalesService.instance) {
      SalesService.instance = new SalesService();
    }
    return SalesService.instance;
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    return api.get<Customer[]>(`${this.baseUrl}/customers`);
  }

  async getCustomer(id: string): Promise<Customer> {
    return api.get<Customer>(`${this.baseUrl}/customers/${id}`);
  }

  async createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
    return api.post<Customer>(`${this.baseUrl}/customers`, customer);
  }

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    return api.put<Customer>(`${this.baseUrl}/customers/${id}`, customer);
  }

  async deleteCustomer(id: string): Promise<void> {
    return api.delete(`${this.baseUrl}/customers/${id}`);
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return api.get<Order[]>(`${this.baseUrl}/orders`);
  }

  async getOrder(id: string): Promise<Order> {
    return api.get<Order>(`${this.baseUrl}/orders/${id}`);
  }

  async createOrder(order: Omit<Order, 'id'>): Promise<Order> {
    return api.post<Order>(`${this.baseUrl}/orders`, order);
  }

  async updateOrder(id: string, order: Partial<Order>): Promise<Order> {
    return api.put<Order>(`${this.baseUrl}/orders/${id}`, order);
  }

  async deleteOrder(id: string): Promise<void> {
    return api.delete(`${this.baseUrl}/orders/${id}`);
  }

  // Analytics
  async getCustomerStats(customerId: string): Promise<any> {
    return api.get(`${this.baseUrl}/customers/${customerId}/stats`);
  }

  async getSalesReport(startDate: string, endDate: string): Promise<any> {
    return api.get(`${this.baseUrl}/reports/sales`, {
      params: { startDate, endDate }
    });
  }
}

export const salesService = SalesService.getInstance();
