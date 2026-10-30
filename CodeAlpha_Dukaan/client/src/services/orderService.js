import { apiRequest } from "./api";

export function createOrder(shippingAddress) {
  return apiRequest("/orders", {
    method: "POST",
    body: JSON.stringify({ shippingAddress }),
  });
}

export async function getMyOrders() {
  const data = await apiRequest("/orders/my-orders");
  return data?.orders || data || [];
}

export function getOrderById(orderId) {
  return apiRequest(`/orders/${orderId}`);
}

export function cancelOrder(orderId) {
  return apiRequest(`/orders/${orderId}/cancel`, {
    method: "PATCH",
  });
}
