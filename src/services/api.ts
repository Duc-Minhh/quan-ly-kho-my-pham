import type { Product } from '../types/product';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const SUPABASE_BASE_URL = 'https://hwwdtlmekefpakreiirp.supabase.co/rest/v1';
const SUPABASE_ANON_KEY = 'sb_publishable_iOZuh3s6VMw1dUrgWFcOUQ_jc0n-G_g';

const getHeaders = () => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
});

// Map Database row to Product model
export const mapDbRowToProduct = (row: any): Product => ({
  id: String(row.id),
  code: row.code || '',
  image: row.image || '',
  category: row.category || 'Mặt nạ',
  brand: row.brand || 'Khác',
  name: row.name || '',
  usage: row.usage || '',
  originalPriceWon: Number(row.original_price_won) || 0,
  unit: row.unit || 'Cái',
  quantity: Number(row.quantity) || 0,
  salePrice: Number(row.sale_price) || 0,
  note: row.note || '',
  createdAt: row.created_at || new Date().toISOString(),
  updatedAt: row.updated_at || new Date().toISOString(),
});

// Map Product model to Database row
export const mapProductToDbRow = (product: Product) => ({
  id: product.id,
  code: product.code,
  image: product.image,
  category: product.category,
  brand: product.brand,
  name: product.name,
  usage: product.usage,
  original_price_won: product.originalPriceWon,
  unit: product.unit,
  quantity: product.quantity,
  sale_price: product.salePrice,
  note: product.note,
  updated_at: new Date().toISOString(),
});

/**
 * 1. Fetch all products from shared Supabase database
 */
export const apiGetProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch(
      `${SUPABASE_BASE_URL}/products?select=*&order=created_at.desc`,
      {
        headers: getHeaders(),
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
    }

    const rows = await res.json();

    // If database is empty, auto-seed initial products
    if (Array.isArray(rows) && rows.length === 0) {
      await apiSeedInitialProducts();
      return INITIAL_PRODUCTS;
    }

    return rows.map(mapDbRowToProduct);
  } catch (err) {
    console.error('Lỗi khi tải sản phẩm từ máy chủ:', err);
    throw err;
  }
};

/**
 * 2. Create a new product in shared database
 */
export const apiCreateProduct = async (product: Product): Promise<Product> => {
  const row = mapProductToDbRow(product);

  const res = await fetch(`${SUPABASE_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      ...getHeaders(),
      Prefer: 'return=representation',
    },
    body: JSON.stringify([row]),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Không thể lưu sản phẩm lên máy chủ: ${errorText}`);
  }

  const savedRows = await res.json();
  return mapDbRowToProduct(savedRows[0]);
};

/**
 * 3. Update an existing product in shared database
 */
export const apiUpdateProduct = async (
  id: string,
  updates: Partial<Product>
): Promise<Product> => {
  const dbUpdates: any = {
    updated_at: new Date().toISOString(),
  };

  if (updates.code !== undefined) dbUpdates.code = updates.code;
  if (updates.image !== undefined) dbUpdates.image = updates.image;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.brand !== undefined) dbUpdates.brand = updates.brand;
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.usage !== undefined) dbUpdates.usage = updates.usage;
  if (updates.originalPriceWon !== undefined)
    dbUpdates.original_price_won = updates.originalPriceWon;
  if (updates.unit !== undefined) dbUpdates.unit = updates.unit;
  if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity;
  if (updates.salePrice !== undefined) dbUpdates.sale_price = updates.salePrice;
  if (updates.note !== undefined) dbUpdates.note = updates.note;

  const res = await fetch(`${SUPABASE_BASE_URL}/products?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: {
      ...getHeaders(),
      Prefer: 'return=representation',
    },
    body: JSON.stringify(dbUpdates),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Không thể cập nhật sản phẩm trên máy chủ: ${errorText}`);
  }

  const savedRows = await res.json();
  return mapDbRowToProduct(savedRows[0]);
};

/**
 * 4. Delete a product from shared database
 */
export const apiDeleteProduct = async (id: string): Promise<void> => {
  const res = await fetch(`${SUPABASE_BASE_URL}/products?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Không thể xóa sản phẩm trên máy chủ: ${errorText}`);
  }
};

/**
 * 5. Bulk delete products from shared database
 */
export const apiBulkDeleteProducts = async (ids: string[]): Promise<void> => {
  if (ids.length === 0) return;

  const inQuery = ids.map((id) => `"${id}"`).join(',');
  const res = await fetch(`${SUPABASE_BASE_URL}/products?id=in.(${inQuery})`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Không thể xóa hàng loạt trên máy chủ: ${errorText}`);
  }
};

/**
 * 6. Seed initial catalog if empty
 */
export const apiSeedInitialProducts = async (): Promise<void> => {
  const rows = INITIAL_PRODUCTS.map(mapProductToDbRow);
  const res = await fetch(`${SUPABASE_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      ...getHeaders(),
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify(rows),
  });

  if (!res.ok) {
    console.error('Could not seed initial products');
  }
};
