import React from 'react';
import { X, Printer, CheckCircle2 } from 'lucide-react';
import type { ImportItem, OrderSummary } from '../../types/import';
import { formatVND, formatDateVi } from '../../utils/formatters';

interface ImportReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  importDate: string;
  supplierName: string;
  staffName: string;
  notes: string;
  items: ImportItem[];
  summary: OrderSummary;
}

export const ImportReceiptModal: React.FC<ImportReceiptModalProps> = ({
  isOpen,
  onClose,
  orderId,
  importDate,
  supplierName,
  staffName,
  notes,
  items,
  summary,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-800">
              Chi tiết chứng từ phiếu nhập kho đã hoàn tất
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In phiếu</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-800 bg-white">
          {/* Company Title */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-start border-b border-slate-200 pb-5 gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                LUMEN K-BEAUTY STORE & WAREHOUSE
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Địa chỉ kho: 182 Lê Đại Hành, Phường 15, Quận 11, TP. Hồ Chí Minh
              </p>
              <p className="text-xs text-slate-500">
                Hotline kiểm kho: 0909.888.999 • Mã số thuế: 0314892019
              </p>
            </div>
            <div className="sm:text-right">
              <span className="text-xs font-mono font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-md border border-brand-200">
                {orderId}
              </span>
              <p className="text-xs text-slate-400 mt-1.5">
                Ngày ghi nhận: {formatDateVi(importDate)}
              </p>
            </div>
          </div>

          {/* Info meta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 block mb-0.5">Đơn vị cung ứng:</span>
              <strong className="text-slate-800 text-sm">{supplierName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Người lập phiếu & nhập kho:</span>
              <strong className="text-slate-800 text-sm">{staffName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Ghi chú kèm theo:</span>
              <span className="text-slate-600 italic">{notes || 'Không có ghi chú thêm'}</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 text-center">STT</th>
                  <th className="py-2.5 px-3">Tên hàng hóa mỹ phẩm</th>
                  <th className="py-2.5 px-3">Hãng</th>
                  <th className="py-2.5 px-3 text-center">Định lượng</th>
                  <th className="py-2.5 px-3 text-center">SL</th>
                  <th className="py-2.5 px-3 text-right">Giá bán (đ)</th>
                  <th className="py-2.5 px-3 text-center">Thuế</th>
                  <th className="py-2.5 px-3 text-right">Thành tiền (đ)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((it, idx) => (
                  <tr key={it.id}>
                    <td className="py-2 px-3 text-center text-slate-400 font-semibold">{idx + 1}</td>
                    <td className="py-2 px-3 font-medium text-slate-800">{it.name}</td>
                    <td className="py-2 px-3 text-slate-600 font-semibold">{it.brand}</td>
                    <td className="py-2 px-3 text-center text-slate-500">{it.unit}</td>
                    <td className="py-2 px-3 text-center font-bold text-slate-800">{it.quantity}</td>
                    <td className="py-2 px-3 text-right text-slate-700">{formatVND(it.salePrice)}</td>
                    <td className="py-2 px-3 text-center text-slate-500">8%</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">{formatVND(it.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Breakdown */}
          <div className="flex justify-end pt-2">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Tổng tiền hàng:</span>
                <span className="font-semibold">{formatVND(summary.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Thuế GTGT (8%):</span>
                <span className="font-semibold text-emerald-700">+{formatVND(summary.totalTax)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Chi phí khác:</span>
                <span className="font-semibold">{formatVND(summary.otherFee)}</span>
              </div>
              <div className="flex justify-between text-slate-900 pt-2 border-t border-slate-200 text-sm font-bold">
                <span>TỔNG THANH TOÁN:</span>
                <span className="text-brand-700 font-extrabold text-base">
                  {formatVND(summary.totalPayment)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
          >
            Đóng chứng từ
          </button>
        </div>
      </div>
    </div>
  );
};
