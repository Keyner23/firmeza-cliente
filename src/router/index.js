
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/views/ProductsView.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/CartView.vue')
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/views/OrdersView.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guardian
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  //si no esta logedo
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  }
  // Si está autenticado e intenta ir al login
  else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/products');
  }
  else {
    next();
  }
});

export default router;