import { atom, map } from 'nanostores';

export interface CartItem {
  slug: string;
  model: string;
  title: string;
  quantity: number;
}

export const isCartOpen = atom(false);
export const isQuotePopOpen = atom(false);
export const isEmailGateOpen = atom(false);
export const emailGateFile = atom<{ productSlug: string; fileType: string } | null>(null);

export const cartItems = map<Record<string, CartItem>>({});

export function addToCart(item: Omit<CartItem, 'quantity'>) {
  const current = cartItems.get();
  if (current[item.slug]) {
    cartItems.setKey(item.slug, { ...current[item.slug], quantity: current[item.slug].quantity + 1 });
  } else {
    cartItems.setKey(item.slug, { ...item, quantity: 1 });
  }
}

export function removeFromCart(slug: string) {
  cartItems.setKey(slug, undefined as unknown as CartItem);
}

export function clearCart() {
  cartItems.set({});
}

export function getCartCount(): number {
  const items = Object.values(cartItems.get());
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function getCartItems(): CartItem[] {
  return Object.values(cartItems.get());
}
