export interface Supplier {
  supplier_id: string;
  supplier_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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

export interface Item {
  item_id: number;
  name: string;
  description: string;
  unitPrice: string;
  unitMeasurement: string;
  category?: number;
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

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface ProcurementRequest {
  procurement_id: number;
  request_date: string;
  required_by: string;
  status: 'pending' | 'approved' | 'rejected' | 'ordered' | 'completed';
  requested_by: number;
  requested_by_details?: User;
  approved_by?: number;
  approved_by_details?: User;
  items: ProcurementRequestItem[];
}

export interface ProcurementRequestItem {
  procurement_item_id: number;
  procurement: number;
  item: number;
  item_details?: Item;
  requested_quantity: number;
}