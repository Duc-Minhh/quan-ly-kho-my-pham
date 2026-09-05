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
  salePrice: number;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export const getStockStatus = (quantity: number): StockStatus => {
  if (quantity <= 0) return 'out_of_stock';
  if (quantity <= 5) return 'low_stock';
  return 'in_stock';
};

export const getStockStatusInfo = (quantity: number) => {
  const status = getStockStatus(quantity);
  switch (status) {
    case 'in_stock':
      return {
        status,
        label: 'Còn hàng',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dotClass: 'bg-emerald-500',
        icon: '🟢',
      };
    case 'low_stock':
      return {
        status,
        label: 'Sắp hết',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        dotClass: 'bg-amber-500',
        icon: '🟡',
      };
    case 'out_of_stock':
      return {
        status,
        label: 'Hết hàng',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        dotClass: 'bg-rose-500',
        icon: '🔴',
      };
  }
};
