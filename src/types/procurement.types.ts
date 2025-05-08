export interface Supplier {
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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplier?: Supplier;
  orderDate: string;
  expectedDeliveryDate: string;
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';
  totalAmount: number;
  notes: string;
  createdById: string;
  approvedById?: string;
  createdAt: string;
  updatedAt: string;
  items: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  itemId: string;
  item?: Item;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ProcurementRequest {
  id: string;
  requesterId: string;
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'ordered' | 'completed';
  deadline: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  items: ProcurementRequestItem[];
}

export interface ProcurementRequestItem {
  id: string;
  requestId: string;
  itemId: string;
  item?: Item;
  quantity: number;
  reason: string;
}