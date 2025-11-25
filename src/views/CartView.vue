<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <button @click="router.back()" class="text-white hover:text-orange-400 transition flex items-center gap-2 font-medium">
          ← Volver
        </button>
        <h1 class="text-2xl font-bold text-white">🛒 Carrito de Compras</h1>
        <div class="w-24"></div>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-4 py-8">
      <!-- Empty Cart -->
      <div v-if="cartStore.items.length === 0" class="text-center py-12">
        <div class="text-8xl mb-4">🛒</div>
        <h2 class="text-2xl font-semibold text-gray-800 mb-2">Tu carrito está vacío</h2>
        <p class="text-gray-600 mb-6">Agrega productos para comenzar tu compra</p>
        <button
          @click="router.push('/products')"
          class="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-yellow-600 font-semibold shadow-lg"
        >
          Ver Productos
        </button>
      </div>

      <!-- Cart Items -->
      <div v-else class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="bg-white rounded-lg shadow-md p-6 flex gap-4 hover:shadow-lg transition"
          >
            <div class="w-24 h-24 bg-gradient-to-br from-orange-100 via-yellow-100 to-orange-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <span class="text-4xl">🔧</span>
            </div>

            <div class="flex-1">
              <h3 class="font-semibold text-lg text-gray-800">{{ item.name }}</h3>
              <p class="text-orange-600 font-semibold">${{ item.price.toLocaleString() }}</p>

              <div class="flex items-center gap-3 mt-3">
                <button
                  @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                  class="w-8 h-8 bg-orange-500 text-white rounded hover:bg-orange-600 font-bold"
                >
                  -
                </button>
                <span class="w-12 text-center font-semibold text-lg">{{ item.quantity }}</span>
                <button
                  @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                  :disabled="item.quantity >= item.stock"
                  class="w-8 h-8 bg-orange-500 text-white rounded hover:bg-orange-600 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>

                <button
                  @click="cartStore.removeItem(item.id)"
                  class="ml-auto text-red-600 hover:text-red-800 font-medium px-3 py-1 border border-red-600 rounded hover:bg-red-50 transition"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>

            <div class="text-right">
              <p class="text-xl font-bold text-gray-800">
                ${{ (item.price * item.quantity).toLocaleString() }}
              </p>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Resumen de Compra</h2>

            <div class="space-y-3 border-b border-gray-200 pb-4 mb-4">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${{ cartStore.subtotal.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>IVA (19%)</span>
                <span>${{ cartStore.iva.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
              </div>
            </div>

            <div class="flex justify-between text-xl font-bold text-gray-800 mb-6">
              <span>Total</span>
              <span class="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                ${{ cartStore.total.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}
              </span>
            </div>

            <!-- Customer Info Form -->
            <div v-if="!authStore.isAuthenticated" class="space-y-3 mb-4">
              <p class="text-sm text-gray-600 mb-2">Completa tus datos:</p>
              <input
                v-model="customerName"
                type="text"
                placeholder="Nombre completo"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
              <input
                v-model="customerEmail"
                type="email"
                placeholder="Email"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
              <input
                v-model="customerDocument"
                type="number"
                placeholder="Documento"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <button
              @click="handleCheckout"
              :disabled="loading"
              class="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition disabled:opacity-50 shadow-lg"
            >
              {{ loading ? '⏳ Procesando...' : '✓ Finalizar Compra' }}
            </button>

            <div v-if="errorMessage" class="mt-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
              {{ errorMessage }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { salesApi } from '@/api/sales';

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();

const loading = ref(false);
const errorMessage = ref('');

// Guest customer info
const customerName = ref('');
const customerEmail = ref('');
const customerDocument = ref('');

const handleCheckout = async () => {
  // Validar datos si es invitado
  if (!authStore.isAuthenticated) {
    if (!customerName.value || !customerEmail.value || !customerDocument.value) {
      errorMessage.value = 'Por favor completa todos los campos';
      return;
    }
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const saleData = {
      customer: authStore.isAuthenticated 
        ? {
            id: authStore.user.id,
            name: authStore.user.name,
            email: authStore.user.email,
            document: 0
          }
        : {
            name: customerName.value,
            email: customerEmail.value,
            document: parseInt(customerDocument.value)
          },
      details: cartStore.items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price
      }))
    };

    await salesApi.create(saleData);
    
    alert('🎉 ¡Compra realizada con éxito!');
    cartStore.clearCart();
    router.push('/products');
  } catch (error) {
    console.error('Error al crear venta:', error);
    errorMessage.value = error.response?.data?.message || 'Error al procesar la compra';
  } finally {
    loading.value = false;
  }
};
</script>