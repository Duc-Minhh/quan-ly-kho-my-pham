export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Product {
  id: string;
  code: string;
  image: string;
  category: string;
  brand: string;
  name: string;
  usage: string;
  originalPriceWon: number;
  unit: string;
  quantity: number;
  status?: 'in_stock' | 'out_of_stock';
  salePrice: number;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export const getStockStatus = (quantityOrProduct: number | Product): StockStatus => {
  if (typeof quantityOrProduct === 'object' && quantityOrProduct !== null) {
    if (quantityOrProduct.status) return quantityOrProduct.status;
    return quantityOrProduct.quantity <= 0 ? 'out_of_stock' : 'in_stock';
  }
  if (quantityOrProduct <= 0) return 'out_of_stock';
  if (quantityOrProduct <= 5) return 'low_stock';
  return 'in_stock';
};

export const getStockStatusInfo = (target: number | Product | string) => {
  let status: StockStatus;
  if (typeof target === 'object' && target !== null) {
    status = getStockStatus(target);
  } else if (typeof target === 'number') {
    status = getStockStatus(target);
  } else {
    status = target as StockStatus;
  }

  if (status === 'out_of_stock') {
    return {
      status: 'out_of_stock' as const,
      label: 'Hết hàng',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      dotClass: 'bg-rose-500',
      icon: '🔴',
    };
  }

  if (status === 'low_stock') {
    return {
      status: 'low_stock' as const,
      label: 'Sắp hết',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      dotClass: 'bg-amber-500',
      icon: '🟡',
    };
  }

  return {
    status: 'in_stock' as const,
    label: 'Còn hàng',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500',
    icon: '🟢',
  };
};
