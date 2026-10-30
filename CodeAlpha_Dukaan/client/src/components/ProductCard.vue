<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { ShoppingBag, Star, Check, AlertCircle } from "lucide-vue-next";
import { useCart } from "../composables/useCart";
import { useAuth } from "../composables/useAuth";
import { useToast } from "../composables/useToast";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const { addToCart } = useCart();
const { isAuthenticated } = useAuth();
const { showToast } = useToast();

const isAdding = ref(false);

const isOutOfStock = computed(() => (props.product.stock ?? 1) <= 0);
const isLowStock = computed(() => props.product.stock > 0 && props.product.stock <= 5);

const handleAddToCart = async (e) => {
  e.stopPropagation();
  if (isOutOfStock.value) return;

  if (!isAuthenticated.value) {
    showToast("Please login first to add items to your cart", "warning");
    router.push("/login");
    return;
  }

  try {
    isAdding.value = true;
    await addToCart(props.product._id, 1);
    showToast(`${props.product.name} added to cart!`, "success");
  } catch (err) {
    showToast(err.message || "Failed to add to cart", "error");
  } finally {
    isAdding.value = false;
  }
};

const goToDetails = () => {
  router.push(`/product/${props.product._id}`);
};
</script>

<template>
  <div
    @click="goToDetails"
    class="glass-card rounded-3xl p-4 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
  >
    <!-- Top Area: Image Showcase -->
    <div>
      <div class="relative w-full aspect-square rounded-2xl bg-slate-100/80 overflow-hidden mb-4 flex items-center justify-center">
        <!-- Image with smooth hover zoom -->
        <img
          v-if="product.image"
          :src="product.image"
          :alt="product.name"
          class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
        />
        <div v-else class="text-slate-300 flex flex-col items-center">
          <ShoppingBag class="w-12 h-12 stroke-[1.5]" />
        </div>

        <!-- Floating Category Tag -->
        <span
          v-if="product.category"
          class="absolute top-3 left-3 glass-panel px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-700 uppercase tracking-wider shadow-2xs"
        >
          {{ product.category }}
        </span>

        <!-- Stock Status Badge -->
        <div class="absolute top-3 right-3">
          <span
            v-if="isOutOfStock"
            class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-500/90 text-white shadow-2xs backdrop-blur-xs"
          >
            Out of Stock
          </span>
          <span
            v-else-if="isLowStock"
            class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/90 text-white shadow-2xs backdrop-blur-xs"
          >
            Only {{ product.stock }} left
          </span>
          <span
            v-else
            class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/85 text-white shadow-2xs backdrop-blur-xs"
          >
            In Stock
          </span>
        </div>
      </div>

      <!-- Product Meta -->
      <div class="space-y-1.5 px-1">
        <h3 class="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {{ product.name }}
        </h3>
        <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {{ product.description || "Premium crafted product with exceptional quality materials." }}
        </p>
      </div>
    </div>

    <!-- Bottom Area: Price & Action Button -->
    <div class="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between px-1">
      <div>
        <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Price</span>
        <span class="text-base font-extrabold text-slate-900">
          ${{ (Number(product.price) || 0).toFixed(2) }}
        </span>
      </div>

      <!-- Quick Add-To-Cart Button -->
      <button
        @click="handleAddToCart"
        :disabled="isOutOfStock || isAdding"
        :class="[
          'h-10 px-3.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs',
          isOutOfStock
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white hover:shadow-indigo-500/25 shadow-md'
        ]"
      >
        <div v-if="isAdding" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        <ShoppingBag v-else class="w-4 h-4" />
        <span class="hidden sm:inline">{{ isOutOfStock ? 'Sold Out' : 'Add' }}</span>
      </button>
    </div>
  </div>
</template>