export interface Customer {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  customerType: 'individual' | 'business' | 'government';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SalesOrder {
  id: string;
  customerId: string;
  customer?: Customer;
  storeId: string;
  orderDate: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  discount: number;
  tax: number;
  finalAmount: number;
  notes: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  items: SalesOrderItem[];
  payments: Payment[];
}

export interface SalesOrderItem {
  id: string;
  salesOrderId: string;
  itemId: string;
  item?: Item;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalPrice: number;
}

export interface Payment {
  id: string;
  salesOrderId: string;
  amount: number;
  paymentMethod: 'cash' | 'credit_card' | 'bank_transfer' | 'check' | 'other';
  paymentDate: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId: string;
  notes: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface PriceHistory {
  id: string;
  itemId: string;
  item?: Item;
  oldPrice: number;
  newPrice: number;
  effectiveDate: string;
  changedById: string;
  reason: string;
  createdAt: string;
}