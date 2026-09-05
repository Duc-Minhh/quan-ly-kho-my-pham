import React from 'react';
import type { Product } from '../../types/product';
import { getStockStatus } from '../../types/product';
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface DashboardViewProps {
  products: Product[];
  onNavigateToProducts: (brandFilter?: string, statusFilter?: string) => void;
  onOpenAddModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  onNavigateToProducts,
  onOpenAddModal,
}) => {
  const totalProducts = products.length;
  const inStock = products.filter((p) => getStockStatus(p.quantity) === 'in_stock').length;
  const lowStock = products.filter((p) => getStockStatus(p.quantity) === 'low_stock').length;
  const outOfStock = products.filter((p) => getStockStatus(p.quantity) === 'out_of_stock').length;

  const totalUnits = products.reduce((acc, p) => acc + p.quantity, 0);

  // Group by brand
  const brandCounts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.brand] = (acc[p.brand] || 0) + 1;
    return acc;
  }, {});

  const sortedBrands = Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Group by category
  const categoryCounts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-sky-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-semibold mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kho Tra Cứu Sản Phẩm Cá Nhân</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Tra cứu nhanh thông tin kho mỹ phẩm
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-2 leading-relaxed">
            Hệ thống hỗ trợ phản hồi khách hàng ngay lập tức: kiểm tra tồn kho, công dụng, hãng và giá bán chỉ trong vài giây.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => onNavigateToProducts()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-brand-700 hover:bg-slate-100 text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all"
            >
              <Package className="w-4 h-4" />
              <span>Xem danh sách kho ({totalProducts})</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-800/80 hover:bg-brand-900 border border-white/20 text-white text-xs sm:text-sm font-bold rounded-xl transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm sản phẩm mới</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-72 h-72 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total products */}
        <div
          onClick={() => onNavigateToProducts()}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:border-brand-300 hover:shadow-card-hover transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tổng sản phẩm
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            {totalProducts}
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Tổng số lượng: {totalUnits} cái/hộp</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-brand-600" />
          </p>
        </div>

        {/* In stock */}
        <div
          onClick={() => onNavigateToProducts(undefined, 'in_stock')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:border-emerald-300 hover:shadow-card-hover transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Đang còn hàng
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-3">
            {inStock}
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Số lượng &gt; 5</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-emerald-600" />
          </p>
        </div>

        {/* Low stock */}
        <div
          onClick={() => onNavigateToProducts(undefined, 'low_stock')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:border-amber-300 hover:shadow-card-hover transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sắp hết hàng
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-3">
            {lowStock}
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Số lượng 1 - 5 cái</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-amber-600" />
          </p>
        </div>

        {/* Out of stock */}
        <div
          onClick={() => onNavigateToProducts(undefined, 'out_of_stock')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:border-rose-300 hover:shadow-card-hover transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Đã hết hàng
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-3">
            {outOfStock}
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Số lượng = 0</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-rose-600" />
          </p>
        </div>
      </div>

      {/* Grid: Top Brands & Categories breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Brands */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              <h3 className="text-base font-bold text-slate-900">
                Top thương hiệu có nhiều sản phẩm nhất
              </h3>
            </div>
            <span className="text-xs text-slate-400">Nhấp để lọc nhanh</span>
          </div>

          <div className="space-y-3">
            {sortedBrands.map(([brand, count]) => {
              const percent = totalProducts ? Math.round((count / totalProducts) * 100) : 0;
              return (
                <div
                  key={brand}
                  onClick={() => onNavigateToProducts(brand)}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-100 hover:border-brand-200 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1.5">
                    <span className="group-hover:text-brand-700 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-brand-500" />
                      {brand}
                    </span>
                    <span className="text-slate-500 font-mono">
                      {count} sản phẩm ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-600 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Categories breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Phân loại mặt hàng trong kho
            </h3>
            <span className="text-xs text-slate-400">Danh mục chính</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <div
                key={cat}
                onClick={() => onNavigateToProducts(undefined, undefined)}
                className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors cursor-pointer"
              >
                <div className="text-xs font-semibold text-slate-500">{cat}</div>
                <div className="text-xl font-bold text-slate-800 mt-1">
                  {count} <span className="text-xs font-normal text-slate-400">loại</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-brand-50 border border-brand-100 text-xs text-brand-800 leading-relaxed">
            💡 <strong>Mẹo tư vấn khách hàng:</strong> Nhấn phím tắt <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono font-bold">Ctrl + K</kbd> bất cứ lúc nào để ngay lập tức nhảy vào thanh tìm kiếm!
          </div>
        </div>
      </div>
    </div>
  );
};
