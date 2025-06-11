import axios from 'axios';
import { Equipment, EquipmentType } from '../types/inventory';
import { useAuthStore } from '../store/auth-store';

const api = axios.create({
  baseURL: 'https://controle-de-estoque-backend.vercel.app',
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export const inventoryApi = {
  // Get all equipment with optional filters
  getItems: async (
    search?: string,
    types?: EquipmentType[],
    department?: string,
    isOperational?: boolean
  ): Promise<Equipment[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (types?.length) params.append('types', types.join(','));
    if (department) params.append('department', department);
    if (isOperational !== undefined) params.append('isOperational', isOperational.toString());
    
    const response = await api.get(`/equipment?${params.toString()}`);
    return response.data;
  },
  
  // Get equipment by ID
  getItemById: async (id: string): Promise<Equipment> => {
    const response = await api.get(`/equipment/${id}`);
    return response.data;
  },
  
  // Create new equipment
  createItem: async (equipment: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt' | 'lastUpdate'>): Promise<Equipment> => {
    const response = await api.post('/equipment', equipment);
    return response.data;
  },
  
  // Update existing equipment
  updateItem: async (id: string, updates: Partial<Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Equipment> => {
    const response = await api.put(`/equipment/${id}`, updates);
    return response.data;
  },
  
  // Delete equipment
  deleteItem: async (id: string): Promise<void> => {
    await api.delete(`/equipment/${id}`);
  }
};