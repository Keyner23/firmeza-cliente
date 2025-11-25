<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
      <div class="text-center mb-8">
        <div class="text-5xl mb-3">🏪</div>
        <h1 class="text-3xl font-bold text-amber-600 mb-2">Iniciar Sesión</h1>
        <p class="text-gray-600">Bienvenido de nuevo a D'llary</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="tu@correo.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {{ loading ? 'Iniciando sesión...' : 'Entrar' }}
        </button>

        <div class="text-center text-sm text-gray-600">
          ¿No tienes cuenta? 
          <a href="#" class="text-amber-600 hover:text-amber-700 font-semibold">Regístrate</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';

  const result = await authStore.login(email.value, password.value);

  if (result.success) {
    router.push('/products');
  } else {
    errorMessage.value = result.message;
  }

  loading.value = false;
};
</script>