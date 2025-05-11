import { Supplier, PurchaseOrder, ProcurementRequest } from '../types/procurement.types';
import { handleResponse, createHeaders } from '../utils/api.utils';

export const BASE_URL = 'http://localhost:8000/api/procurement';

export const getSuppliers = async (token: string): Promise<Supplier[]> => {
  console.log('Fetching suppliers from API...');
  const response = await fetch(`${BASE_URL}/suppliers/`, {
    headers: createHeaders(token),
  });
  return handleResponse(response);
};

export const getSupplier = async (token: string, id: string): Promise<Supplier> => {
  const response = await fetch(`${BASE_URL}/suppliers/${id}/`, {
    headers: createHeaders(token),
  });
  return handleResponse(response);
};

export const createSupplier = async (token: string, data: Partial<Supplier>): Promise<Supplier> => {
  const response = await fetch(`${BASE_URL}/suppliers/`, {
    method: 'POST',
    headers: createHeaders(token),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const updateSupplier = async (token: string, id: string, data: Partial<Supplier>): Promise<Supplier> => {
  const response = await fetch(`${BASE_URL}/suppliers/${id}/`, {
    method: 'PUT',
    headers: createHeaders(token),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const deleteSupplier = async (token: string, id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/suppliers/${id}/`, {
    method: 'DELETE',
    headers: createHeaders(token)
  });
  await handleResponse(response);
};

export const getPurchaseOrders = async (token: string): Promise<PurchaseOrder[]> => {
  const response = await fetch(`${BASE_URL}/purchase-orders`, {
    headers: createHeaders(token)
  });
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

interface ProcurementStats {
  pendingOrdersCount: number;
}

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