import { Customer, SalesOrder, Payment } from '../types/sales.types';

interface SalesStats {
  monthlyRevenue: number;
  pendingDeliveries: number;
}
import { handleResponse, createHeaders } from '../utils/api.utils';

const BASE_URL = '/api/sales';

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await fetch(`${BASE_URL}/customers`);
  return handleResponse(response);
};

export const getSalesOrders = async (): Promise<SalesOrder[]> => {
  const response = await fetch(`${BASE_URL}/orders`);
  return handleResponse(response);
};

export const createSalesOrder = async (order: Omit<SalesOrder, 'id'>): Promise<SalesOrder> => {
  const response = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: createHeaders(),
    body: JSON.stringify(order),
  });
  return handleResponse(response);
};

export const getSalesStats = async (): Promise<SalesStats> => {
  // TODO: Replace with actual API call
  return {
    monthlyRevenue: 250000,
    pendingDeliveries: 8
  };
};

export const processPayment = async (payment: Omit<Payment, 'id'>): Promise<Payment> => {
  const response = await fetch(`${BASE_URL}/payments`, {
    method: 'POST',
    headers: createHeaders(),
    body: JSON.stringify(payment),
  });
  return handleResponse(response);
};