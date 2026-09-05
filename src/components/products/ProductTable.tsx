import React from 'react';
import type { Product } from '../../types/product';
import { getStockStatusInfo } from '../../types/product';
import { formatVND, formatWon } from '../../utils/formatters';
import { Edit, Trash2, Eye, PackageX, Sparkles } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';

interface ProductTableProps {
  products: Product[];
  selectedProductIds: string[];
  onToggleSelect: (productId: string) => void;
  onToggleSelectAll: () => void;
  onSelectProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  searchTerm?: string;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  selectedProductIds,
  onToggleSelect,
  onToggleSelectAll,
  onSelectProduct,
  onEditProduct,
  onDeleteProduct,
  searchTerm,
}) => {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-card">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
          <PackageX className="w-7 h-7" />
        </div>
        <h4 className="text-base font-bold text-slate-800">Không tìm thấy sản phẩm nào</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          {searchTerm
            ? `Không có kết quả phù hợp với từ khóa "${searchTerm}". Hãy thử kiểm tra lại chính tả hoặc xóa bớt bộ lọc.`
            : 'Kho hiện chưa có sản phẩm nào. Hãy bấm nút "+ Thêm sản phẩm" hoặc "Import Excel" để bắt đầu.'}
        </p>
      </div>
    );
  }

  const isAllSelected =
    products.length > 0 && products.every((p) => selectedProductIds.includes(p.id));
  const isSomeSelected =
    products.some((p) => selectedProductIds.includes(p.id)) && !isAllSelected;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
      <div className="overflow-x-auto max-h-[680px] scrollbar-thin">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          {/* Sticky modern table header */}
          <thead className="sticky top-0 z-20 bg-slate-100/95 backdrop-blur text-slate-600 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
            <tr>
              {/* Checkbox All */}
              <th scope="col" className="py-3.5 px-3 text-center w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isSomeSelected;
                  }}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer accent-brand-600"
                  title="Chọn tất cả sản phẩm đang hiển thị"
                />
              </th>

              <th scope="col" className="py-3.5 px-3 text-center w-12">
                STT
              </th>
              <th scope="col" className="py-3.5 px-3 text-center w-16">
                Ảnh
              </th>
              <th scope="col" className="py-3.5 px-3 w-24">
                Phân loại
              </th>
              <th scope="col" className="py-3.5 px-3 w-28">
                Tên hãng
              </th>
              <th scope="col" className="py-3.5 px-4 min-w-[200px]">
                Tên sản phẩm
              </th>
              <th scope="col" className="py-3.5 px-4 min-w-[200px] max-w-[260px]">
                Công dụng
              </th>
              <th scope="col" className="py-3.5 px-3 text-right whitespace-nowrap w-24">
                Giá gốc (won)
              </th>
              <th scope="col" className="py-3.5 px-3 text-center w-24">
                Định lượng
              </th>
              <th scope="col" className="py-3.5 px-3 text-center w-20">
                Số lượng
              </th>
              <th scope="col" className="py-3.5 px-3 text-right whitespace-nowrap w-28">
                Giá bán
              </th>
              <th scope="col" className="py-3.5 px-3 text-center w-28">
                Trạng thái
              </th>
              <th scope="col" className="py-3.5 px-3 text-center w-28">
                Thao tác
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 bg-white">
            {products.map((prod, index) => {
              const statusInfo = getStockStatusInfo(prod.quantity);
              const isSelected = selectedProductIds.includes(prod.id);

              return (
                <tr
                  key={prod.id}
                  className={`transition-colors group cursor-pointer ${
                    isSelected
                      ? 'bg-brand-50/50 hover:bg-brand-50/70'
                      : 'hover:bg-slate-50/90'
                  }`}
                  onClick={() => onSelectProduct(prod)}
                >
                  {/* Row Checkbox */}
                  <td
                    className="py-3 px-3 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(prod.id)}
                      className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer accent-brand-600"
                      title="Chọn sản phẩm này để thao tác"
                    />
                  </td>

                  {/* STT */}
                  <td className="py-3 px-3 text-center text-xs font-semibold text-slate-400">
                    {index + 1}
                  </td>

                  {/* Ảnh */}
                  <td className="py-2.5 px-3 text-center">
                    <div className="w-10 h-10 mx-auto rounded-xl border border-slate-200 bg-slate-50 p-1 flex items-center justify-center overflow-hidden shadow-2xs group-hover:border-brand-300 transition-colors">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </td>

                  {/* Phân loại */}
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 whitespace-nowrap">
                      {prod.category}
                    </span>
                  </td>

                  {/* Tên hãng */}
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 whitespace-nowrap">
                      <Sparkles className="w-3 h-3 text-blue-500" />
                      {prod.brand}
                    </span>
                  </td>

                  {/* Tên sản phẩm */}
                  <td className="py-3 px-4 font-bold text-slate-800 leading-snug">
                    <div className="line-clamp-2 hover:text-brand-600 transition-colors">
                      {prod.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{prod.code}</div>
                  </td>

                  {/* Công dụng */}
                  <td className="py-3 px-4 text-xs text-slate-500">
                    <Tooltip content={prod.usage} maxWidth="max-w-sm">
                      <div className="line-clamp-2 text-slate-600 hover:text-slate-900 leading-relaxed cursor-help">
                        {prod.usage || 'Chưa cập nhật công dụng'}
                      </div>
                    </Tooltip>
                  </td>

                  {/* Giá gốc (won) */}
                  <td className="py-3 px-3 text-right font-semibold text-slate-700 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-xs">
                      {formatWon(prod.originalPriceWon)}
                    </span>
                  </td>

                  {/* Định lượng */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 font-medium">
                      {prod.unit}
                    </span>
                  </td>

                  {/* Số lượng */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`font-mono font-bold text-sm ${
                        prod.quantity === 0
                          ? 'text-rose-600'
                          : prod.quantity <= 5
                          ? 'text-amber-600'
                          : 'text-slate-800'
                      }`}
                    >
                      {prod.quantity}
                    </span>
                  </td>

                  {/* Giá bán */}
                  <td className="py-3 px-3 text-right font-bold text-brand-700 text-xs sm:text-sm whitespace-nowrap">
                    {formatVND(prod.salePrice)}
                  </td>

                  {/* Trạng thái (Badge: 🟢 Còn hàng, 🟡 Sắp hết, 🔴 Hết hàng) */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusInfo.badgeClass}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${statusInfo.dotClass}`} />
                      <span>{statusInfo.label}</span>
                    </span>
                  </td>

                  {/* Thao tác: Sửa, Xóa */}
                  <td
                    className="py-3 px-3 text-center"
                    onClick={(e) => e.stopPropagation()} // don't trigger row click
                  >
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onSelectProduct(prod)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditProduct(prod)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Chỉnh sửa sản phẩm"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteProduct(prod)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-3 border-t border-slate-100 bg-slate-50/70 text-xs text-slate-500 flex items-center justify-between px-4">
        <span>
          Đang hiển thị <strong>{products.length}</strong> sản phẩm
          {selectedProductIds.length > 0 && (
            <span className="ml-2 text-brand-700 font-semibold">
              (Đã chọn {selectedProductIds.length} mục)
            </span>
          )}
        </span>
        <span className="text-slate-400 hidden sm:inline">
          💡 Mẹo: Tích vào ô checkbox ở đầu mỗi dòng để chọn nhiều sản phẩm xóa hàng loạt
        </span>
      </div>
    </div>
  );
};
