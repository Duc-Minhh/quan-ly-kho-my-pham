import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Product } from '../types/product';

const SUPABASE_CONFIG_KEY = 'my_cosmetics_supabase_config_v1';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

// Load config from env or localStorage
export const getSupabaseConfig = (): SupabaseConfig => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey };
  }

  try {
    const raw = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.url && parsed.anonKey) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading Supabase config from localStorage:', err);
  }

  return { url: '', anonKey: '' };
};

export const saveSupabaseConfig = (config: SupabaseConfig): void => {
  try {
    localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving Supabase config to localStorage:', err);
  }
};

let cachedClient: SupabaseClient | null = null;
let currentConfigUrl = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) {
    cachedClient = null;
    return null;
  }

  if (cachedClient && currentConfigUrl === config.url) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    currentConfigUrl = config.url;
    return cachedClient;
  } catch (err) {
    console.error('Error initializing Supabase client:', err);
    return null;
  }
};

// Map DB row to Product
export const mapRowToProduct = (row: any): Product => ({
  id: row.id,
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

// Map Product to DB row
export const mapProductToRow = (product: Product) => ({
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

// Database operations
export const fetchProductsFromCloud = async (): Promise<Product[] | null> => {
  const client = getSupabaseClient();
  if (!client) return null;

  const { data, error } = await client
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase fetch error:', error);
    throw error;
  }

  return (data || []).map(mapRowToProduct);
};

export const saveProductToCloud = async (product: Product): Promise<void> => {
  const client = getSupabaseClient();
  if (!client) return;

  const row = mapProductToRow(product);
  const { error } = await client.from('products').upsert(row);

  if (error) {
    console.error('Supabase upsert error:', error);
    throw error;
  }
};

export const deleteProductFromCloud = async (id: string): Promise<void> => {
  const client = getSupabaseClient();
  if (!client) return;

  const { error } = await client.from('products').delete().eq('id', id);

  if (error) {
    console.error('Supabase delete error:', error);
    throw error;
  }
};

export const bulkDeleteProductsFromCloud = async (ids: string[]): Promise<void> => {
  const client = getSupabaseClient();
  if (!client) return;

  const { error } = await client.from('products').delete().in('id', ids);

  if (error) {
    console.error('Supabase bulk delete error:', error);
    throw error;
  }
};

export const syncAllLocalToCloud = async (products: Product[]): Promise<void> => {
  const client = getSupabaseClient();
  if (!client) throw new Error('Chưa kết nối cơ sở dữ liệu Supabase');

  const rows = products.map(mapProductToRow);
  const { error } = await client.from('products').upsert(rows);

  if (error) {
    console.error('Supabase sync error:', error);
    throw error;
  }
};

// SQL setup script to copy-paste into Supabase SQL Editor
export const SUPABASE_SQL_SETUP = `-- 1. Tạo bảng products lưu kho mỹ phẩm
create table if not exists public.products (
  id text primary key,
  code text not null default '',
  image text default '',
  category text default 'Mặt nạ',
  brand text default '',
  name text not null,
  usage text default '',
  original_price_won numeric default 0,
  unit text default 'Cái',
  quantity integer default 0,
  sale_price numeric default 0,
  note text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Tắt RLS hoặc cho phép truy cập đọc/ghi công khai (dành cho app nội bộ)
alter table public.products enable row level security;

create policy "Allow all access to products" on public.products
  for all using (true) with check (true);

-- 3. Bật tính năng Real-time đồng bộ tức thì cho bảng products
alter publication supabase_realtime add table public.products;
`;
