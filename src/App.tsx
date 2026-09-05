import { useState, useEffect, useRef } from 'react';
import type { Product } from './types/product';
import { getStockStatus } from './types/product';
import {
  loadProductsFromStorage,
  saveProductsToStorage,
  resetProductsToDefault,
} from './services/storage';
import { exportProductsToExcel, importProductsFromExcel } from './utils/excel';
import { Sidebar } from './components/layout/Sidebar';
import type { NavTab } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { ProductListView } from './components/products/ProductListView';
import { ProductFormModal } from './components/products/ProductFormModal';
import { ProductDetailModal } from './components/products/ProductDetailModal';
import { DeleteConfirmModal } from './components/products/DeleteConfirmModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { BrandsView } from './components/brands/BrandsView';
import { StatsView } from './components/stats/StatsView';
import { Toast } from './components/common/Toast';
import type { ToastMessage } from './components/common/Toast';

export function App() {
  // Navigation & Mobile state
  const [currentTab, setCurrentTab] = useState<NavTab>('products');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Products Data
  const [products, setProducts] = useState<Product[]>(() => loadProductsFromStorage());

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Checkbox Selection state for deletion
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [bulkProductsToDelete, setBulkProductsToDelete] = useState<Product[]>([]);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Toast helper
  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard shortcuts: Ctrl+K, Ctrl+N, Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + K or Cmd + K: Focus Search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCurrentTab('products');
        setTimeout(() => {
          searchInputRef.current?.focus();
          searchInputRef.current?.select();
        }, 50);
      }

      // Ctrl + N: Add New Product
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setEditingProduct(null);
        setIsFormModalOpen(true);
      }

      // Esc: Close all modals
      if (e.key === 'Escape') {
        setIsFormModalOpen(false);
        setIsDetailModalOpen(false);
        setIsDeleteModalOpen(false);
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update storage whenever products change
  const updateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    saveProductsToStorage(newProducts);
  };

  // Counts for navbar & stats
  const inStockCount = products.filter((p) => getStockStatus(p.quantity) === 'in_stock').length;
  const lowStockCount = products.filter((p) => getStockStatus(p.quantity) === 'low_stock').length;
  const outOfStockCount = products.filter(
    (p) => getStockStatus(p.quantity) === 'out_of_stock'
  ).length;

  // Handlers for Checkbox Selection
  const handleToggleSelect = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleToggleSelectAll = (visibleProducts: Product[]) => {
    const visibleIds = visibleProducts.map((p) => p.id);
    const isAllVisibleSelected =
      visibleIds.length > 0 && visibleIds.every((id) => selectedProductIds.includes(id));

    if (isAllVisibleSelected) {
      // Deselect all visible
      setSelectedProductIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      // Select all visible
      const merged = Array.from(new Set([...selectedProductIds, ...visibleIds]));
      setSelectedProductIds(merged);
    }
  };

  const handleClearSelection = () => {
    setSelectedProductIds([]);
  };

  // Handlers for Products
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  const handleOpenDetailModal = (product: Product) => {
    setDetailProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleOpenDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setBulkProductsToDelete([]);
    setIsDeleteModalOpen(true);
  };

  const handleOpenBulkDeleteModal = () => {
    const selected = products.filter((p) => selectedProductIds.includes(p.id));
    if (selected.length === 0) return;
    setBulkProductsToDelete(selected);
    setProductToDelete(null);
    setIsDeleteModalOpen(true);
  };

  // Save Add or Edit
  const handleSaveProduct = (
    data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => {
    const now = new Date().toISOString();

    if (data.id) {
      // Editing existing product
      const updated = products.map((p) => {
        if (p.id === data.id) {
          return {
            ...p,
            ...data,
            updatedAt: now,
          };
        }
        return p;
      });
      updateProducts(updated);
      addToast('success', 'Đã lưu thay đổi', `Đã cập nhật thông tin sản phẩm "${data.name}".`);

      // Update detail modal if currently viewing this product
      if (detailProduct && detailProduct.id === data.id) {
        setDetailProduct((prev) => (prev ? { ...prev, ...data, updatedAt: now } : null));
      }
    } else {
      // Adding new product
      const newProd: Product = {
        ...data,
        id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        createdAt: now,
        updatedAt: now,
      };
      const updated = [newProd, ...products];
      updateProducts(updated);
      addToast('success', 'Đã thêm sản phẩm', `Sản phẩm "${newProd.name}" đã được đưa vào kho.`);
    }
  };

  // Confirm Delete (Single or Bulk)
  const handleConfirmDelete = () => {
    if (bulkProductsToDelete.length > 0) {
      const idsToDelete = new Set(bulkProductsToDelete.map((p) => p.id));
      const updated = products.filter((p) => !idsToDelete.has(p.id));
      updateProducts(updated);
      addToast(
        'warning',
        'Đã xóa hàng loạt',
        `Đã xóa thành công ${bulkProductsToDelete.length} sản phẩm khỏi kho.`
      );
      setSelectedProductIds([]);
      setBulkProductsToDelete([]);
      setIsDeleteModalOpen(false);

      if (detailProduct && idsToDelete.has(detailProduct.id)) {
        setIsDetailModalOpen(false);
        setDetailProduct(null);
      }
    } else if (productToDelete) {
      const updated = products.filter((p) => p.id !== productToDelete.id);
      updateProducts(updated);
      setSelectedProductIds((prev) => prev.filter((id) => id !== productToDelete.id));
      addToast('warning', 'Đã xóa sản phẩm', `Đã loại bỏ "${productToDelete.name}" khỏi kho.`);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);

      if (detailProduct && detailProduct.id === productToDelete.id) {
        setIsDetailModalOpen(false);
        setDetailProduct(null);
      }
    }
  };

  // Reset Data to sample
  const handleResetData = () => {
    if (
      window.confirm(
        'Bạn có chắc chắn muốn khôi phục lại danh sách sản phẩm mẫu ban đầu của MEDIHEAL & NUMBUZIN không?'
      )
    ) {
      const defaults = resetProductsToDefault();
      setProducts(defaults);
      setSelectedProductIds([]);
      addToast('info', 'Khôi phục thành công', 'Đã tải lại toàn bộ sản phẩm mẫu ban đầu.');
    }
  };

  // Export Excel
  const handleExportExcel = () => {
    try {
      // If user has selected items, give priority to exporting selected items or all
      const exportList =
        selectedProductIds.length > 0
          ? products.filter((p) => selectedProductIds.includes(p.id))
          : products;

      const fileName =
        selectedProductIds.length > 0
          ? `danh-sach-${selectedProductIds.length}-san-pham-da-chon.xlsx`
          : 'kho-my-pham-ca-nhan.xlsx';

      exportProductsToExcel(exportList, fileName);
      addToast(
        'success',
        'Xuất file thành công',
        `Đã tải xuống file Excel (${exportList.length} sản phẩm).`
      );
    } catch (err) {
      console.error(err);
      addToast('error', 'Lỗi xuất file', 'Không thể tạo file Excel. Vui lòng thử lại.');
    }
  };

  // Import Excel
  const handleImportExcel = async (file: File) => {
    try {
      const importedProducts = await importProductsFromExcel(file);
      if (importedProducts.length === 0) {
        addToast('warning', 'File rỗng', 'Không tìm thấy dữ liệu trong file.');
        return;
      }

      // Merge with existing products
      const updated = [...importedProducts, ...products];
      updateProducts(updated);
      addToast(
        'success',
        'Nhập Excel thành công!',
        `Đã nạp thêm ${importedProducts.length} sản phẩm vào kho của bạn.`
      );
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Lỗi nhập file', err.message || 'Không thể đọc file Excel/CSV này.');
    }
  };

  // Quick navigation from Dashboard or Brands
  const handleQuickNavigate = (brandFilter?: string, statusFilter?: string) => {
    if (brandFilter) setSelectedBrand(brandFilter);
    if (statusFilter) setSelectedStatus(statusFilter);
    setCurrentTab('products');
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setSelectedBrand('ALL');
    setSelectedStatus('ALL');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-brand-100 selection:text-brand-900">
      {/* Toast notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAddModal={handleOpenAddModal}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        productCount={products.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          onToggleMobileMenu={() => setIsMobileSidebarOpen(true)}
          onResetData={handleResetData}
          totalProducts={products.length}
          inStockCount={inStockCount}
          lowStockCount={lowStockCount}
          outOfStockCount={outOfStockCount}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'products' && (
            <ProductListView
              products={products}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedBrand={selectedBrand}
              onBrandChange={setSelectedBrand}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              onResetFilters={handleResetFilters}
              onOpenAddModal={handleOpenAddModal}
              onSelectProduct={handleOpenDetailModal}
              onEditProduct={handleOpenEditModal}
              onDeleteProduct={handleOpenDeleteModal}
              selectedProductIds={selectedProductIds}
              onToggleSelect={handleToggleSelect}
              onToggleSelectAll={() => handleToggleSelectAll(products)}
              onBulkDelete={handleOpenBulkDeleteModal}
              onClearSelection={handleClearSelection}
              onExportExcel={handleExportExcel}
              onImportExcel={handleImportExcel}
              searchInputRef={searchInputRef}
            />
          )}

          {currentTab === 'overview' && (
            <DashboardView
              products={products}
              onNavigateToProducts={handleQuickNavigate}
              onOpenAddModal={handleOpenAddModal}
            />
          )}

          {currentTab === 'brands' && (
            <BrandsView
              products={products}
              onSelectBrand={(brand) => {
                setSelectedBrand(brand);
                setCurrentTab('products');
              }}
            />
          )}

          {currentTab === 'stats' && (
            <StatsView products={products} onSelectProduct={handleOpenDetailModal} />
          )}
        </main>
      </div>

      {/* Modal: Thêm / Sửa sản phẩm */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSaveProduct}
        initialData={editingProduct}
      />

      {/* Modal: Xem chi tiết sản phẩm */}
      <ProductDetailModal
        product={detailProduct}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={(prod) => {
          setIsDetailModalOpen(false);
          handleOpenEditModal(prod);
        }}
        onDelete={(prod) => {
          setIsDetailModalOpen(false);
          handleOpenDeleteModal(prod);
        }}
      />

      {/* Modal: Xác nhận xóa sản phẩm (đơn lẻ hoặc hàng loạt) */}
      <DeleteConfirmModal
        product={productToDelete}
        bulkProducts={bulkProductsToDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
          setBulkProductsToDelete([]);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default App;
