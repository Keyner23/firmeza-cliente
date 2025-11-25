
import api from './axios';

export const productsApi = {
  getAll: async () => {
    const response = await api.get('/Product');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/Product/${id}`);
    return response.data;
  }
};