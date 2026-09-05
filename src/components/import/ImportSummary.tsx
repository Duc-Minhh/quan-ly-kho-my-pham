import React from 'react';
import type { OrderSummary } from '../../types/import';
import { formatVND, formatNumber } from '../../utils/formatters';
import { Calculator, Receipt, ShieldCheck } from 'lucide-react';

interface ImportSummaryProps {
  summary: OrderSummary;
  onOtherFeeChange: (fee: number) => void;
}

export const ImportSummary: React.FC<ImportSummaryProps> = ({
  summary,
  onOtherFeeChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 sm:p-6 mb-6">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-brand-600" />
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Tổng kết giá trị phiếu nhập
          </h4>
        </div>
        <span className="text-xs text-slate-400">Tự động tính thuế VAT 8%</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4">
        {/* 1. Tổng số sản phẩm */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Tổng mặt hàng
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-800 mt-1">
            {summary.totalProducts} <span className="text-xs font-normal text-slate-500">loại</span>
          </div>
        </div>

        {/* 2. Tổng số lượng */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Tổng số lượng
          </div>
          <div className="text-lg sm:text-xl font-bold text-brand-700 mt-1">
            {formatNumber(summary.totalQuantity)}{' '}
            <span className="text-xs font-normal text-slate-500">sp</span>
          </div>
        </div>

        {/* 3. Tổng tiền hàng */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Tổng tiền hàng
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-800 mt-1.5 truncate">
            {formatVND(summary.subtotal)}
          </div>
        </div>

        {/* 4. Tổng thuế 8% */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Thuế GTGT</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded font-bold">
              8%
            </span>
          </div>
          <div className="text-sm sm:text-base font-bold text-emerald-700 mt-1.5 truncate">
            +{formatVND(summary.totalTax)}
          </div>
        </div>

        {/* 5. Chi phí khác */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Chi phí khác
          </div>
          <div className="mt-1 flex items-center">
            <input
              type="number"
              min="0"
              step="10000"
              value={summary.otherFee}
              onChange={(e) => onOtherFeeChange(Math.max(0, parseInt(e.target.value) || 0))}
              placeholder="0"
              className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-white border border-slate-200 rounded px-2 py-0.5 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* 6. TỔNG THANH TOÁN (LÀM NỔI BẬT CAO NHẤT) */}
        <div className="col-span-2 sm:col-span-1 lg:col-span-1 p-3.5 rounded-xl bg-gradient-to-br from-brand-600 to-sky-700 text-white shadow-md shadow-brand-600/20 flex flex-col justify-between">
          <div className="text-[11px] font-bold tracking-wider uppercase text-blue-100 flex items-center gap-1">
            <Receipt className="w-3.5 h-3.5" />
            <span>Tổng thanh toán</span>
          </div>
          <div className="text-base sm:text-lg font-extrabold tracking-tight mt-1 truncate">
            {formatVND(summary.totalPayment)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Công thức tính: Tổng thanh toán = Tổng tiền hàng + Thuế (8%) + Chi phí khác</span>
      </div>
    </div>
  );
};
