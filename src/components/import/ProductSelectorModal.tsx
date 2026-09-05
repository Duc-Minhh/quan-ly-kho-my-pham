import React, { useState, useMemo } from 'react';
import { Search, X, Plus, Check, Filter } from 'lucide-react';
import type { Product, ImportItem } from '../../types/import';
import { formatVND, formatWon } from '../../utils/formatters';

interface ProductSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currentItems: ImportItem[];
  onAddProduct: (product: Product, quantity: number, salePrice: number) => void;
}

export const ProductSelectorModal: React.FC<ProductSelectorModalProps> = ({
  isOpen,
  onClose,
  products,
  currentItems,
  onAddProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Brands and categories
  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand));
    return ['ALL', ...Array.from(set)];
  }, [products]);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['ALL', ...Array.from(set)];
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchSearch =
        prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.usage.toLowerCase().includes(searchTerm.toLowerCase());

      const matchBrand = selectedBrand === 'ALL' || prod.brand === selectedBrand;
      const matchCategory = selectedCategory === 'ALL' || prod.category === selectedCategory;

      return matchSearch && matchBrand && matchCategory;
    });
  }, [products, searchTerm, selectedBrand, selectedCategory]);

  if (!isOpen) return null;

  const handleAdd = (prod: Product) => {
    const qty = quantities[prod.id] || 1;
    onAddProduct(prod, qty, prod.salePrice);
  };

  const getQuantity = (id: string) => quantities[id] || 1;

  const setQuantity = (id: string, val: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, val) }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Chọn sản phẩm nhập kho</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tìm kiếm và chọn mỹ phẩm từ danh mục để đưa vào phiếu nhập hiện tại
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Controls */}
        <div className="p-4 sm:p-6 border-b border-slate-100 space-y-3 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên sản phẩm, mã SP, thương hiệu (VD: Mediheal, Madecassoside, Toner...)"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Bộ lọc:</span>
            </div>

            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
            >
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b === 'ALL' ? 'Tất cả thương hiệu' : b}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'Tất cả phân loại' : c}
                </option>
              ))}
            </select>

            <span className="text-xs text-slate-400 ml-auto">
              Tìm thấy <strong className="text-slate-700">{filteredProducts.length}</strong> sản phẩm
            </span>
          </div>
        </div>

        {/* Product List Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm font-medium">Không tìm thấy sản phẩm phù hợp</p>
              <p className="text-xs mt-1">Thử thay đổi từ khóa hoặc bộ lọc thương hiệu/phân loại</p>
            </div>
          ) : (
            filteredProducts.map((prod) => {
              const alreadyInList = currentItems.some((i) => i.productId === prod.id);

              return (
                <div
                  key={prod.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all ${
                    alreadyInList
                      ? 'bg-brand-50/40 border-brand-200'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                        {prod.code}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {prod.brand}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500">
                        {prod.category}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">
                        • ĐL: {prod.unit}
                      </span>
                      {prod.stockAvailable !== undefined && (
                        <span className="text-[10px] text-emerald-600 font-medium ml-auto sm:ml-0">
                          Tồn kho: {prod.stockAvailable}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-800 leading-snug">
                      {prod.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{prod.usage}</p>

                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <span className="text-slate-500">
                        Giá gốc (Won):{' '}
                        <strong className="text-slate-800">{formatWon(prod.originalPriceWon)}</strong>
                      </span>
                      <span className="text-slate-500">
                        Giá bán dự kiến:{' '}
                        <strong className="text-brand-700">{formatVND(prod.salePrice)}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Action Column */}
                  <div className="flex items-center gap-3 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs text-slate-500">SL:</label>
                      <input
                        type="number"
                        min="1"
                        value={getQuantity(prod.id)}
                        onChange={(e) => setQuantity(prod.id, parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1.5 text-center text-xs font-semibold bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAdd(prod)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors shadow-sm ${
                        alreadyInList
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-brand-600 hover:bg-brand-700 text-white'
                      }`}
                    >
                      {alreadyInList ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Thêm tiếp</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Thêm vào phiếu</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Đã có <strong>{currentItems.length}</strong> dòng hàng trong phiếu nhập
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
          >
            Hoàn tất chọn hàng
          </button>
        </div>
      </div>
    </div>
  );
};
