import { ReportFilter, SalesReport, InventoryReport, ProcurementReport } from '../types/reports.types';
import { handleResponse, createHeaders } from '../utils/api.utils';

const BASE_URL = '/api/reports';

export const getSalesReport = async (filter: ReportFilter): Promise<SalesReport> => {
  const params = new URLSearchParams(filter as any);
  const response = await fetch(`${BASE_URL}/sales?${params}`);
  return handleResponse(response);
};

export const getInventoryReport = async (filter: ReportFilter): Promise<InventoryReport> => {
  const params = new URLSearchParams(filter as any);
  const response = await fetch(`${BASE_URL}/inventory?${params}`);
  return handleResponse(response);
};

export const getProcurementReport = async (filter: ReportFilter): Promise<ProcurementReport> => {
  const params = new URLSearchParams(filter as any);
  const response = await fetch(`${BASE_URL}/procurement?${params}`);
  return handleResponse(response);
};