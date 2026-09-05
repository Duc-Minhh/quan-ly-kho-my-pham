import React from 'react';
import { Menu, Database, RotateCcw } from 'lucide-react';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  onResetData: () => void;
  totalProducts: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileMenu,
  onResetData,
  totalProducts,
  inStockCount,
  lowStockCount,
  outOfStockCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          aria-label="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Database className="w-3.5 h-3.5" />
            Lưu trữ offline (LocalStorage)
          </span>
        </div>
      </div>

      {/* Quick inventory badges */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs">
        <div className="hidden md:flex items-center gap-2 font-medium">
          <span className="text-slate-500">
            Tổng: <strong className="text-slate-800">{totalProducts}</strong>
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700">
            🟢 Còn: <strong>{inStockCount}</strong>
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-amber-700">
            🟡 Sắp hết: <strong>{lowStockCount}</strong>
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-rose-700">
            🔴 Hết: <strong>{outOfStockCount}</strong>
          </span>
        </div>

        {/* Reset defaults button */}
        <button
          type="button"
          onClick={onResetData}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-500 hover:text-brand-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          title="Tải lại danh sách sản phẩm mẫu ban đầu"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Khôi phục mẫu</span>
        </button>
      </div>
    </header>
  );
};
