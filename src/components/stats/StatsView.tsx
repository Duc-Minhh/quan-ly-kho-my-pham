import React from 'react';
import type { Product } from '../../types/product';
import { formatVND } from '../../utils/formatters';
import { BarChart3, AlertTriangle, ShieldCheck, DollarSign } from 'lucide-react';

interface StatsViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const StatsView: React.FC<StatsViewProps> = ({ products, onSelectProduct }) => {
  const totalProducts = products.length;
  const totalUnits = products.reduce((acc, p) => acc + p.quantity, 0);
  const totalInventoryValueVnd = products.reduce((acc, p) => acc + p.quantity * p.salePrice, 0);

  const urgentRestock = products.filter((p) => p.quantity <= 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Thống kê kho sản phẩm</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Báo cáo chi tiết về giá trị hàng tồn, định lượng và các mặt hàng cần nhập bổ sung
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Tổng giá trị hàng tồn (VND)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-2">
            {formatVND(totalInventoryValueVnd)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Tính theo giá bán lẻ từng mặt hàng</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Tổng số lượng sản phẩm</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            {totalUnits} <span className="text-xs font-normal text-slate-500">cái / hộp</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Trải đều trên {totalProducts} phân loại mặt hàng</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Cần nhập bổ sung</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 mt-2">
            {urgentRestock.length} <span className="text-xs font-normal text-slate-500">mã SP</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Gồm các sản phẩm hết hàng hoặc số lượng ≤ 5</p>
        </div>
      </div>

      {/* Urgent Restock List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">
              Danh sách sản phẩm sắp hết hoặc đã hết hàng
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {urgentRestock.length} sản phẩm
          </span>
        </div>

        {urgentRestock.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Tồn kho an toàn!</p>
            <p className="text-xs">Tất cả các sản phẩm đều đang có số lượng trên 5 cái/hộp.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {urgentRestock.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onSelectProduct(prod)}
                className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 group-hover:text-brand-600 transition-colors">
                      {prod.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {prod.code} • {prod.brand} • {prod.unit}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        prod.quantity === 0
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {prod.quantity === 0 ? '🔴 Hết hàng (0)' : `🟡 Sắp hết (${prod.quantity})`}
                    </span>
                    <div className="text-xs font-bold text-brand-700 mt-0.5">
                      {formatVND(prod.salePrice)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
