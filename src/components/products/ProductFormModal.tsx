import React, { useState, useEffect, useRef } from 'react';
import type { Product } from '../../types/product';
import { getCosmeticIconSvg } from '../../utils/productImages';
import { X, Upload, Sparkles, AlertCircle } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  initialData?: Product | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const isEditing = Boolean(initialData);

  const [code, setCode] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Mặt nạ');
  const [brand, setBrand] = useState('MEDIHEAL');
  const [name, setName] = useState('');
  const [usage, setUsage] = useState('');
  const [originalPriceWon, setOriginalPriceWon] = useState<number | ''>(10);
  const [unit, setUnit] = useState('Hộp');
  const [quantity, setQuantity] = useState<number | ''>(10);
  const [salePrice, setSalePrice] = useState<number | ''>(45000);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setCode(initialData.code);
      setImage(initialData.image);
      setCategory(initialData.category);
      setBrand(initialData.brand);
      setName(initialData.name);
      setUsage(initialData.usage);
      setOriginalPriceWon(initialData.originalPriceWon);
      setUnit(initialData.unit);
      setQuantity(initialData.quantity);
      setSalePrice(initialData.salePrice);
      setNote(initialData.note || '');
      setError('');
    } else {
      // Reset for new item
      setCode(`SP-${Date.now().toString().slice(-4)}`);
      setBrand('MEDIHEAL');
      setCategory('Mặt nạ');
      setName('');
      setUsage('');
      setOriginalPriceWon(10);
      setUnit('Hộp');
      setQuantity(10);
      setSalePrice(45000);
      setNote('');
      setImage(getCosmeticIconSvg('MEDIHEAL', 'Mặt nạ', 'Mặt nạ'));
      setError('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Kích thước ảnh không vượt quá 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateDefaultImage = () => {
    setImage(getCosmeticIconSvg(brand || 'COSMETIC', category || 'Mặt nạ', name || 'Mask'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Vui lòng nhập tên sản phẩm.');
      return;
    }
    if (!brand.trim()) {
      setError('Vui lòng nhập thương hiệu.');
      return;
    }
    if (quantity === '' || Number(quantity) < 0) {
      setError('Số lượng không được âm.');
      return;
    }
    if (salePrice === '' || Number(salePrice) < 0) {
      setError('Giá bán không được âm.');
      return;
    }

    const finalImage =
      image || getCosmeticIconSvg(brand || 'COSMETIC', category || 'Mặt nạ', name || 'Mask');

    onSubmit({
      ...(initialData ? { id: initialData.id } : {}),
      code: code.trim() || `MH-${Date.now().toString().slice(-3)}`,
      image: finalImage,
      category: category.trim() || 'Mặt nạ',
      brand: brand.trim().toUpperCase(),
      name: name.trim(),
      usage: usage.trim(),
      originalPriceWon: Number(originalPriceWon) || 0,
      unit: unit.trim() || 'Cái',
      quantity: Number(quantity) || 0,
      salePrice: Number(salePrice) || 0,
      note: note.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isEditing ? 'Sửa thông tin sản phẩm' : 'Thêm sản phẩm mới vào kho'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? 'Cập nhật lại giá, số lượng hoặc công dụng chi tiết của sản phẩm'
                : 'Nhập thông tin sản phẩm mỹ phẩm để tra cứu nhanh khi khách hỏi'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section: Ảnh sản phẩm */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center overflow-hidden shadow-2xs shrink-0">
              <img src={image} alt="Preview" className="w-full h-full object-contain" />
            </div>
            <div className="space-y-2 text-center sm:text-left flex-1">
              <span className="text-xs font-semibold text-slate-700 block">Ảnh sản phẩm</span>
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Tải ảnh từ máy</span>
                </button>
                <button
                  type="button"
                  onClick={handleGenerateDefaultImage}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tự tạo icon theo hãng</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">Hỗ trợ PNG, JPG, WEBP hoặc dùng icon tự sinh</p>
            </div>
          </div>

          {/* Row 1: Mã SP, Phân loại, Hãng */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mã sản phẩm <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="VD: MH-001"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phân loại <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                list="category-suggestions"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="VD: Mặt nạ"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                required
              />
              <datalist id="category-suggestions">
                <option value="Mặt nạ" />
                <option value="Serum" />
                <option value="Toner" />
                <option value="Kem dưỡng" />
                <option value="Sữa rửa mặt" />
                <option value="Tẩy trang" />
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên hãng <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                list="brand-suggestions"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="VD: MEDIHEAL"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                required
              />
              <datalist id="brand-suggestions">
                <option value="MEDIHEAL" />
                <option value="NUMBUZIN" />
                <option value="TORRIDEN" />
                <option value="ANUA" />
                <option value="SKIN1004" />
                <option value="ROUND LAB" />
                <option value="COSRX" />
              </datalist>
            </div>
          </div>

          {/* Row 2: Tên sản phẩm */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tên sản phẩm <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Madecassoside (rau má)"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              required
            />
          </div>

          {/* Row 3: Công dụng */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Công dụng chi tiết
            </label>
            <textarea
              rows={3}
              value={usage}
              onChange={(e) => setUsage(e.target.value)}
              placeholder="Nhập chi tiết công dụng để khi khách hỏi có thể tra cứu và tư vấn ngay (VD: Làm dịu da, giảm đỏ, trị mụn, cấp ẩm, hỗ trợ phục hồi sau peel...)"
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-y"
            />
          </div>

          {/* Row 4: Giá gốc won, Định lượng, Số lượng, Giá bán */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Giá gốc (won)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={originalPriceWon}
                onChange={(e) =>
                  setOriginalPriceWon(e.target.value === '' ? '' : parseFloat(e.target.value))
                }
                placeholder="VD: 10"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Định lượng
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Hộp / Cái"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số lượng kho <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                placeholder="VD: 20"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                required
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {Number(quantity) === 0 ? '🔴 Hết' : Number(quantity) <= 5 ? '🟡 Sắp hết' : '🟢 Còn'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Giá bán (VND) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="1000"
                min="0"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                placeholder="VD: 45000"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-brand-700 font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                required
              />
            </div>
          </div>

          {/* Row 5: Ghi chú */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú cá nhân</label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú vị trí kệ, đợt hàng, hạn sử dụng, đặc điểm lưu ý khi tư vấn..."
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-y"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
            >
              {isEditing ? 'Lưu thay đổi' : 'Lưu sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
