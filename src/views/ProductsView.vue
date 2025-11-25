<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🏪</span>
          <h1 class="text-2xl font-bold text-white">D'llary</h1>
        </div>
        
        <div class="flex items-center gap-4">
          <router-link
            to="/cart"
            class="relative bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-yellow-600 transition font-semibold shadow-md"
          >
            🛒 Carrito
            <span
              v-if="cartStore.itemCount > 0"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold"
            >
              {{ cartStore.itemCount }}
            </span>
          </router-link>

          <button
            v-if="authStore.isAuthenticated"
            @click="router.push('/orders')"
            class="text-white hover:text-orange-400 transition font-medium"
          >
            📦 Mis Órdenes
          </button>

          <button
            v-if="authStore.isAuthenticated"
            @click="handleLogout"
            class="text-white hover:text-red-400 transition font-medium"
          >
            🚫 Salir
          </button>
          
          <button
            v-else
            @click="router.push('/login')"
            class="border-2 border-orange-500 text-orange-500 px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white transition font-semibold"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </header>

    <!-- Products Grid -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-6">Nuestros Productos</h2>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Cargando productos...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {{ error }}
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div class="h-48 bg-gradient-to-br from-orange-100 via-yellow-100 to-orange-200 flex items-center justify-center">
            <span class="text-6xl">🔧</span>
          </div>

          <div class="p-4">
            <h3 class="font-semibold text-lg text-gray-800 mb-2">{{ product.name }}</h3>
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ product.description }}</p>

            <div class="flex items-center justify-between mb-3">
              <span class="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                ${{ product.price.toLocaleString() }}
              </span>
              <span class="text-sm px-2 py-1 rounded" :class="product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                Stock: {{ product.stock }}
              </span>
            </div>

            <button
              @click="addToCart(product)"
              :disabled="product.stock === 0"
              class="w-full py-2 rounded-lg font-semibold transition shadow-md"
              :class="product.stock === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600'"
            >
              {{ product.stock === 0 ? 'Sin Stock' : '🛒 Agregar al Carrito' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { productsApi } from '@/api/products';

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();

const products = ref([]);
const loading = ref(true);
const error = ref('');

const loadProducts = async () => {
  try {
    loading.value = true;
    products.value = await productsApi.getAll();
  } catch (err) {
    error.value = 'Error al cargar productos';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const addToCart = (product) => {
  cartStore.addItem(product);
  showNotification(`✓ ${product.name} agregado al carrito`);
};

const showNotification = (message) => {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in';
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

onMounted(() => {
  loadProducts();
});
</script>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>