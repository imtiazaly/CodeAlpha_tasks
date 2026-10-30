<script setup>
import Navbar from "../components/Navbar.vue";
import CartDrawer from "../components/CartDrawer.vue";
import { useToast } from "../composables/useToast";

const { toasts, removeToast } = useToast();
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50/50">
    <Navbar />
    <CartDrawer />

    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>

    <!-- Global Toast Container -->
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <TransitionGroup
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold backdrop-blur-md"
          :class="[
            toast.type === 'error'
              ? 'bg-rose-500/90 text-white border-rose-400'
              : toast.type === 'warning'
              ? 'bg-amber-500/90 text-white border-amber-400'
              : 'bg-slate-900/90 text-white border-slate-700'
          ]"
        >
          <span>{{ toast.message }}</span>
          <button @click="removeToast(toast.id)" class="text-white/70 hover:text-white text-sm ml-2">&times;</button>
        </div>
      </TransitionGroup>
    </div>

    <footer class="mt-auto border-t border-slate-200/60 py-6 text-center text-xs text-slate-400">
      <p>&copy; {{ new Date().getFullYear() }} Dukaan. Crafted with premium glassmorphism.</p>
    </footer>
  </div>
</template>