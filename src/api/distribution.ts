import { api } from './api';
import { Distribution, CreateDistributionData } from '../types/inventory.types';

export const getDistributions = async (): Promise<Distribution[]> => {
  try {
    return await api.get<Distribution[]>('/inventory/distributions/');
  } catch (error) {
    console.error('Error fetching distributions:', error);
    throw error;
  }
};

export const createDistribution = async (data: CreateDistributionData): Promise<Distribution> => {
  try {
    return await api.post<Distribution>('/inventory/distributions/', data);
  } catch (error) {
    console.error('Error creating distribution:', error);
    throw error;
  }
};
