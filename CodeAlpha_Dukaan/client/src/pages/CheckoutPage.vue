<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  CheckCircle2,
  MapPin,
  CreditCard,
  ShoppingBag,
  ArrowLeft,
  Truck,
  ShieldCheck,
} from "lucide-vue-next";
import { useCart } from "../composables/useCart";
import { useAuth } from "../composables/useAuth";
import { useToast } from "../composables/useToast";
import { createOrder } from "../services/orderService";

const router = useRouter();
const { cart, cartTotalAmount, cartItemsCount, fetchCart } = useCart();
const { isAuthenticated, user } = useAuth();
const { showToast } = useToast();

const currentStep = ref(1); // 1 = Shipping, 2 = Payment & Review
const loading = ref(false);
const error = ref("");

const form = ref({
  fullName: user.value?.name || "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
});

const paymentMethod = ref("cod"); // 'cod' = Cash on Delivery

onMounted(() => {
  if (!isAuthenticated.value) {
    showToast("Please login to proceed with checkout", "warning");
    router.push("/login");
    return;
  }
  fetchCart();
});

const handleContinueToPayment = () => {
  if (
    !form.value.fullName ||
    !form.value.phone ||
    !form.value.address ||
    !form.value.city ||
    !form.value.postalCode
  ) {
    error.value = "Please complete all shipping address fields.";
    return;
  }
  error.value = "";
  currentStep.value = 2;
};

