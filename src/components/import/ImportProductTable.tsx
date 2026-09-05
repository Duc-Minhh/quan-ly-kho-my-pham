import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Trash2,
  ArrowUpDown,
  Filter,
  PackageX,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { ImportItem } from '../../types/import';
import { formatVND, formatWon } from '../../utils/formatters';
import { Tooltip } from '../common/Tooltip';

interface ImportProductTableProps {
  items: ImportItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onUpdateSalePrice: (id: string, salePrice: number) => void;
  onDeleteItem: (id: string) => void;
  onOpenAddModal: () => void;
}

type SortField = 'name' | 'price' | 'quantity' | 'total' | 'stt';
type SortDirection = 'asc' | 'desc';

export const ImportProductTable: React.FC<ImportProductTableProps> = ({
  items,
  onUpdateQuantity,
  onUpdateSalePrice,
  onDeleteItem,
  onOpenAddModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortField, setSortField] = useState<SortField>('stt');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Extract unique brands and categories for filtering
  const brands = useMemo(() => {
    const set = new Set(items.map((i) => i.brand));
    return ['ALL', ...Array.from(set)];
  }, [items]);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ['ALL', ...Array.from(set)];
  }, [items]);

  // Filter & Search
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const query = searchTerm.toLowerCase();
      const matchSearch =
        item.name.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.usage.toLowerCase().includes(query);

      const matchBrand = selectedBrand === 'ALL' || item.brand === selectedBrand;
      const matchCategory = selectedCategory === 'ALL' || item.category === selectedCategory;

      return matchSearch && matchBrand && matchCategory;
    });
  }, [items, searchTerm, selectedBrand, selectedCategory]);

  // Sorting
  const sortedItems = useMemo(() => {
    const sorted = [...filteredItems];
    sorted.sort((a, b) => {
      let comp = 0;
      if (sortField === 'name') comp = a.name.localeCompare(b.name, 'vi');
      else if (sortField === 'price') comp = a.salePrice - b.salePrice;
      else if (sortField === 'quantity') comp = a.quantity - b.quantity;
      else if (sortField === 'total') comp = a.total - b.total;
      else comp = 0; // maintain original STT order

      return sortDir === 'asc' ? comp : -comp;
    });
    return sorted;
  }, [filteredItems, sortField, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedItems.length / itemsPerPage));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedItems.slice(start, start + itemsPerPage);
  }, [sortedItems, currentPage, itemsPerPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden mb-6">
      {/* Top Header & Toolbar */}
      <div className="p-4 sm:p-6 border-b border-slate-100 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Chi tiết hàng nhập
              </h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {items.length} mặt hàng
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Danh sách các sản phẩm mỹ phẩm nhập kho trong phiếu này. Có thể sửa số lượng và giá bán trực tiếp.
            </p>
          </div>

          {/* Right Action: [ + Thêm sản phẩm ] */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-150 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm sản phẩm</span>
          </button>
        </div>

        {/* Search and Filters Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Box: [ 🔍 Tìm tên sản phẩm, mã sản phẩm, thương hiệu... ] */}
          <div className="sm:col-span-6 lg:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="🔍 Tìm tên sản phẩm, mã sản phẩm, thương hiệu..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all"
            />
          </div>

          {/* Brand Filter */}
          <div className="sm:col-span-3 lg:col-span-3">
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer appearance-none pr-7"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b === 'ALL' ? 'Tất cả thương hiệu' : `Hãng: ${b}`}
                  </option>
                ))}
              </select>
              <Filter className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3 lg:col-span-3">
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer appearance-none pr-7"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'ALL' ? 'Tất cả phân loại' : `Loại: ${c}`}
                  </option>
                ))}
              </select>
              <Filter className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Reset Filters / Count indicator */}
          <div className="sm:col-span-12 lg:col-span-1 flex justify-end">
            {(searchTerm || selectedBrand !== 'ALL' || selectedCategory !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedBrand('ALL');
                  setSelectedCategory('ALL');
                  setCurrentPage(1);
                }}
                className="text-xs text-brand-600 hover:text-brand-800 underline font-medium"
              >
                Xóa lọc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modern Data Table with Sticky Header & Horizontal Scroll */}
      <div className="relative overflow-x-auto max-h-[620px] scrollbar-thin">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          {/* Table Header: Sticky, light gray background */}
          <thead className="sticky top-0 z-20 bg-slate-100/95 backdrop-blur text-slate-600 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200 shadow-sm">
            <tr>
              <th scope="col" className="py-3.5 px-3 text-center w-12 shrink-0">
                STT
              </th>
              <th scope="col" className="py-3.5 px-3 w-24">
                Phân loại
              </th>
              <th scope="col" className="py-3.5 px-3 w-28">
                Tên hãng
              </th>
              <th
                scope="col"
                className="py-3.5 px-4 min-w-[220px] cursor-pointer select-none hover:text-slate-900 group"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Tên sản phẩm</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                </div>
              </th>
              <th scope="col" className="py-3.5 px-4 min-w-[200px] max-w-[260px]">
                Công dụng
              </th>
              <th scope="col" className="py-3.5 px-3 text-right whitespace-nowrap w-28">
                Giá gốc (won)
              </th>
              <th scope="col" className="py-3.5 px-3 text-center w-24">
                Định lượng
              </th>
              <th
                scope="col"
                className="py-3.5 px-3 text-center w-28 cursor-pointer select-none hover:text-slate-900 group"
                onClick={() => handleSort('quantity')}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Số lượng</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                </div>
              </th>
              <th scope="col" className="py-3.5 px-3 text-center w-20">
                Thuế 8%
              </th>
              <th
                scope="col"
                className="py-3.5 px-3 text-right min-w-[140px] cursor-pointer select-none hover:text-slate-900 group"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Giá bán (đ)</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                </div>
              </th>
              <th
                scope="col"
                className="py-3.5 px-4 text-right min-w-[140px] cursor-pointer select-none hover:text-slate-900 group"
                onClick={() => handleSort('total')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Thành tiền (đ)</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                </div>
              </th>
              <th scope="col" className="py-3.5 px-3 text-center w-20 shrink-0">
                Thao tác
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 bg-white">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <PackageX className="w-10 h-10 text-slate-300 stroke-[1.5]" />
                    <p className="text-sm font-semibold text-slate-600">Không có sản phẩm nào</p>
                    <p className="text-xs text-slate-400">
                      Bấm "+ Thêm sản phẩm" hoặc điều chỉnh lại bộ lọc tìm kiếm
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedItems.map((item, idx) => {
                const stt = (currentPage - 1) * itemsPerPage + idx + 1;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/90 transition-colors group"
                  >
                    {/* 1. STT */}
                    <td className="py-3.5 px-3 text-center text-xs font-semibold text-slate-400">
                      {stt}
                    </td>

                    {/* 2. Phân loại */}
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 whitespace-nowrap">
                        {item.category}
                      </span>
                    </td>

                    {/* 3. Tên hãng */}
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200/60 whitespace-nowrap">
                        {item.brand}
                      </span>
                    </td>

                    {/* 4. Tên sản phẩm: xuống dòng an toàn, không vỡ layout */}
                    <td className="py-3.5 px-4 font-semibold text-slate-800 leading-snug">
                      <div className="break-words line-clamp-2" title={item.name}>
                        {item.name}
                      </div>
                    </td>

                    {/* 5. Công dụng: giới hạn 2 dòng kèm tooltip khi hover xem đầy đủ */}
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      <Tooltip content={item.usage} maxWidth="max-w-sm">
                        <div className="line-clamp-2 cursor-help text-slate-600 hover:text-slate-900 transition-colors leading-relaxed">
                          {item.usage}
                        </div>
                      </Tooltip>
                    </td>

                    {/* 6. Giá gốc (won): hiển thị rõ đơn vị WON / ₩ */}
                    <td className="py-3.5 px-3 text-right font-medium text-slate-700 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-xs">
                        {formatWon(item.originalPriceWon)}
                      </span>
                    </td>

                    {/* 7. Định lượng */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 font-medium">
                        {item.unit}
                      </span>
                    </td>

                    {/* 8. Số lượng: Input number trực tiếp, không cho âm */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 bg-white shadow-2xs">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            onUpdateQuantity(item.id, Math.max(1, val));
                          }}
                          className="w-16 py-1.5 px-2 text-center text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none"
                        />
                      </div>
                    </td>

                    {/* 9. Thuế 8% */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        8%
                      </span>
                    </td>

                    {/* 10. Giá bán: Cho phép nhập trực tiếp, không cho âm */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="relative inline-flex items-center">
                        <input
                          type="number"
                          min="0"
                          step="1000"
                          value={item.salePrice}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            onUpdateSalePrice(item.id, Math.max(0, val));
                          }}
                          className="w-28 py-1.5 px-2 text-right text-xs sm:text-sm font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-2xs"
                        />
                      </div>
                    </td>

                    {/* 11. Thành tiền = Số lượng × Giá bán */}
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 text-xs sm:text-sm whitespace-nowrap">
                      {formatVND(item.total)}
                    </td>

                    {/* 12. Thao tác: Xóa */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => onDeleteItem(item.id)}
                        className="inline-flex items-center justify-center p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Xóa mặt hàng này khỏi phiếu"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Footer */}
      {sortedItems.length > 0 && (
        <div className="px-4 sm:px-6 py-3 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Hiển thị{' '}
            <strong>
              {(currentPage - 1) * itemsPerPage + 1} -{' '}
              {Math.min(currentPage * itemsPerPage, sortedItems.length)}
            </strong>{' '}
            trong tổng số <strong>{sortedItems.length}</strong> sản phẩm
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-slate-700">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
