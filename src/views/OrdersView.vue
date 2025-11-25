<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-gray-900 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <button @click="router.back()" class="text-white hover:text-amber-400 transition flex items-center gap-2 font-medium">
          ← Volver
        </button>
        <h1 class="text-2xl font-bold text-amber-500">📦 Mis Órdenes</h1>
        <div class="w-24"></div>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-4 py-8">
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Cargando órdenes...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {{ error }}
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-12">
        <div class="text-8xl mb-4">📦</div>
        <h2 class="text-2xl font-semibold text-gray-800 mb-2">No tienes órdenes</h2>
        <p class="text-gray-600 mb-6">Comienza a comprar productos</p>
        <button
          @click="router.push('/products')"
          class="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 font-semibold shadow-lg"
        >
          Ver Productos
        </button>
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
        >
          <!-- Order Header -->
          <div class="bg-amber-500 text-white p-4">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm opacity-90 font-medium">ID</p>
                <p class="font-semibold text-lg">#{{ order.id.substring(0, 8).toUpperCase() }}</p>
              </div>
              <div class="text-center">
                <p class="text-sm opacity-90">Fecha</p>
                <p class="font-semibold">{{ formatDate(order.saleDate) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm opacity-90">Total</p>
                <p class="text-3xl font-bold">${{ order.total.toLocaleString() }}</p>
              </div>
            </div>
          </div>

          <!-- Order Details -->
          <div class="p-6">
            <div class="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
              <span class="text-gray-700 font-semibold">👤 Cliente:</span>
              <span class="text-gray-700">
                {{ order.customer?.name }} - {{ order.customer?.document }}
              </span>
            </div>

            <h3 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span>📋</span> Productos
            </h3>
            <div class="space-y-2">
              <div
                v-for="detail in order.details"
                :key="detail.productId"
                class="flex justify-between items-center py-3 border-b border-gray-100 hover:bg-amber-50 px-2 rounded transition"
              >
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-amber-100 to-yellow-100 rounded flex items-center justify-center">
                    <span class="text-xl">🔧</span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">{{ detail.productName }}</p>
                    <p class="text-sm text-gray-600">
                      {{ detail.quantity }} × ${{ detail.unitPrice.toLocaleString() }}
                    </p>
                  </div>
                </div>
                <p class="font-semibold text-amber-600 text-lg">
                  ${{ detail.subtotal.toLocaleString() }}
                </p>
              </div>
            </div>

            <!-- Summary -->
            <div class="mt-6 pt-4 border-t-2 border-amber-200 space-y-2">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${{ order.subtotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>IVA (19%)</span>
                <span>${{ order.iva.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span class="text-amber-600">
                  ${{ order.total.toLocaleString() }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { salesApi } from '@/api/sales';

const router = useRouter();

const orders = ref([]);
const loading = ref(true);
const error = ref('');

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const loadOrders = async () => {
  try {
    loading.value = true;
    orders.value = await salesApi.getAll();
  } catch (err) {
    error.value = 'Error al cargar órdenes';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadOrders();
});
</script>