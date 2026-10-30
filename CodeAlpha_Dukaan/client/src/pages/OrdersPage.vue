<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  ArrowLeft,
  ChevronRight,
} from "lucide-vue-next";
import { getMyOrders, cancelOrder } from "../services/orderService";
import { useAuth } from "../composables/useAuth";
import { useToast } from "../composables/useToast";

const router = useRouter();
const { isAuthenticated } = useAuth();
const { showToast } = useToast();

const orders = ref([]);
const loading = ref(true);
const cancellingId = ref(null);

const fetchOrders = async () => {
  try {
    loading.value = true;
    orders.value = await getMyOrders();
  } catch (err) {
    showToast(err.message || "Failed to load orders", "error");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (!isAuthenticated.value) {
    showToast("Please login to view your orders", "warning");
    router.push("/login");
    return;
  }
  fetchOrders();
});

const handleCancelOrder = async (orderId) => {
  if (!confirm("Are you sure you want to cancel this order?")) return;

  try {
    cancellingId.value = orderId;
    await cancelOrder(orderId);
    showToast("Order cancelled successfully", "success");
    await fetchOrders(); // Refresh order status
  } catch (err) {
    showToast(err.message || "Failed to cancel order", "error");
  } finally {
    cancellingId.value = null;
  }
};

const getStepNumber = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return 1;
    case "processing":
      return 2;
    case "shipped":
      return 3;
    case "delivered":
      return 4;
    default:
      return 1;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
</script>

