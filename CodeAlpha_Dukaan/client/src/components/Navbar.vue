<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  LogOut,
  Package,
  Menu,
  X,
  Sparkles,
} from "lucide-vue-next";
import { useAuth } from "../composables/useAuth";
import { useCart } from "../composables/useCart";

const router = useRouter();
const { user, isAuthenticated, logout } = useAuth();
const { cartItemsCount, openDrawer } = useCart();

const isMobileMenuOpen = ref(false);
const isUserDropdownOpen = ref(false);
const searchQuery = ref("");

const handleLogout = () => {
  logout();
  isUserDropdownOpen.value = false;
  router.push("/");
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Search query emit ya route query param set kar sakte hain
    router.push({ path: "/", query: { search: searchQuery.value.trim() } });
  }
};
</script>

<template>
  <header class="sticky top-4 z-40 w-full px-4 sm:px-6 lg:px-8">
    <nav
      class="max-w-7xl mx-auto glass-panel rounded-2xl px-4 py-3 sm:px-6 flex items-center justify-between transition-all duration-300"
    >
      <!-- Brand Logo -->
      <RouterLink to="/" class="flex items-center gap-2 group">
        <div
          class="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform"
        >
          <Sparkles class="w-5 h-5 animate-pulse" />
        </div>
        <span
          class="text-xl font-extrabold bg-linear-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent"
        >
          Dukaan<span class="text-indigo-600">.</span>
        </span>
      </RouterLink>

      <!-- Search Bar (Desktop) -->
      <div class="hidden md:flex items-center flex-1 max-w-md mx-8">
        <form @submit.prevent="handleSearch" class="relative w-full">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search premium products..."
            class="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/70 hover:bg-slate-100 focus:bg-white text-slate-800 rounded-xl border border-transparent focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
          />
          <Search
            class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </form>
      </div>

      <!-- Right Navigation Actions -->
      <div class="flex items-center gap-3">
        <!-- Cart Button with Dynamic Badge -->
        <button
          @click="openDrawer"
          class="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-indigo-600 transition-colors duration-200"
          aria-label="Open Cart"
        >
          <ShoppingBag class="w-5 h-5" />
          <span
            v-if="cartItemsCount > 0"
            class="absolute -top-1 -right-1 bg-linear-to-r from-pink-500 to-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-bounce"
          >
            {{ cartItemsCount }}
          </span>
        </button>

        <!-- Auth State (Logged In) -->
        <div v-if="isAuthenticated" class="relative">
          <button
            @click="isUserDropdownOpen = !isUserDropdownOpen"
            class="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div
              class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200"
            >
              {{ user?.name ? user.name.charAt(0).toUpperCase() : "U" }}
            </div>
            <span
              class="hidden sm:inline text-sm font-semibold text-slate-700 max-w-25 truncate"
            >
              {{ user?.name }}
            </span>
          </button>

          <!-- Glass Dropdown -->
          <div
            v-if="isUserDropdownOpen"
            class="absolute right-0 mt-2 w-48 glass-dropdown rounded-xl py-2 z-50 shadow-xl"
          >
            <div
              class="px-4 py-2 border-b border-slate-100 text-xs text-slate-500 truncate"
            >
              Signed in as <br />
              <strong class="text-slate-800 font-semibold">{{
                user?.email
              }}</strong>
            </div>

            <RouterLink
              to="/orders"
              @click="isUserDropdownOpen = false"
              class="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <Package class="w-4 h-4" /> My Orders
            </RouterLink>

            <button
              @click="handleLogout"
              class="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut class="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        <!-- Auth State (Logged Out) -->
        <div v-else class="hidden sm:flex items-center gap-2">
          <RouterLink
            to="/login"
            class="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
          >
            Sign In
          </RouterLink>
          <RouterLink
            to="/register"
            class="px-4 py-2 text-xs font-semibold text-white bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-xl shadow-sm hover:shadow transition-all"
          >
            Get Started
          </RouterLink>
        </div>

        <!-- Mobile Menu Toggle -->
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
        >
          <X v-if="isMobileMenuOpen" class="w-5 h-5" />
          <Menu v-else class="w-5 h-5" />
        </button>
      </div>
    </nav>

    <!-- Mobile Expandable Search/Auth -->
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden mt-2 glass-panel rounded-2xl p-4 flex flex-col gap-3 shadow-lg"
    >
      <form @submit.prevent="handleSearch" class="relative w-full">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 rounded-xl outline-none"
        />
        <Search
          class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
        />
      </form>

      <div
        v-if="!isAuthenticated"
        class="flex flex-col gap-2 pt-2 border-t border-slate-100"
      >
        <RouterLink
          to="/login"
          @click="isMobileMenuOpen = false"
          class="w-full text-center py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
        >
          Sign In
        </RouterLink>
        <RouterLink
          to="/register"
          @click="isMobileMenuOpen = false"
          class="w-full text-center py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg"
        >
          Get Started
        </RouterLink>
      </div>
    </div>
  </header>
</template>
