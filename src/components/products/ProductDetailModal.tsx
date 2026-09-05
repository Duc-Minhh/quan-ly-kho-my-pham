import React from 'react';
import type { Product } from '../../types/product';
import { getStockStatusInfo } from '../../types/product';
import { formatVND, formatWon } from '../../utils/formatters';
import { X, Edit, Trash2, Hash, Layers, CheckCircle, Sparkles } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !product) return null;

  const statusInfo = getStockStatusInfo(product.quantity);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              CHI TIẾT SẢN PHẨM
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-xs font-bold text-brand-700">{product.code}</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Hero: Image + Main Identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-5 border-b border-slate-100">
            <div className="w-28 h-28 rounded-2xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/60">
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  {product.brand}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                  {product.category}
                </span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusInfo.badgeClass}`}>
                  <span className={`w-2 h-2 rounded-full ${statusInfo.dotClass}`} />
                  <span>{statusInfo.label}</span>
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {product.name}
              </h2>

              <div className="flex items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-slate-500">
                <span>Định lượng: <strong className="text-slate-700">{product.unit}</strong></span>
                <span>•</span>
                <span>Trạng thái: <strong className={(product.status ? product.status === 'in_stock' : product.quantity > 0) ? 'text-emerald-700' : 'text-rose-700'}>{(product.status ? product.status === 'in_stock' : product.quantity > 0) ? '🟢 Còn hàng' : '🔴 Hết hàng'}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Price Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-gradient-to-r from-brand-50 to-sky-50 border border-brand-100">
            <div>
              <span className="text-[11px] font-semibold text-brand-800 uppercase tracking-wider block">
                Giá bán khách hỏi
              </span>
              <span className="text-xl sm:text-2xl font-black text-brand-700 tracking-tight">
                {formatVND(product.salePrice)}
              </span>
            </div>
            <div className="sm:text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Giá gốc (won)
              </span>
              <span className="text-lg sm:text-xl font-bold text-slate-700 font-mono">
                {formatWon(product.originalPriceWon)}
              </span>
            </div>
            <div className="sm:text-right">
              <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">
                Tiền thuế 8% (won)
              </span>
              <span className="text-lg sm:text-xl font-bold text-amber-800 font-mono">
                {formatWon(Math.round((product.originalPriceWon || 0) * 0.08 * 100) / 100)}
              </span>
            </div>
          </div>

          {/* Công dụng tư vấn khách hàng */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Công dụng chi tiết (tư vấn khách):</span>
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {product.usage || 'Chưa cập nhật công dụng sản phẩm.'}
            </div>
          </div>

          {/* Detailed attributes table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" /> Mã nội bộ:
              </span>
              <strong className="font-mono text-slate-800">{product.code}</strong>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" /> Tình trạng kho:
              </span>
              <strong className={(product.status ? product.status === 'in_stock' : product.quantity > 0) ? 'text-emerald-700' : 'text-rose-700'}>
                {(product.status ? product.status === 'in_stock' : product.quantity > 0) ? '🟢 Còn hàng' : '🔴 Hết hàng'}
              </strong>
            </div>
          </div>

          {/* Ghi chú */}
          {product.note && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Ghi chú kho:
              </h4>
              <p className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 leading-relaxed italic">
                {product.note}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(product);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-colors"
            >
              <Edit className="w-3.5 h-3.5 text-blue-600" />
              <span>Sửa sản phẩm</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onDelete(product);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-rose-50 border border-slate-200 text-rose-600 text-xs font-bold rounded-xl shadow-2xs transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
