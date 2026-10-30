import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import ProductDetailPage from "../pages/ProductDetailPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import MainLayout from "../layouts/MainLayout.vue";
import CheckoutPage from "../pages/CheckoutPage.vue";
import OrdersPage from "../pages/OrdersPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "",
          name: "home",
          component: HomePage,
          meta: { title: "Dukaan — Premium E-Commerce Store" },
        },
        {
          path: "product/:id",
          name: "product-detail",
          component: ProductDetailPage,
          meta: { title: "Product Details — Dukaan" },
        },
        {
          path: "login",
          name: "login",
          component: LoginPage,
          meta: { title: "Sign In — Dukaan" },
        },
        {
          path: "register",
          name: "register",
          component: RegisterPage,
          meta: { title: "Create Account — Dukaan" },
        },
        {
          path: "checkout",
          name: "checkout",
          component: CheckoutPage,
          meta: { title: "Checkout — Dukaan" },
        },
        {
          path: "orders",
          name: "orders",
          component: OrdersPage,
          meta: { title: "My Orders — Dukaan" },
        },
      ],
    },
  ],
});

router.afterEach((to) => {
  document.title = to.meta.title || "Dukaan — Modern E-Commerce Store";
});

export default router;
