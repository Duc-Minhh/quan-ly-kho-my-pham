import React from 'react';
import { Menu, Plus, ChevronRight, Bell, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  onCreateNewOrder: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onCreateNewOrder,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Hamburger & Breadcrumb & Page Titles */}
        <div className="flex items-start gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 mt-1 transition-colors"
            aria-label="Mở menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <span>Kho hàng</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                Nhập hàng
              </span>
            </div>

            {/* Page Header */}
            <div className="flex items-baseline gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Nhập hàng
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                <ShieldCheck className="w-3 h-3" />
                Dữ liệu kho thời gian thực
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Quản lý và tạo phiếu nhập hàng vào kho mỹ phẩm chính hãng
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2.5 sm:self-center">
          {/* Notifications */}
          <button
            type="button"
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-slate-200/80 transition-colors"
            title="Thông báo kho"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-600 rounded-full ring-2 ring-white" />
          </button>

          {/* "+ Tạo phiếu nhập" Button */}
          <button
            onClick={onCreateNewOrder}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-150"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo phiếu nhập</span>
          </button>
        </div>
      </div>
    </header>
  );
};
