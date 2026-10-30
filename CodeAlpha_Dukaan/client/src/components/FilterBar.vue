<script setup>
import { computed } from "vue";
import { Search, ArrowUpDown, SlidersHorizontal } from "lucide-vue-next";

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  selectedCategory: {
    type: String,
    default: "All",
  },
  searchQuery: {
    type: String,
    default: "",
  },
  sortBy: {
    type: String,
    default: "default",
  },
  totalResults: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits([
  "update:selectedCategory",
  "update:searchQuery",
  "update:sortBy",
]);
</script>

<template>
  <div class="glass-panel rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
    <!-- Top Row: Search & Sort Dropdown -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <!-- Search Input -->
      <div class="relative w-full sm:w-80">
        <input
          :value="searchQuery"
          @input="emit('update:searchQuery', $event.target.value)"
          type="text"
          placeholder="Filter by name or keyword..."
          class="w-full pl-9 pr-4 py-2.5 text-xs bg-white text-slate-800 rounded-xl border border-slate-200/80 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
        />
        <Search
          class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        />
      </div>

      <!-- Right Controls: Sort & Total Counter -->
      <div
        class="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4"
      >
        <span class="text-xs text-slate-500 font-medium">
          <strong class="text-slate-800 font-bold">{{ totalResults }}</strong>
          items found
        </span>

        <!-- Sort Select -->
        <div class="relative">
          <select
            :value="sortBy"
            @change="emit('update:sortBy', $event.target.value)"
            class="appearance-none pl-8 pr-8 py-2 text-xs font-semibold bg-white text-slate-700 rounded-xl border border-slate-200/80 hover:border-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 outline-none cursor-pointer transition-all"
          >
            <option value="default">Sort: Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
          <ArrowUpDown
            class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>
      </div>
    </div>

    <!-- Category Pills Row -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
      <button
        v-for="cat in categories"
        :key="cat"
        @click="emit('update:selectedCategory', cat)"
        :class="[
          'px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0',
          selectedCategory === cat
            ? 'bg-linear-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/25'
            : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/70 hover:border-slate-300',
        ]"
      >
        {{ cat }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
