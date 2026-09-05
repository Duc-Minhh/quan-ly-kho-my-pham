import type { Product } from '../types/product';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const STORAGE_KEY = 'my_cosmetics_products_v1';

export const loadProductsFromStorage = (): Product[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // Only load initial sample products on the very first visit (when key does not exist)
    if (raw === null) {
      saveProductsToStorage(INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to load products from localStorage:', err);
    return [];
  }
};

export const saveProductsToStorage = (products: Product[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Failed to save products to localStorage:', err);
  }
};

export const resetProductsToDefault = (): Product[] => {
  saveProductsToStorage(INITIAL_PRODUCTS);
  return INITIAL_PRODUCTS;
};
