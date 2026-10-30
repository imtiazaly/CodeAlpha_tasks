import { apiRequest } from "./api";

export async function getProducts(params = { limit: 300 }) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/products?${query}` : "/products";
  const data = await apiRequest(url);
  return Array.isArray(data) ? data : data?.products || [];
}

export function getProductById(id) {
  return apiRequest(`/products/${id}`);
}
