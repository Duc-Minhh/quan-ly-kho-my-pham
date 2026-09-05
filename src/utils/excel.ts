import * as XLSX from 'xlsx';
import type { Product } from '../types/product';
import { getCosmeticIconSvg } from './productImages';

export interface ExcelRow {
  'Mã sản phẩm'?: string;
  'Phân loại'?: string;
  'Tên hãng'?: string;
  'Tên sản phẩm'?: string;
  'Công dụng'?: string;
  'Giá gốc (won)'?: number | string;
  'Tiền thuế (won)'?: number | string;
  'Định lượng'?: string;
  'Số lượng'?: number | string;
  'Giá bán'?: number | string;
  'Ghi chú'?: string;
}

export const exportProductsToExcel = (products: Product[], filename: string = 'danh-sach-san-pham.xlsx'): void => {
  const rows = products.map((p) => ({
    'Mã sản phẩm': p.code,
    'Phân loại': p.category,
    'Tên hãng': p.brand,
    'Tên sản phẩm': p.name,
    'Công dụng': p.usage,
    'Giá gốc (won)': p.originalPriceWon,
    'Tiền thuế (won)': Math.round((p.originalPriceWon || 0) * 0.08 * 100) / 100,
    'Định lượng': p.unit,
    'Số lượng': p.quantity,
    'Giá bán': p.salePrice,
    'Ghi chú': p.note,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 14 }, // Mã SP
    { wch: 14 }, // Phân loại
    { wch: 16 }, // Tên hãng
    { wch: 36 }, // Tên SP
    { wch: 45 }, // Công dụng
    { wch: 14 }, // Giá gốc won
    { wch: 14 }, // Tiền thuế won
    { wch: 14 }, // Định lượng
    { wch: 10 }, // Số lượng
    { wch: 14 }, // Giá bán
    { wch: 30 }, // Ghi chú
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'KhoSanPham');

  XLSX.writeFile(workbook, filename);
};

export const importProductsFromExcel = async (file: File): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawRows = XLSX.utils.sheet_to_json<ExcelRow>(worksheet);

        if (!rawRows || rawRows.length === 0) {
          throw new Error('File Excel rỗng hoặc không có dữ liệu hợp lệ.');
        }

        const now = new Date().toISOString();
        const parsedProducts: Product[] = rawRows.map((row, idx) => {
          const brand = String(row['Tên hãng'] || 'Chưa phân loại').trim();
          const category = String(row['Phân loại'] || 'Mặt nạ').trim();
          const name = String(row['Tên sản phẩm'] || `Sản phẩm nhập ${idx + 1}`).trim();
          const code = String(row['Mã sản phẩm'] || `SP-${(idx + 1).toString().padStart(3, '0')}`).trim();
          const usage = String(row['Công dụng'] || '').trim();
          const originalPriceWon = Number(row['Giá gốc (won)']) || 0;
          const unit = String(row['Định lượng'] || 'Cái').trim();
          const quantity = Math.max(0, parseInt(String(row['Số lượng']), 10) || 0);
          const salePrice = Math.max(0, parseInt(String(row['Giá bán']), 10) || 0);
          const note = String(row['Ghi chú'] || '').trim();

          return {
            id: `imported-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
            code,
            image: getCosmeticIconSvg(brand, category, name),
            category,
            brand,
            name,
            usage,
            originalPriceWon,
            unit,
            quantity,
            salePrice,
            note,
            createdAt: now,
            updatedAt: now,
          };
        });

        resolve(parsedProducts);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
