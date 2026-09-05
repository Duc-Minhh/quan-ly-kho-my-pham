import { useState, useEffect, useRef } from 'react';
import type { Product } from './types/product';
import { getStockStatus } from './types/product';
import {
  loadProductsFromStorage,
  saveProductsToStorage,
  resetProductsToDefault,
} from './services/storage';
import {
  apiGetProducts,
  apiCreateProduct,
  apiUpdateProduct,
  apiDeleteProduct,
  apiBulkDeleteProducts,
  apiSeedInitialProducts,
} from './services/api';
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

  // Products Data - initialize with cache for zero flash of blank screen
  const [products, setProducts] = useState<Product[]>(() => loadProductsFromStorage());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

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

  // Helper to fetch latest products from shared cloud database
  const loadSharedProducts = async (showToast = false) => {
    setIsRefreshing(true);
    try {
      const cloudProducts = await apiGetProducts();
      if (cloudProducts && cloudProducts.length > 0) {
        setProducts(cloudProducts);
        saveProductsToStorage(cloudProducts);
        if (showToast) {
          addToast('success', 'Đã đồng bộ', 'Đã tải dữ liệu mới nhất từ máy chủ chung.');
        }
      }
    } catch (err: any) {
      console.error('Không thể tải sản phẩm từ máy chủ:', err);
      if (showToast) {
        addToast('error', 'Lỗi kết nối', 'Không thể kết nối tới máy chủ chung. Đang dùng dữ liệu trên máy.');
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // Load from cloud database when opening the site
  useEffect(() => {
    loadSharedProducts(false);
  }, []);

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
      setSelectedProductIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
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

  // Save Add or Edit (Persists permanently to shared cloud database)
  const handleSaveProduct = async (
    data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => {
    const now = new Date().toISOString();

    if (data.id) {
      // Editing existing product
      const existing = products.find((p) => p.id === data.id);
      const updatedProd: Product = {
        ...(existing || (data as any)),
        ...data,
        updatedAt: now,
      };

      // Optimistically update UI
      const nextProducts = products.map((p) => (p.id === data.id ? updatedProd : p));
      setProducts(nextProducts);
      saveProductsToStorage(nextProducts);

      if (detailProduct && detailProduct.id === data.id) {
        setDetailProduct(updatedProd);
      }

      try {
        await apiUpdateProduct(data.id, data);
        addToast(
          'success',
          'Đã lưu thành công!',
          `Đã cập nhật thông tin sản phẩm "${data.name}" lên máy chủ chung. Người khác truy cập sẽ thấy ngay.`
        );
      } catch (err: any) {
        console.error('Lỗi khi lưu lên máy chủ:', err);
        addToast(
          'warning',
          'Lưu cục bộ',
          'Đã lưu trên thiết bị của bạn nhưng gặp lỗi kết nối máy chủ.'
        );
      }
    } else {
      // Adding new product
      const newProd: Product = {
        ...data,
        id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        createdAt: now,
        updatedAt: now,
      };

      // Optimistically update UI
      const nextProducts = [newProd, ...products];
      setProducts(nextProducts);
      saveProductsToStorage(nextProducts);

      try {
        await apiCreateProduct(newProd);
        addToast(
          'success',
          'Đã thêm thành công!',
          `Sản phẩm "${newProd.name}" đã được lưu lên máy chủ chung.`
        );
      } catch (err: any) {
        console.error('Lỗi khi thêm lên máy chủ:', err);
        addToast(
          'warning',
          'Lưu cục bộ',
          'Đã lưu vào bộ nhớ tạm nhưng gặp lỗi gửi lên máy chủ.'
        );
      }
    }
  };

  // Confirm Delete (Single or Bulk)
  const handleConfirmDelete = async () => {
    if (bulkProductsToDelete.length > 0) {
      const idsToDelete = new Set(bulkProductsToDelete.map((p) => p.id));
      const idsArray = Array.from(idsToDelete);
      const nextProducts = products.filter((p) => !idsToDelete.has(p.id));
      
      setProducts(nextProducts);
      saveProductsToStorage(nextProducts);
      setSelectedProductIds([]);
      setBulkProductsToDelete([]);
      setIsDeleteModalOpen(false);

      if (detailProduct && idsToDelete.has(detailProduct.id)) {
        setIsDetailModalOpen(false);
        setDetailProduct(null);
      }

      try {
        await apiBulkDeleteProducts(idsArray);
        addToast(
          'warning',
          'Đã xóa hàng loạt',
          `Đã xóa vĩnh viễn ${idsArray.length} sản phẩm khỏi máy chủ chung.`
        );
      } catch (err: any) {
        console.error('Lỗi xóa trên máy chủ:', err);
        addToast('error', 'Lỗi xóa máy chủ', 'Không thể xóa trên máy chủ: ' + err.message);
      }
    } else if (productToDelete) {
      const id = productToDelete.id;
      const name = productToDelete.name;
      const nextProducts = products.filter((p) => p.id !== id);
      
      setProducts(nextProducts);
      saveProductsToStorage(nextProducts);
      setSelectedProductIds((prev) => prev.filter((item) => item !== id));
      setIsDeleteModalOpen(false);
      setProductToDelete(null);

      if (detailProduct && detailProduct.id === id) {
        setIsDetailModalOpen(false);
        setDetailProduct(null);
      }

      try {
        await apiDeleteProduct(id);
        addToast('warning', 'Đã xóa sản phẩm', `Đã xóa "${name}" khỏi máy chủ chung.`);
      } catch (err: any) {
        console.error('Lỗi xóa trên máy chủ:', err);
        addToast('error', 'Lỗi xóa máy chủ', 'Không thể xóa trên máy chủ: ' + err.message);
      }
    }
  };

  // Reset Data to sample
  const handleResetData = async () => {
    if (
      window.confirm(
        'Bạn có chắc chắn muốn khôi phục lại danh sách sản phẩm mẫu ban đầu của MEDIHEAL & NUMBUZIN không?'
      )
    ) {
      try {
        await apiSeedInitialProducts();
        const defaults = resetProductsToDefault();
        setProducts(defaults);
        setSelectedProductIds([]);
        addToast('info', 'Khôi phục thành công', 'Đã tải lại toàn bộ sản phẩm mẫu ban đầu lên máy chủ.');
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Export Excel
  const handleExportExcel = () => {
    try {
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

      const updated = [...importedProducts, ...products];
      setProducts(updated);
      saveProductsToStorage(updated);
      addToast(
        'success',
        'Nhập Excel thành công!',
        `Đã nạp thêm ${importedProducts.length} sản phẩm vào kho.`
      );

      // Save new products to cloud
      for (const p of importedProducts) {
        apiCreateProduct(p).catch(console.error);
      }
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
          onRefreshData={() => loadSharedProducts(true)}
          isRefreshing={isRefreshing}
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
