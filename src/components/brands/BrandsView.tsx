import React from 'react';
import type { Product } from '../../types/product';
import { Sparkles, ArrowRight } from 'lucide-react';

interface BrandsViewProps {
  products: Product[];
  onSelectBrand: (brand: string) => void;
}

export const BrandsView: React.FC<BrandsViewProps> = ({ products, onSelectBrand }) => {
  // Aggregate brand details
  const brandsMap = products.reduce<
    Record<string, { count: number; totalUnits: number; sampleProduct: Product }>
  >((acc, prod) => {
    if (!acc[prod.brand]) {
      acc[prod.brand] = { count: 0, totalUnits: 0, sampleProduct: prod };
    }
    acc[prod.brand].count += 1;
    acc[prod.brand].totalUnits += prod.quantity;
    return acc;
  }, {});

  const brandsList = Object.entries(brandsMap).sort((a, b) => b[1].count - a[1].count);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Danh sách Thương hiệu</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý và tra cứu các dòng sản phẩm theo từng hãng mỹ phẩm
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 w-fit">
          Tổng cộng {brandsList.length} thương hiệu
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {brandsList.map(([brand, info]) => (
          <div
            key={brand}
            onClick={() => onSelectBrand(brand)}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:border-brand-300 hover:shadow-card-hover transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/60">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  {brand}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {info.totalUnits} cái/hộp
                </span>
              </div>

              <div className="text-base font-bold text-slate-800 group-hover:text-brand-700 transition-colors">
                {info.count} mã sản phẩm
              </div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                Sản phẩm đại diện: {info.sampleProduct.name}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-600">
              <span>Xem danh sách mặt hàng</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
