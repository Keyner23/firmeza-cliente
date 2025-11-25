
import axios from 'axios';

const AUTH_URL = import.meta.env.VITE_API_URL?.replace('/v1', '') || 'http://localhost:5000/api';

export const authApi = {
  login: async (email, password) => {
    const response = await axios.post(`${AUTH_URL}/auth/login`, {
      email,
      password
    });
    return response.data;
  }
};