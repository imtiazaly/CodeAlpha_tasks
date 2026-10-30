import { ref, computed } from "vue";
import { apiRequest } from "../services/api";
import { useAuth } from "./useAuth";

const cart = ref({ items: [] });
const isDrawerOpen = ref(false);
const loading = ref(false);

export function useCart() {
  const { isAuthenticated } = useAuth();

  const cartItemsCount = computed(() => {
    return (
      cart.value?.items?.reduce((total, item) => total + item.quantity, 0) || 0
    );
  });

  const cartTotalAmount = computed(() => {
    return (
      cart.value?.items?.reduce((total, item) => {
        const price = item.product?.price || 0;
        return total + price * item.quantity;
      }, 0) || 0
    );
  });

  const fetchCart = async () => {
    if (!isAuthenticated.value) {
      cart.value = { items: [] };
      return;
    }
    try {
      loading.value = true;
      const data = await apiRequest("/cart");
      cart.value = data.cart || { items: [] };
    } catch (err) {
      console.error("Cart fetch error:", err);
    } finally {
      loading.value = false;
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated.value) {
      throw new Error("Please login first to add items to your cart");
    }
    const data = await apiRequest("/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
    cart.value = data.cart;
    isDrawerOpen.value = true; // Automatically open cart drawer with smooth animation!
    return data;
  };

  const updateQuantity = async (productId, quantity) => {
    const data = await apiRequest(`/cart/item/${productId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
    cart.value = data.cart;
    return data;
  };

  const removeFromCart = async (productId) => {
    const data = await apiRequest(`/cart/item/${productId}`, {
      method: "DELETE",
    });
    cart.value = data.cart;
    return data;
  };

  const openDrawer = () => {
    isDrawerOpen.value = true;
  };
  const closeDrawer = () => {
    isDrawerOpen.value = false;
  };

  return {
    cart,
    loading,
    isDrawerOpen,
    cartItemsCount,
    cartTotalAmount,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    openDrawer,
    closeDrawer,
  };
}