import { Supplier, PurchaseOrder, ProcurementRequest } from '../types/procurement.types';

interface ProcurementStats {
  pendingOrdersCount: number;
}
import { handleResponse, createHeaders } from '../utils/api.utils';

const BASE_URL = '/api/procurement';

export const getSuppliers = async (): Promise<Supplier[]> => {
  const response = await fetch(`${BASE_URL}/suppliers`);
  return handleResponse(response);
};

export const getPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  const response = await fetch(`${BASE_URL}/purchase-orders`);
  return handleResponse(response);
};

export const createPurchaseOrder = async (order: Omit<PurchaseOrder, 'id'>): Promise<PurchaseOrder> => {
  const response = await fetch(`${BASE_URL}/purchase-orders`, {
    method: 'POST',
    headers: createHeaders(),
    body: JSON.stringify(order),
  });
  return handleResponse(response);
};

export const getProcurementRequests = async (): Promise<ProcurementRequest[]> => {
  const response = await fetch(`${BASE_URL}/requests`);
  return handleResponse(response);
};

export const getProcurementStats = async (): Promise<ProcurementStats> => {
  const response = await fetch(`${BASE_URL}/stats`);
  return handleResponse(response);
};

export const createProcurementRequest = async (request: Omit<ProcurementRequest, 'id'>): Promise<ProcurementRequest> => {
  const response = await fetch(`${BASE_URL}/requests`, {
    method: 'POST',
    headers: createHeaders(),
    body: JSON.stringify(request),
  });
  return handleResponse(response);
};