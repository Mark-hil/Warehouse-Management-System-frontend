import { Supplier } from '../types/procurement.types';

export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Tech Solutions Inc.',
    contactPerson: 'John Smith',
    email: 'john@techsolutions.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street',
    city: 'Silicon Valley',
    state: 'CA',
    zipCode: '94025',
    country: 'USA',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Global Supplies Co.',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@globalsupplies.com',
    phone: '+1 (555) 987-6543',
    address: '456 Supply Avenue',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Quality Parts Ltd.',
    contactPerson: 'Michael Brown',
    email: 'michael@qualityparts.com',
    phone: '+1 (555) 456-7890',
    address: '789 Parts Road',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    country: 'USA',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
