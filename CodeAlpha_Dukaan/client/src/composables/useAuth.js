import { ref, computed } from "vue";
import { apiRequest } from "../services/api";

const user = ref(JSON.parse(localStorage.getItem("dukaan_user") || "null"));
const token = ref(localStorage.getItem("dukaan_token") || null);

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === "admin");

  const setAuth = (userData, tokenValue) => {
    user.value = userData;
    token.value = tokenValue;
    localStorage.setItem("dukaan_user", JSON.stringify(userData));
    localStorage.setItem("dukaan_token", tokenValue);
  };

  const login = async (email, password) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setAuth(data.user, data.token);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    setAuth(data.user, data.token);
    return data;
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("dukaan_user");
    localStorage.removeItem("dukaan_token");
  };

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
  };
}