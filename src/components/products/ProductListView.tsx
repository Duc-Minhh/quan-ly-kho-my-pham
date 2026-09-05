import React, { useRef, useMemo } from 'react';
import type { Product } from '../../types/product';
import { getStockStatus } from '../../types/product';
import { ProductTable } from './ProductTable';
import {
  Search,
  Plus,
  FileSpreadsheet,
  Download,
  Filter,
  X,
  Command,
  CheckSquare,
  Trash2,
} from 'lucide-react';

interface ProductListViewProps {
  products: Product[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onResetFilters: () => void;
  onOpenAddModal: () => void;
  onSelectProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  selectedProductIds: string[];
  onToggleSelect: (productId: string) => void;
  onToggleSelectAll: () => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
  onExportExcel: () => void;
  onImportExcel: (file: File) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export const ProductListView: React.FC<ProductListViewProps> = ({
  products,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedBrand,
  onBrandChange,
  selectedStatus,
  onStatusChange,
  onResetFilters,
  onOpenAddModal,
  onSelectProduct,
  onEditProduct,
  onDeleteProduct,
  selectedProductIds,
  onToggleSelect,
  onToggleSelectAll,
  onBulkDelete,
  onClearSelection,
  onExportExcel,
  onImportExcel,
  searchInputRef,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract unique categories and brands from all products
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['ALL', ...Array.from(set)];
  }, [products]);

  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand));
    return ['ALL', ...Array.from(set)];
  }, [products]);

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    return products.filter((p) => {
      // Search matching: name, brand, code, category, usage
      const matchSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.code.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.usage.toLowerCase().includes(query) ||
        p.note.toLowerCase().includes(query);

      // Category matching
      const matchCategory = selectedCategory === 'ALL' || p.category === selectedCategory;

      // Brand matching
      const matchBrand = selectedBrand === 'ALL' || p.brand === selectedBrand;

      // Status matching
      const prodStatus = getStockStatus(p.quantity);
      const matchStatus = selectedStatus === 'ALL' || prodStatus === selectedStatus;

      return matchSearch && matchCategory && matchBrand && matchStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedBrand, selectedStatus]);

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'ALL' ||
    selectedBrand !== 'ALL' ||
    selectedStatus !== 'ALL';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportExcel(file);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kho sản phẩm
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý và tra cứu nhanh thông tin các sản phẩm đang có khi khách hàng hỏi
          </p>
        </div>

        {/* Action Buttons: Import, Export, + Thêm sản phẩm */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx,.xls,.csv"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
            title="Nhập danh sách từ file Excel / CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Nhập Excel</span>
          </button>

          <button
            type="button"
            onClick={onExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
            title="Xuất file Excel danh sách sản phẩm"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Xuất Excel</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Thêm sản phẩm</span>
          </button>
        </div>
      </div>

      {/* Big Search Bar */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search className="w-5 h-5 text-brand-600" />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="🔍 Tìm kiếm sản phẩm, hãng, mã sản phẩm, công dụng (VD: made, MEDIHEAL, rau má, MH-001...)"
          className="w-full pl-12 pr-28 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
        />
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              title="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-mono text-slate-500 select-none">
            <Command className="w-3 h-3" /> K
          </span>
        </div>
      </div>

      {/* Filter Row: Category, Brand, Status, Clear Filters */}
      <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 text-xs shadow-2xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-semibold mr-1">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Bộ lọc:</span>
        </div>

        {/* Phân loại */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="py-1.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === 'ALL' ? 'Tất cả phân loại' : c}
            </option>
          ))}
        </select>

        {/* Thương hiệu */}
        <select
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value)}
          className="py-1.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
        >
          {brands.map((b) => (
            <option key={b} value={b}>
              {b === 'ALL' ? 'Tất cả thương hiệu' : b}
            </option>
          ))}
        </select>

        {/* Trạng thái */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="py-1.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="in_stock">🟢 Còn hàng (&gt; 5)</option>
          <option value="low_stock">🟡 Sắp hết (1 - 5)</option>
          <option value="out_of_stock">🔴 Hết hàng (0)</option>
        </select>

        {/* Reset Filter button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl font-semibold transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Xóa bộ lọc</span>
          </button>
        )}

        <div className="ml-auto text-xs text-slate-500 font-medium">
          Tìm thấy <strong className="text-slate-900">{filteredProducts.length}</strong> / {products.length} sản phẩm
        </div>
      </div>

      {/* Bulk Action Bar (When 1 or more items are selected) */}
      {selectedProductIds.length > 0 && (
        <div className="sticky top-16 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 px-5 bg-gradient-to-r from-brand-600 to-sky-700 text-white rounded-2xl shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5 font-bold text-xs sm:text-sm">
            <CheckSquare className="w-4 h-4 text-sky-200" />
            <span>Đã tích chọn {selectedProductIds.length} sản phẩm</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onBulkDelete}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa {selectedProductIds.length} sản phẩm đã chọn</span>
            </button>

            <button
              type="button"
              onClick={onClearSelection}
              className="px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}

      {/* Modern Products Table */}
      <ProductTable
        products={filteredProducts}
        selectedProductIds={selectedProductIds}
        onToggleSelect={onToggleSelect}
        onToggleSelectAll={onToggleSelectAll}
        onSelectProduct={onSelectProduct}
        onEditProduct={onEditProduct}
        onDeleteProduct={onDeleteProduct}
        searchTerm={searchTerm}
      />
    </div>
  );
};
