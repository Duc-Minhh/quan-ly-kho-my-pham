import React from 'react';
import { RefreshCw, Calendar, Truck, User, FileText, Hash } from 'lucide-react';
import type { Supplier, Staff } from '../../types/import';

interface ImportOrderFormProps {
  orderId: string;
  onRefreshOrderId: () => void;
  importDate: string;
  onDateChange: (date: string) => void;
  supplierId: string;
  onSupplierChange: (supplierId: string) => void;
  staffName: string;
  onStaffChange: (staffName: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  suppliers: Supplier[];
  staffMembers: Staff[];
  errors?: {
    supplierId?: string;
    importDate?: string;
  };
}

export const ImportOrderForm: React.FC<ImportOrderFormProps> = ({
  orderId,
  onRefreshOrderId,
  importDate,
  onDateChange,
  supplierId,
  onSupplierChange,
  staffName,
  onStaffChange,
  notes,
  onNotesChange,
  suppliers,
  staffMembers,
  errors,
}) => {
  const selectedSupplier = suppliers.find((s) => s.id === supplierId);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 sm:p-6 mb-6">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 tracking-tight">
              Thông tin phiếu nhập
            </h3>
            <p className="text-xs text-slate-500">
              Điền các thông tin chứng từ và đơn vị cung cấp mỹ phẩm
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-100">
          Trạng thái: Tạo mới
        </span>
      </div>

      {/* Form Fields Grid: 2-4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* 1. Mã phiếu nhập */}
        <div>
          <label className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              Mã phiếu nhập <span className="text-rose-500">*</span>
            </span>
            <button
              type="button"
              onClick={onRefreshOrderId}
              className="text-[11px] text-brand-600 hover:text-brand-800 flex items-center gap-1 font-normal transition-colors"
              title="Sinh lại mã phiếu mới"
            >
              <RefreshCw className="w-3 h-3" />
              Làm mới
            </button>
          </label>
          <div className="relative">
            <input
              type="text"
              readOnly
              value={orderId}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 font-mono tracking-wider focus:outline-none cursor-not-allowed select-all"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Mã hệ thống tự sinh</p>
        </div>

        {/* 2. Ngày nhập */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Ngày nhập hàng <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              value={importDate}
              onChange={(e) => onDateChange(e.target.value)}
              className={`w-full px-3.5 py-2.5 bg-white border ${
                errors?.importDate ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-200'
              } rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all`}
            />
          </div>
          {errors?.importDate ? (
            <p className="text-[11px] text-rose-500 mt-1">{errors.importDate}</p>
          ) : (
            <p className="text-[11px] text-slate-400 mt-1">Mặc định ngày hôm nay</p>
          )}
        </div>

        {/* 3. Nhà cung cấp */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
            <Truck className="w-3.5 h-3.5 text-slate-400" />
            Nhà cung cấp <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              value={supplierId}
              onChange={(e) => onSupplierChange(e.target.value)}
              className={`w-full px-3.5 py-2.5 bg-white border ${
                errors?.supplierId ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-200'
              } rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all appearance-none pr-8 cursor-pointer`}
            >
              <option value="">-- Chọn hoặc tìm nhà cung cấp --</option>
              {suppliers.map((sup) => (
                <option key={sup.id} value={sup.id}>
                  {sup.name} ({sup.code})
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>
          {errors?.supplierId ? (
            <p className="text-[11px] text-rose-500 mt-1">{errors.supplierId}</p>
          ) : selectedSupplier ? (
            <p className="text-[11px] text-emerald-600 mt-1 truncate">
              ✓ ĐT: {selectedSupplier.phone}
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 mt-1">Bắt buộc chọn đơn vị cung ứng</p>
          )}
        </div>

        {/* 4. Người nhập */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            Người nhập <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              value={staffName}
              onChange={(e) => onStaffChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all appearance-none pr-8 cursor-pointer"
            >
              {staffMembers.map((staff) => (
                <option key={staff.id} value={staff.name}>
                  {staff.name} - {staff.role}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Thủ kho chịu trách nhiệm kiểm tra</p>
        </div>
      </div>

      {/* Row 2: Ghi chú (Textarea) */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Ghi chú phiếu nhập
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Nhập ghi chú thêm cho lô hàng (VD: Đợt nhập mặt nạ MEDIHEAL tháng 9, hàng nguyên seal, tem phụ tiếng Việt đầy đủ...)"
          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-y"
        />
      </div>
    </div>
  );
};