const handlePlaceOrder = async () => {
  try {
    loading.value = true;
    error.value = "";

    await createOrder({
      fullName: form.value.fullName,
      phone: form.value.phone,
      address: form.value.address,
      city: form.value.city,
      postalCode: form.value.postalCode,
    });

    await fetchCart(); // Clear local cart state
    showToast("🎉 Order placed successfully!", "success");
    router.push("/orders");
  } catch (err) {
    error.value = err.message || "Failed to place order. Please try again.";
    showToast(error.value, "error");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-5xl mx-auto py-6 space-y-8">
    <!-- Back to Cart / Home -->
    <button
      @click="router.push('/')"
      class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 glass-card transition-all"
    >
      <ArrowLeft class="w-4 h-4" />
      <span>Continue Shopping</span>
    </button>

    <!-- Stepper Tracker -->
    <div class="max-w-md mx-auto flex items-center justify-between relative">
      <div
        class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-200 -z-10"
      />
      <div
        class="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-indigo-600 transition-all duration-300 -z-10"
        :style="{ width: currentStep === 2 ? '100%' : '50%' }"
      />

      <!-- Step 1 Indicator -->
      <button
        @click="currentStep = 1"
        class="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all"
        :class="
          currentStep >= 1
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
            : 'bg-white text-slate-400 border'
        "
      >
        <span>1. Shipping</span>
      </button>

      <!-- Step 2 Indicator -->
      <button
        @click="
          form.fullName && form.phone && form.address && (currentStep = 2)
        "
        class="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all"
        :class="
          currentStep === 2
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
            : 'bg-white text-slate-400 border'
        "
      >
        <span>2. Review & Pay</span>
      </button>
    </div>

    <!-- Error Banner -->
    <div
      v-if="error"
      class="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600 text-center"
    >
      {{ error }}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left 2 Cols: Form Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Step 1: Shipping Form -->
        <div
          v-if="currentStep === 1"
          class="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm"
        >
          <div class="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <div
              class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"
            >
              <MapPin class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">
                Shipping Details
              </h3>
              <p class="text-xs text-slate-500">
                Where should we deliver your order?
              </p>
            </div>
          </div>

          <form @submit.prevent="handleContinueToPayment" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Full Name -->
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-700"
                  >Full Name</label
                >
                <input
                  v-model="form.fullName"
                  type="text"
                  required
                  placeholder="John Doe"
                  class="w-full px-4 py-2.5 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <!-- Phone -->
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-700"
                  >Phone Number</label
                >
                <input
                  v-model="form.phone"
                  type="tel"
                  required
                  placeholder="+92 300 1234567"
                  class="w-full px-4 py-2.5 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            <!-- Address -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-700"
                >Street Address</label
              >
              <input
                v-model="form.address"
                type="text"
                required
                placeholder="House / Apartment #, Street name, Area"
                class="w-full px-4 py-2.5 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- City -->
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-700">City</label>
                <input
                  v-model="form.city"
                  type="text"
                  required
                  placeholder="e.g. Lahore / Karachi"
                  class="w-full px-4 py-2.5 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <!-- Postal Code -->
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-700"
                  >Postal Code</label
                >
                <input
                  v-model="form.postalCode"
                  type="text"
                  required
                  placeholder="54000"
                  class="w-full px-4 py-2.5 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            <button
              type="submit"
              class="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-500/20 transition-all mt-4"
            >
              Continue to Payment & Review
            </button>
          </form>
        </div>

        <!-- Step 2: Payment & Review -->
        <div
          v-else
          class="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm"
        >
          <div
            class="flex items-center justify-between border-b border-slate-100 pb-4"
          >
            <div class="flex items-center gap-2.5">
              <div
                class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"
              >
                <CreditCard class="w-4 h-4" />
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900">
                  Payment Method
                </h3>
                <p class="text-xs text-slate-500">
                  Select how you'd like to pay
                </p>
              </div>
            </div>
            <button
              @click="currentStep = 1"
              class="text-xs font-bold text-indigo-600 hover:underline"
            >
              Edit Address
            </button>
          </div>

          <!-- Payment Options -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label
              class="flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all"
              :class="
                paymentMethod === 'cod'
                  ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white'
              "
            >
              <input
                type="radio"
                v-model="paymentMethod"
                value="cod"
                class="mt-1"
              />
              <div>
                <h4 class="text-xs font-bold text-slate-900">
                  Cash on Delivery
                </h4>
                <p class="text-[11px] text-slate-500 mt-0.5">
                  Pay in cash when order arrives at your door.
                </p>
              </div>
            </label>

            <label
              class="flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all"
              :class="
                paymentMethod === 'card'
                  ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white'
              "
            >
              <input
                type="radio"
                v-model="paymentMethod"
                value="card"
                class="mt-1"
              />
              <div>
                <h4 class="text-xs font-bold text-slate-900">
                  Credit / Debit Card
                </h4>
                <p class="text-[11px] text-slate-500 mt-0.5">
                  Instant online payment (Sandbox enabled).
                </p>
              </div>
            </label>
          </div>

          <!-- Shipping Summary Recount -->
          <div
            class="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1"
          >
            <p class="font-bold text-slate-800">
              Delivering to: {{ form.fullName }} ({{ form.phone }})
            </p>
            <p class="text-slate-500">
              {{ form.address }}, {{ form.city }} - {{ form.postalCode }}
            </p>
          </div>

          <!-- Final Place Order Button -->
          <button
            @click="handlePlaceOrder"
            :disabled="loading || cartItemsCount === 0"
            class="w-full py-4 bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
          >
            <div
              v-if="loading"
              class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
            />
            <span v-else
              >Confirm & Place Order (${{ cartTotalAmount.toFixed(2) }})</span
            >
          </button>
        </div>
      </div>

      <!-- Right 1 Col: Order Summary Panel -->
      <div class="space-y-6">
        <div
          class="glass-panel rounded-3xl p-6 space-y-5 shadow-sm sticky top-24"
        >
          <div class="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShoppingBag class="w-4 h-4 text-indigo-600" />
            <h4 class="text-sm font-bold text-slate-900">
              Order Summary ({{ cartItemsCount }})
            </h4>
          </div>

          <!-- Items list -->
          <div class="space-y-3 max-h-60 overflow-y-auto pr-1">
            <div
              v-for="item in cart?.items"
              :key="item.product?._id"
              class="flex items-center gap-3 text-xs"
            >
              <img
                :src="item.product?.image"
                :alt="item.product?.name"
                class="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border"
              />
              <div class="flex-1 min-w-0">
                <p class="font-bold text-slate-800 truncate">
                  {{ item.product?.name }}
                </p>
                <p class="text-slate-400">
                  Qty: {{ item.quantity }} × ${{
                    (item.product?.price || 0).toFixed(2)
                  }}
                </p>
              </div>
              <span class="font-bold text-slate-800">
                ${{ ((item.product?.price || 0) * item.quantity).toFixed(2) }}
              </span>
            </div>
          </div>

          <!-- Calculations -->
          <div class="border-t border-slate-100 pt-3 space-y-2 text-xs">
            <div class="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span class="font-semibold text-slate-800"
                >${{ cartTotalAmount.toFixed(2) }}</span
              >
            </div>
            <div class="flex justify-between text-slate-500">
              <span>Shipping</span>
              <span class="text-emerald-600 font-semibold">Free Express</span>
            </div>
            <div
              class="border-t border-slate-100 pt-2 flex justify-between text-sm font-extrabold text-slate-900"
            >
              <span>Total Amount</span>
              <span class="text-indigo-600"
                >${{ cartTotalAmount.toFixed(2) }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
