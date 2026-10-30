<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Sparkles,
} from "lucide-vue-next";
import { useCart } from "../composables/useCart";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const { isAuthenticated } = useAuth();
const {
  cart,
  isDrawerOpen,
  loading,
  cartItemsCount,
  cartTotalAmount,
  fetchCart,
  updateQuantity,
  removeFromCart,
  closeDrawer,
} = useCart();

onMounted(() => {
  if (isAuthenticated.value) {
    fetchCart();
  }
});

const handleCheckout = () => {
  closeDrawer();
  router.push("/checkout");
};
</script>

<template>
  <div class="relative z-50">
    <!-- Backdrop Overlay -->
    <Transition
      enter-active-class="ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isDrawerOpen"
        @click="closeDrawer"
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
      />
    </Transition>

    <!-- Slide-Over Panel -->
    <div
      class="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none"
    >
      <Transition
        enter-active-class="transform transition ease-in-out duration-300 sm:duration-500"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transform transition ease-in-out duration-300 sm:duration-500"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div
          v-if="isDrawerOpen"
          class="w-screen max-w-md pointer-events-auto bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col border-l border-slate-100"
        >
          <!-- Drawer Header -->
          <div
            class="p-6 border-b border-slate-100 flex items-center justify-between"
          >
            <div class="flex items-center gap-2.5">
              <div
                class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"
              >
                <ShoppingBag class="w-5 h-5" />
              </div>
              <div>
                <h2 class="text-base font-bold text-slate-900">Your Cart</h2>
                <p class="text-xs text-slate-500">
                  {{ cartItemsCount }} items selected
                </p>
              </div>
            </div>

            <button
              @click="closeDrawer"
              class="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Drawer Body (Items List / Empty State) -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <!-- Empty State -->
            <div
              v-if="!cart?.items || cart.items.length === 0"
              class="h-full flex flex-col items-center justify-center text-center py-12"
            >
              <div
                class="w-20 h-20 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-center text-indigo-500 mb-4 shadow-sm"
              >
                <ShoppingBag class="w-10 h-10 opacity-70" />
              </div>
              <h3 class="text-base font-bold text-slate-800">
                Your bag is empty
              </h3>
              <p class="text-xs text-slate-500 max-w-xs mt-1 mb-6">
                Explore our collection and discover quality products crafted for
                you.
              </p>
              <button
                @click="closeDrawer"
                class="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-500/20"
              >
                Start Shopping
              </button>
            </div>

            <!-- Cart Items -->
            <div
              v-else
              v-for="item in cart.items"
              :key="item.product?._id || item._id"
              class="flex gap-4 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-all"
            >
              <!-- Thumbnail -->
              <div
                class="w-20 h-20 rounded-xl bg-white overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center"
              >
                <img
                  v-if="item.product?.image"
                  :src="item.product.image"
                  :alt="item.product?.name"
                  class="w-full h-full object-cover"
                />
                <ShoppingBag v-else class="w-8 h-8 text-slate-300" />
              </div>

              <!-- Details -->
              <div class="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <div class="flex items-start justify-between gap-2">
                    <h4 class="text-sm font-bold text-slate-800 truncate">
                      {{ item.product?.name || "Product" }}
                    </h4>
                    <button
                      @click="removeFromCart(item.product?._id)"
                      class="text-slate-400 hover:text-rose-500 transition-colors p-1"
                      title="Remove"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                  <p class="text-xs font-bold text-indigo-600 mt-0.5">
                    ${{ (item.product?.price || 0).toFixed(2) }}
                  </p>
                </div>

                <!-- Quantity Stepper -->
                <div class="flex items-center justify-between mt-2">
                  <div
                    class="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-2 py-1 shadow-2xs"
                  >
                    <button
                      @click="
                        updateQuantity(item.product?._id, item.quantity - 1)
                      "
                      :disabled="item.quantity <= 1"
                      class="text-slate-500 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-500"
                    >
                      <Minus class="w-3.5 h-3.5" />
                    </button>
                    <span
                      class="text-xs font-bold text-slate-700 min-w-4 text-center"
                    >
                      {{ item.quantity }}
                    </span>
                    <button
                      @click="
                        updateQuantity(item.product?._id, item.quantity + 1)
                      "
                      class="text-slate-500 hover:text-indigo-600"
                    >
                      <Plus class="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span class="text-xs font-extrabold text-slate-800">
                    ${{
                      ((item.product?.price || 0) * item.quantity).toFixed(2)
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Drawer Footer (Total & Checkout) -->
          <div
            v-if="cart?.items && cart.items.length > 0"
            class="p-6 border-t border-slate-100 bg-white/70 space-y-4"
          >
            <div class="space-y-2">
              <div
                class="flex items-center justify-between text-xs text-slate-500"
              >
                <span>Subtotal</span>
                <span class="font-semibold text-slate-700"
                  >${{ cartTotalAmount.toFixed(2) }}</span
                >
              </div>
              <div
                class="flex items-center justify-between text-xs text-slate-500"
              >
                <span>Shipping</span>
                <span class="text-emerald-600 font-semibold">Free</span>
              </div>
              <div
                class="border-t border-slate-100 pt-2 flex items-center justify-between text-sm font-extrabold text-slate-900"
              >
                <span>Total</span>
                <span class="text-base text-indigo-600"
                  >${{ cartTotalAmount.toFixed(2) }}</span
                >
              </div>
            </div>

            <button
              @click="handleCheckout"
              class="w-full py-3.5 px-4 bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/35"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
