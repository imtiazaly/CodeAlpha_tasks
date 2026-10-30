<template>
  <div
    class="glass-card rounded-3xl p-4 flex flex-col justify-between space-y-4 animate-pulse"
  >
    <!-- Image Skeleton with Shimmer -->
    <div
      class="w-full aspect-square rounded-2xl bg-slate-200/70 animate-shimmer"
    />

    <!-- Text Skeletons -->
    <div class="space-y-2 px-1">
      <div class="h-4 bg-slate-200/80 rounded-md w-3/4 animate-shimmer" />
      <div class="h-3 bg-slate-200/50 rounded-md w-full animate-shimmer" />
      <div class="h-3 bg-slate-200/40 rounded-md w-1/2 animate-shimmer" />
    </div>

    <!-- Bottom Price & Button Skeleton -->
    <div
      class="pt-4 border-t border-slate-100/80 flex items-center justify-between px-1"
    >
      <div class="space-y-1">
        <div class="h-2.5 bg-slate-200/50 rounded w-8 animate-shimmer" />
        <div class="h-5 bg-slate-200/80 rounded-md w-16 animate-shimmer" />
      </div>

      <div class="h-10 w-20 bg-slate-200/80 rounded-xl animate-shimmer" />
    </div>
  </div>
</template>
