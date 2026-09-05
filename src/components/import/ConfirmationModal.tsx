import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatVND, formatNumber } from '../../utils/formatters';
import type { OrderSummary } from '../../types/import';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderId: string;
  supplierName: string;
  summary: OrderSummary;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderId,
  supplierName,
  summary,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 text-center border-b border-slate-100">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center mb-3.5 shadow-sm">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Xác nhận nhập hàng vào kho?
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Bạn có chắc chắn muốn nhập số lượng hàng hóa này vào hệ thống kho mỹ phẩm? Tồn kho thực tế sẽ được tự động cộng dồn ngay tức thì.
          </p>
        </div>

        {/* Order Details Brief */}
        <div className="p-5 bg-slate-50/70 border-b border-slate-100 space-y-2.5 text-xs">
          <div className="flex justify-between items-center text-slate-600">
            <span>Mã chứng từ phiếu:</span>
            <strong className="font-mono text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
              {orderId}
            </strong>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Đơn vị cung cấp:</span>
            <strong className="text-slate-800 truncate max-w-[200px]">{supplierName}</strong>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Tổng số lượng sản phẩm:</span>
            <strong className="text-slate-800">
              {summary.totalProducts} loại ({formatNumber(summary.totalQuantity)} cái/hộp)
            </strong>
          </div>
          <div className="flex justify-between items-center text-slate-600 pt-2 border-t border-slate-200/80">
            <span className="font-bold text-slate-800 text-sm">TỔNG THANH TOÁN:</span>
            <span className="font-extrabold text-brand-700 text-base">
              {formatVND(summary.totalPayment)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-white flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-colors"
          >
            Quay lại
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Xác nhận nhập hàng</span>
          </button>
        </div>
      </div>
    </div>
  );
};