<template>
  <div class="max-w-5xl mx-auto py-6 space-y-8">
    <!-- Top Bar -->
    <div class="flex items-center justify-between">
      <div>
        <h1
          class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
        >
          Order History
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          Track your deliveries and view past purchases
        </p>
      </div>

      <button
        @click="router.push('/')"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 glass-card transition-all"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Back to Store</span>
      </button>
    </div>

    <!-- Skeleton Loading State -->
    <div v-if="loading" class="space-y-6">
      <div
        v-for="n in 3"
        :key="n"
        class="glass-panel rounded-3xl p-6 space-y-4 animate-pulse"
      >
        <div
          class="flex justify-between items-center pb-4 border-b border-slate-100"
        >
          <div class="h-4 bg-slate-200/80 rounded w-32 animate-shimmer" />
          <div class="h-6 bg-slate-200/80 rounded-full w-24 animate-shimmer" />
        </div>
        <div class="h-12 bg-slate-200/40 rounded-2xl animate-shimmer" />
        <div class="h-20 bg-slate-200/60 rounded-2xl animate-shimmer" />
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="orders.length === 0"
      class="text-center py-20 glass-panel rounded-3xl space-y-4"
    >
      <div
        class="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto shadow-xs"
      >
        <Package class="w-8 h-8" />
      </div>
      <h3 class="text-lg font-bold text-slate-800">No Orders Yet</h3>
      <p class="text-xs text-slate-500 max-w-sm mx-auto">
        You haven't placed any orders so far. Explore our collection and find
        something you love.
      </p>
      <button
        @click="router.push('/')"
        class="px-6 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/25 transition-all"
      >
        Start Shopping
      </button>
    </div>

    <!-- Orders List -->
    <div v-else class="space-y-6">
      <div
        v-for="order in orders"
        :key="order._id"
        class="glass-panel rounded-3xl p-6 sm:p-7 space-y-6 shadow-sm border border-slate-200/60 hover:border-slate-300 transition-all"
      >
        <!-- Order Header -->
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100"
        >
          <div>
            <div class="flex items-center gap-3">
              <span class="text-sm font-extrabold text-slate-900">
                Order #{{ order._id.slice(-6).toUpperCase() }}
              </span>
              <span class="text-xs text-slate-400"
                >• {{ formatDate(order.createdAt) }}</span
              >
            </div>
            <p class="text-xs text-slate-500 mt-1">
              Total:
              <strong class="text-slate-800 font-extrabold"
                >${{ (order.totalAmount || 0).toFixed(2) }}</strong
              >
            </p>
          </div>

          <!-- Status Pill & Cancel CTA -->
          <div class="flex items-center gap-3">
            <span
              class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              :class="[
                order.status === 'delivered'
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : order.status === 'cancelled'
                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                    : order.status === 'shipped'
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'bg-indigo-100 text-indigo-700 border border-indigo-200',
              ]"
            >
              {{ order.status }}
            </span>

            <button
              v-if="order.status === 'pending'"
              @click="handleCancelOrder(order._id)"
              :disabled="cancellingId === order._id"
              class="px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-all disabled:opacity-50"
            >
              {{
                cancellingId === order._id ? "Cancelling..." : "Cancel Order"
              }}
            </button>
          </div>
        </div>

        <!-- Timeline Stepper (Only if not cancelled) -->
        <div v-if="order.status !== 'cancelled'" class="py-2">
          <div
            class="relative flex items-center justify-between max-w-2xl mx-auto"
          >
            <!-- Background connecting bar -->
            <div
              class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-10"
            />

            <!-- Active progress bar -->
            <div
              class="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-linear-to-r from-indigo-500 to-emerald-500 transition-all duration-500 -z-10"
              :style="{
                width: ((getStepNumber(order.status) - 1) / 3) * 100 + '%',
              }"
            />

            <!-- Step 1: Pending -->
            <div class="flex flex-col items-center gap-1.5 bg-white px-2">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all"
                :class="
                  getStepNumber(order.status) >= 1
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                    : 'border-slate-200 text-slate-400'
                "
              >
                <Clock class="w-3.5 h-3.5" />
              </div>
              <span class="text-[11px] font-bold text-slate-700">Pending</span>
            </div>

            <!-- Step 2: Processing -->
            <div class="flex flex-col items-center gap-1.5 bg-white px-2">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all"
                :class="
                  getStepNumber(order.status) >= 2
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                    : 'border-slate-200 text-slate-400'
                "
              >
                <Package class="w-3.5 h-3.5" />
              </div>
              <span class="text-[11px] font-bold text-slate-700"
                >Processing</span
              >
            </div>

            <!-- Step 3: Shipped -->
            <div class="flex flex-col items-center gap-1.5 bg-white px-2">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all"
                :class="
                  getStepNumber(order.status) >= 3
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                    : 'border-slate-200 text-slate-400'
                "
              >
                <Truck class="w-3.5 h-3.5" />
              </div>
              <span class="text-[11px] font-bold text-slate-700">Shipped</span>
            </div>

            <!-- Step 4: Delivered -->
            <div class="flex flex-col items-center gap-1.5 bg-white px-2">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all"
                :class="
                  getStepNumber(order.status) >= 4
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                    : 'border-slate-200 text-slate-400'
                "
              >
                <CheckCircle2 class="w-3.5 h-3.5" />
              </div>
              <span class="text-[11px] font-bold text-slate-700"
                >Delivered</span
              >
            </div>
          </div>
        </div>

        <!-- Cancelled Alert Banner -->
        <div
          v-else
          class="flex items-center gap-2 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold"
        >
          <XCircle class="w-4 h-4 shrink-0" />
          <span>This order has been cancelled.</span>
        </div>

        <!-- Order Items List -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div
            v-for="item in order.items"
            :key="item._id || item.product?._id || item.product"
            class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100"
          >
            <img
              v-if="item.image || item.product?.image"
              :src="item.image || item.product?.image"
              :alt="item.name || item.product?.name"
              class="w-12 h-12 rounded-xl object-cover bg-white border"
            />
            <div
              v-else
              class="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center"
            >
              <Package class="w-5 h-5 text-slate-400" />
            </div>

            <div class="flex-1 min-w-0">
              <p class="text-xs font-bold text-slate-800 truncate">
                {{ item.name || item.product?.name || "Product" }}
              </p>
              <p class="text-[11px] text-slate-400">
                Qty: {{ item.quantity }} × ${{
                  (item.price || item.product?.price || 0).toFixed(2)
                }}
              </p>
            </div>

            <span class="text-xs font-extrabold text-slate-800">
              ${{
                (
                  (item.price || item.product?.price || 0) * item.quantity
                ).toFixed(2)
              }}
            </span>
          </div>
        </div>

        <!-- Shipping Address Card -->
        <div
          v-if="order.shippingAddress"
          class="p-3.5 rounded-2xl bg-white/70 border border-slate-100 text-xs flex items-center gap-3"
        >
          <MapPin class="w-4 h-4 text-indigo-600 shrink-0" />
          <div class="text-slate-600 truncate">
            <strong>Delivery to:</strong> {{ order.shippingAddress.fullName }} |
            {{ order.shippingAddress.address }},
            {{ order.shippingAddress.city }} ({{ order.shippingAddress.phone }})
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
