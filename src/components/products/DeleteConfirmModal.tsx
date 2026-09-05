import React from 'react';
import type { Product } from '../../types/product';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  product?: Product | null;
  bulkProducts?: Product[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  product,
  bulkProducts,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const isBulk = Boolean(bulkProducts && bulkProducts.length > 0);
  if (!isBulk && !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-sm">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-bold text-slate-900">
            {isBulk
              ? `Xác nhận xóa ${bulkProducts!.length} sản phẩm đã chọn?`
              : 'Xác nhận xóa sản phẩm?'}
          </h3>

          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            {isBulk
              ? `Bạn có chắc chắn muốn xóa vĩnh viễn ${bulkProducts!.length} sản phẩm này khỏi kho hàng? Thao tác này không thể hoàn tác.`
              : 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi kho hàng không? Thao tác này sẽ xóa vĩnh viễn khỏi danh sách tra cứu.'}
          </p>

          {/* Product(s) Preview */}
          {isBulk ? (
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 max-h-48 overflow-y-auto divide-y divide-slate-200 text-left">
              {bulkProducts!.map((p) => (
                <div key={p.id} className="py-2 first:pt-0 last:pb-0 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 line-clamp-1">{p.name}</span>
                    <span className="font-mono text-[10px] text-slate-400 shrink-0 ml-2">{p.code}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {p.brand} • SL: {p.quantity}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            product && (
              <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left">
                <div className="text-[10px] text-slate-400 font-mono font-bold">
                  {product.code} • {product.brand}
                </div>
                <div className="text-sm font-bold text-slate-800 mt-0.5">{product.name}</div>
                <div className="text-xs text-slate-500 mt-1">
                  Số lượng hiện có: <strong>{product.quantity}</strong>
                </div>
              </div>
            )
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>
              {isBulk ? `Xóa ${bulkProducts!.length} sản phẩm` : 'Xóa sản phẩm'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
