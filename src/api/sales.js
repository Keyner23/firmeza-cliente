// src/api/sales.js
import api from './axios';

export const salesApi = {
  create: async (saleData) => {
    const response = await api.post('/Sale', saleData);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/Sale/${id}`);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/Sale');
    return response.data;
  }
};