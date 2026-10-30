<script setup>
import {
  Sparkles,
  ArrowDown,
  Truck,
  ShieldCheck,
  Clock,
  Zap,
} from "lucide-vue-next";

const scrollToProducts = () => {
  const el = document.getElementById("products-grid");
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};
</script>

<template>
  <div class="relative py-12 md:py-20 overflow-hidden">
    <!-- Ambient Background Glows -->
    <div
      class="absolute -top-10 left-1/2 -translate-x-1/2 w-150 h-75 bg-linear-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10 pointer-events-none rounded-full"
    />

    <div class="text-center max-w-4xl mx-auto space-y-6">
      <!-- Top Micro-Pill -->
      <div
        class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-100 text-indigo-700 text-xs font-semibold shadow-xs"
      >
        <Sparkles class="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
        <span>Elevated Everyday Essentials</span>
        <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
        <span class="text-indigo-500 font-normal">New Season 2026</span>
      </div>

      <!-- Main Headline -->
      <h1
        class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]"
      >
        Thoughtfully Designed. <br />
        <span
          class="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          Crafted to Perfection.
        </span>
      </h1>

      <!-- Subtitle -->
      <p
        class="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed"
      >
        Experience seamless online shopping with curated collections, real-time
        stock updates, and lightning-fast checkout.
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
        <button
          @click="scrollToProducts"
          class="px-7 py-3.5 bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
        >
          <span>Explore Collection</span>
          <ArrowDown
            class="w-4 h-4 group-hover:translate-y-1 transition-transform"
          />
        </button>

        <a
          href="#features"
          class="px-6 py-3.5 bg-white/80 hover:bg-white text-slate-700 font-bold text-sm rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow transition-all flex items-center gap-2"
        >
          <Zap class="w-4 h-4 text-amber-500" />
          <span>Special Offers</span>
        </a>
      </div>

      <!-- Trust Badges Bento Strip -->
      <div
        class="grid grid-cols-2 md:grid-cols-3 gap-3 pt-10 max-w-2xl mx-auto text-left"
      >
        <div class="glass-card rounded-xl p-3.5 flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"
          >
            <Truck class="w-4 h-4" />
          </div>
          <div>
            <h4 class="text-xs font-bold text-slate-800">Express Delivery</h4>
            <p class="text-[11px] text-slate-500">Fast doorstep shipping</p>
          </div>
        </div>

        <div class="glass-card rounded-xl p-3.5 flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"
          >
            <ShieldCheck class="w-4 h-4" />
          </div>
          <div>
            <h4 class="text-xs font-bold text-slate-800">100% Genuine</h4>
            <p class="text-[11px] text-slate-500">Verified products only</p>
          </div>
        </div>

        <div
          class="glass-card col-span-2 md:col-span-1 rounded-xl p-3.5 flex items-center gap-3"
        >
          <div
            class="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"
          >
            <Clock class="w-4 h-4" />
          </div>
          <div>
            <h4 class="text-xs font-bold text-slate-800">Instant Support</h4>
            <p class="text-[11px] text-slate-500">24/7 dedicated help</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
