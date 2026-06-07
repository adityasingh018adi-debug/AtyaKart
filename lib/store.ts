import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types";

interface StoreState {
  cart: CartItem[];
  wishlist: Product[];
  recentlyViewed: string[];
  addRecentlyViewed: (id: string) => void;
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQty: (id: string, size: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
  cartTotal: () => number;
  cartCount: () => number;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      recentlyViewed: [],

      addRecentlyViewed: (id) =>
        set((state) => ({
          recentlyViewed: [id, ...state.recentlyViewed.filter((x) => x !== id)].slice(0, 12),
        })),

      addToCart: (product, size) =>
        set((state) => {
          const existing = state.cart.find(
            (item) => item.product.id === product.id && item.size === size
          );
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item === existing ? { ...item, qty: item.qty + 1 } : item
              ),
            };
          }
          return {
            cart: [
              ...state.cart,
              { id: `${product.id}-${size}`, product, size, qty: 1 },
            ],
          };
        }),

      removeFromCart: (id, size) =>
        set((state) => ({
          cart: state.cart.filter((item) => !(item.product.id === id && item.size === size)),
        })),

      updateQty: (id, size, qty) =>
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item.product.id === id && item.size === size ? { ...item, qty } : item
            )
            .filter((item) => item.qty > 0),
        })),

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (product) =>
        set((state) => {
          const exists = state.wishlist.some((p) => p.id === product.id);
          return {
            wishlist: exists
              ? state.wishlist.filter((p) => p.id !== product.id)
              : [...state.wishlist, product],
          };
        }),

      isWishlisted: (id) => get().wishlist.some((p) => p.id === id),

      cartTotal: () =>
        get().cart.reduce((sum, item) => sum + item.product.price * item.qty, 0),

      cartCount: () => get().cart.reduce((sum, item) => sum + item.qty, 0),
    }),
    {
      name: "atyakart-store",
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        recentlyViewed: state.recentlyViewed,
      }),
    }
  )
);
