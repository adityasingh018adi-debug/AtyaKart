import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types";

interface CoinEntry {
  label: string;
  amount: number;
  date: string;
}

function generateReferralCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

interface StoreState {
  cart: CartItem[];
  wishlist: Product[];
  recentlyViewed: string[];
  atyaCoins: number;
  coinHistory: CoinEntry[];
  reviewedProducts: string[];
  hasReviewed: (productId: string) => boolean;
  markReviewed: (productId: string) => void;
  referralCode: string;
  referralBonusClaimed: boolean;
  claimReferralBonus: () => boolean;
  addRecentlyViewed: (id: string) => void;
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQty: (id: string, size: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
  cartTotal: () => number;
  cartCount: () => number;
  earnCoins: (amount: number, label: string) => void;
  redeemCoins: (amount: number) => boolean;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      recentlyViewed: [],
      atyaCoins: 0,
      coinHistory: [],
      reviewedProducts: [],
      referralCode: generateReferralCode(),
      referralBonusClaimed: false,

      hasReviewed: (productId) => get().reviewedProducts.includes(productId),

      markReviewed: (productId) =>
        set((state) => ({
          reviewedProducts: state.reviewedProducts.includes(productId)
            ? state.reviewedProducts
            : [...state.reviewedProducts, productId],
        })),

      claimReferralBonus: () => {
        if (get().referralBonusClaimed) return false;
        set((state) => ({
          referralBonusClaimed: true,
          atyaCoins: state.atyaCoins + 50,
          coinHistory: [
            { label: "Referral welcome bonus", amount: 50, date: new Date().toISOString() },
            ...state.coinHistory,
          ].slice(0, 20),
        }));
        return true;
      },

      earnCoins: (amount, label) =>
        set((state) => ({
          atyaCoins: state.atyaCoins + amount,
          coinHistory: [
            { label, amount, date: new Date().toISOString() },
            ...state.coinHistory,
          ].slice(0, 20),
        })),

      redeemCoins: (amount) => {
        const state = get();
        if (state.atyaCoins < amount) return false;
        set({
          atyaCoins: state.atyaCoins - amount,
          coinHistory: [
            { label: "Redeemed for discount", amount: -amount, date: new Date().toISOString() },
            ...state.coinHistory,
          ].slice(0, 20),
        });
        return true;
      },

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
        atyaCoins: state.atyaCoins,
        coinHistory: state.coinHistory,
        reviewedProducts: state.reviewedProducts,
        referralCode: state.referralCode,
        referralBonusClaimed: state.referralBonusClaimed,
      }),
    }
  )
);
