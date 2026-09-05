export interface Product {
  id: string;
  code: string;
  category: string;
  brand: string;
  name: string;
  usage: string;
  originalPriceWon: number;
  unit: string;
  tax: number; // percentage, e.g. 8
  salePrice: number; // VND
  quantity: number;
  stockAvailable?: number;
}

export interface ImportItem {
  id: string;
  productId: string;
  category: string;
  brand: string;
  name: string;
  usage: string;
  originalPriceWon: number;
  unit: string;
  quantity: number;
  tax: number; // percentage
  salePrice: number; // VND
  total: number; // quantity * salePrice
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
}

export interface ImportOrder {
  id: string; // e.g. "PN-20260905-001"
  importDate: string;
  supplierId: string;
  supplierName: string;
  staffName: string;
  notes: string;
  items: ImportItem[];
  otherFee: number;
  status: 'draft' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface OrderSummary {
  totalProducts: number;
  totalQuantity: number;
  subtotal: number;
  totalTax: number;
  otherFee: number;
  totalPayment: number;
}
