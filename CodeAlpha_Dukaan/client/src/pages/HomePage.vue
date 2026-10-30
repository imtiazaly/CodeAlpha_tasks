<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { getProducts } from "../services/productService";
import HeroSection from "../components/HeroSection.vue";
import FilterBar from "../components/FilterBar.vue";
import ProductCard from "../components/ProductCard.vue";
import ProductSkeleton from "../components/ProductSkeleton.vue";

const route = useRoute();
const products = ref([]);
const loading = ref(true);
const error = ref("");

const selectedCategory = ref("All");
const searchQuery = ref("");
const sortBy = ref("default");

// Route query change hone par navbar search pick karein
watch(
  () => route.query.search,
  (newSearch) => {
    if (newSearch !== undefined) {
      searchQuery.value = newSearch;
    }
  },
  { immediate: true },
);

onMounted(async () => {
  try {
    const data = await getProducts();
    products.value = Array.isArray(data) ? data : data?.products || [];
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});

// Dynamic Categories list
const categories = computed(() => {
  if (!Array.isArray(products.value)) return ["All"];
  const cats = new Set(products.value.map((p) => p.category).filter(Boolean));
  return ["All", ...Array.from(cats)];
});

// Filtered & Sorted Products
const filteredProducts = computed(() => {
  if (!Array.isArray(products.value)) return [];
  let list = [...products.value];

  // 1. Filter by category
  if (selectedCategory.value !== "All") {
    list = list.filter((p) => p.category === selectedCategory.value);
  }

  // 2. Filter by search query
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q),
    );
  }

  // 3. Sort
  if (sortBy.value === "price-low") {
    list.sort((a, b) => a.price - b.price);
  } else if (sortBy.value === "price-high") {
    list.sort((a, b) => b.price - a.price);
  } else if (sortBy.value === "name") {
    list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }

  return list;
});
</script>

<template>
  <div class="space-y-10">
    <!-- Hero Section -->
    <HeroSection />

    <!-- Filter Bar & Products -->
    <div id="products-grid" class="scroll-mt-24 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">
            Our Collection
          </h2>
          <p class="text-xs text-slate-500">
            Carefully curated items for your lifestyle
          </p>
        </div>
      </div>

      <!-- Filter Bar Component -->
      <FilterBar
        :categories="categories"
        v-model:selectedCategory="selectedCategory"
        v-model:searchQuery="searchQuery"
        v-model:sortBy="sortBy"
        :totalResults="filteredProducts.length"
      />

      <!-- Loading State -->
      <!-- Skeleton Loading State -->
      <div
        v-if="loading"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <ProductSkeleton v-for="n in 8" :key="n" />
      </div>

      <!-- Error State -->
      <p v-else-if="error" class="text-sm text-rose-500 py-10 text-center">
        {{ error }}
      </p>

      <!-- Empty State -->
      <div
        v-else-if="filteredProducts.length === 0"
        class="text-center py-16 glass-panel rounded-2xl"
      >
        <p class="text-base font-bold text-slate-700">
          No products match your criteria
        </p>
        <p class="text-xs text-slate-400 mt-1">
          Try resetting the search or selecting another category.
        </p>
        <button
          @click="
            selectedCategory = 'All';
            searchQuery = '';
          "
          class="mt-4 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all"
        >
          Reset Filters
        </button>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product._id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>
