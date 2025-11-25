// src/stores/cart.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
  const items = ref([]);

  // Computed
  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const subtotal = computed(() => {
    return items.value.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  });

  const iva = computed(() => subtotal.value * 0.19); // 19% IVA

  const total = computed(() => subtotal.value + iva.value);

  // Actions
  const addItem = (product, quantity = 1) => {
    const existingItem = items.value.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        stock: product.stock
      });
    }
  };

  const removeItem = (productId) => {
    const index = items.value.findIndex(item => item.id === productId);
    if (index > -1) {
      items.value.splice(index, 1);
    }
  };

  const updateQuantity = (productId, quantity) => {
    const item = items.value.find(item => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, Math.min(quantity, item.stock));
    }
  };

  const clearCart = () => {
    items.value = [];
  };

  return {
    items,
    itemCount,
    subtotal,
    iva,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  };
});