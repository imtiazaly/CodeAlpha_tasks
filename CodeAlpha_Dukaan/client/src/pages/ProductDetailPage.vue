<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from "lucide-vue-next";
import { getProductById } from "../services/productService";
import { useCart } from "../composables/useCart";
import { useAuth } from "../composables/useAuth";
import { useToast } from "../composables/useToast";

const route = useRoute();
const router = useRouter();
const { addToCart } = useCart();
const { isAuthenticated } = useAuth();
const { showToast } = useToast();

const product = ref(null);
const loading = ref(true);
const error = ref("");
const quantity = ref(1);
const isAdding = ref(false);

const isOutOfStock = computed(() => (product.value?.stock ?? 1) <= 0);
const maxStock = computed(() => product.value?.stock || 99);

onMounted(async () => {
  try {
    loading.value = true;
    product.value = await getProductById(route.params.id);
  } catch (err) {
    error.value = err.message || "Failed to load product details";
  } finally {
    loading.value = false;
  }
});

const increment = () => {
  if (quantity.value < maxStock.value) {
    quantity.value++;
  }
};

const decrement = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const handleAddToCart = async () => {
  if (isOutOfStock.value) return;

  if (!isAuthenticated.value) {
    showToast("Please login first to add items to your cart", "warning");
    router.push("/login");
    return;
  }

  try {
    isAdding.value = true;
    await addToCart(product.value._id, quantity.value);
    showToast(
      `Added ${quantity.value}x ${product.value.name} to cart!`,
      "success",
    );
  } catch (err) {
    showToast(err.message || "Failed to add to cart", "error");
  } finally {
    isAdding.value = false;
  }
};
</script>

<template>
  <div class="py-6 max-w-6xl mx-auto space-y-8">
    <!-- Back Button -->
    <button
      @click="router.back()"
      class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 glass-card transition-all"
    >
      <ArrowLeft class="w-4 h-4" />
      <span>Back to Products</span>
    </button>

    <!-- Skeleton Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div
        class="w-full aspect-square rounded-3xl bg-slate-200/70 animate-shimmer"
      />
      <div class="space-y-4">
        <div class="h-4 bg-slate-200/70 rounded w-24 animate-shimmer" />
        <div class="h-8 bg-slate-200/80 rounded w-3/4 animate-shimmer" />
        <div class="h-6 bg-slate-200/60 rounded w-32 animate-shimmer" />
        <div class="h-24 bg-slate-200/40 rounded-xl animate-shimmer" />
        <div class="h-12 bg-slate-200/70 rounded-2xl animate-shimmer" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20 glass-panel rounded-3xl">
      <p class="text-base font-bold text-rose-500">{{ error }}</p>
      <button
        @click="router.push('/')"
        class="mt-4 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-xl"
      >
        Go to Home
      </button>
    </div>

    <!-- Product Details Content -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
      <!-- Left: Image Showcase -->
      <div class="glass-card rounded-3xl p-6 relative overflow-hidden group">
        <div
          class="w-full aspect-square rounded-2xl bg-slate-100/80 flex items-center justify-center overflow-hidden"
        >
          <img
            v-if="product.image"
            :src="product.image"
            :alt="product.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <ShoppingBag v-else class="w-20 h-20 text-slate-300" />
        </div>

        <!-- Floating Category Pill -->
        <span
          v-if="product.category"
          class="absolute top-8 left-8 glass-panel px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 uppercase tracking-wider"
        >
          {{ product.category }}
        </span>
      </div>

      <!-- Right: Product Information & Purchase Controls -->
      <div class="space-y-6">
        <div>
          <!-- Stock Pill -->
          <span
            v-if="isOutOfStock"
            class="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-600 mb-2"
          >
            Out of Stock
          </span>
          <span
            v-else
            class="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700 mb-2"
          >
            {{
              product.stock > 5
                ? "In Stock & Ready to Ship"
                : `Hurry! Only ${product.stock} units left`
            }}
          </span>

          <h1
            class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            {{ product.name }}
          </h1>

          <!-- Price -->
          <div class="mt-3 flex items-baseline gap-3">
            <span class="text-3xl font-extrabold text-indigo-600">
              ${{ (Number(product.price) || 0).toFixed(2) }}
            </span>
          </div>
        </div>

        <!-- Description -->
        <div class="glass-panel rounded-2xl p-4">
          <h4
            class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1"
          >
            Description
          </h4>
          <p class="text-sm text-slate-600 leading-relaxed">
            {{
              product.description ||
              "Designed with excellence and precision. Built to ensure enduring performance and aesthetic quality."
            }}
          </p>
        </div>

        <!-- Quantity Stepper & Add to Cart -->
        <div class="space-y-4 pt-2">
          <div class="flex items-center gap-4">
            <span class="text-xs font-bold text-slate-700">Quantity:</span>

            <div
              class="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs"
            >
              <button
                @click="decrement"
                :disabled="quantity <= 1 || isOutOfStock"
                class="text-slate-500 hover:text-indigo-600 disabled:opacity-30"
              >
                <Minus class="w-4 h-4" />
              </button>
              <span
                class="text-sm font-bold text-slate-800 min-w-5 text-center"
              >
                {{ quantity }}
              </span>
              <button
                @click="increment"
                :disabled="quantity >= maxStock || isOutOfStock"
                class="text-slate-500 hover:text-indigo-600 disabled:opacity-30"
              >
                <Plus class="w-4 h-4" />
              </button>
            </div>

            <!-- Subtotal preview -->
            <span class="text-xs text-slate-500 font-medium">
              Subtotal:
              <strong class="text-slate-800"
                >${{
                  ((Number(product.price) || 0) * quantity).toFixed(2)
                }}</strong
              >
            </span>
          </div>

          <!-- Add to Cart CTA -->
          <button
            @click="handleAddToCart"
            :disabled="isOutOfStock || isAdding"
            :class="[
              'w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all',
              isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-linear-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-500/25 hover:shadow-indigo-500/35 active:scale-[0.99]',
            ]"
          >
            <div
              v-if="isAdding"
              class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
            />
            <ShoppingBag v-else class="w-5 h-5" />
            <span>{{
              isOutOfStock ? "Currently Unavailable" : `Add ${quantity} to Cart`
            }}</span>
          </button>
        </div>

        <!-- Trust Badges Strip -->
        <div class="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
          <div
            class="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 border border-slate-100"
          >
            <Truck class="w-4 h-4 text-indigo-600 mb-1" />
            <span class="text-[11px] font-bold text-slate-800"
              >Fast Shipping</span
            >
            <span class="text-[10px] text-slate-400">Within 2-3 days</span>
          </div>
          <div
            class="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 border border-slate-100"
          >
            <RotateCcw class="w-4 h-4 text-emerald-600 mb-1" />
            <span class="text-[11px] font-bold text-slate-800"
              >Easy Returns</span
            >
            <span class="text-[10px] text-slate-400">30-day window</span>
          </div>
          <div
            class="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 border border-slate-100"
          >
            <ShieldCheck class="w-4 h-4 text-purple-600 mb-1" />
            <span class="text-[11px] font-bold text-slate-800"
              >Secure Order</span
            >
            <span class="text-[10px] text-slate-400">100% Guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
