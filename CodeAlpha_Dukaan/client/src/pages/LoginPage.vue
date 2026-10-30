<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-vue-next";
import { useAuth } from "../composables/useAuth";
import { useToast } from "../composables/useToast";

const router = useRouter();
const { login } = useAuth();
const { showToast } = useToast();

const email = ref("demo@user.com");
const password = ref("12345678");
const showPassword = ref(false);
const loading = ref(false);
const error = ref("");

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = "Please fill in all fields.";
    return;
  }

  try {
    loading.value = true;
    error.value = "";
    await login(email.value, password.value);
    showToast("Welcome back! Logged in successfully.", "success");
    router.push("/");
  } catch (err) {
    error.value = err.message || "Invalid credentials. Please try again.";
    showToast(error.value, "error");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-[75vh] flex items-center justify-center py-10 px-4 relative"
  >
    <!-- Ambient Background Glow -->
    <div
      class="absolute w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10"
    />

    <div
      class="w-full max-w-md glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6"
    >
      <!-- Header -->
      <div class="text-center space-y-2">
        <div
          class="w-12 h-12 rounded-2xl bg-linear-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white mx-auto shadow-md shadow-indigo-500/25 mb-3"
        >
          <Sparkles class="w-6 h-6 animate-pulse" />
        </div>
        <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">
          Welcome Back
        </h2>
        <p class="text-xs text-slate-500">
          Sign in to access your orders and saved items
        </p>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600"
      >
        {{ error }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email Input -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-700">Email Address</label>
          <div class="relative">
            <input
              v-model="email"
              type="email"
              required
              placeholder="you@example.com"
              class="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50/80 focus:bg-white text-slate-800 rounded-xl border border-slate-200/80 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            />
            <Mail
              class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>
        </div>

        <!-- Password Input -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-700">Password</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="••••••••"
              class="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50/80 focus:bg-white text-slate-800 rounded-xl border border-slate-200/80 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            />
            <Lock
              class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 p-1"
            >
              <EyeOff v-if="showPassword" class="w-4 h-4" />
              <Eye v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Demo Account Quick Tip Pill -->
        <div
          class="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-[11px] text-indigo-700 font-medium"
        >
          <span>⚡ <strong>Demo Account:</strong> One-click login enabled</span>
          <span class="text-xs">👇</span>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3.5 px-4 bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all mt-2 active:scale-[0.99] disabled:opacity-70"
        >
          <div
            v-if="loading"
            class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
          />
          <span v-else class="flex items-center gap-2">
            Sign In
            <ArrowRight class="w-4 h-4" />
          </span>
        </button>
      </form>

      <!-- Switch to Register -->
      <div
        class="pt-2 text-center text-xs text-slate-500 border-t border-slate-100"
      >
        Don't have an account?
        <RouterLink
          to="/register"
          class="font-bold text-indigo-600 hover:text-indigo-700 ml-1"
        >
          Create Account
        </RouterLink>
      </div>
    </div>
  </div>
</template>
