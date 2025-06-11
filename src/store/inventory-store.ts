import { create } from 'zustand';
import { InventoryState, Equipment, EquipmentType } from '../types/inventory';
import { inventoryApi } from '../lib/api';

const initialState: InventoryState = {
  items: [],
  loading: false,
  error: null,
  selectedItem: null,
  isModalOpen: false,
  modalMode: 'create',
  filters: {
    types: [],
    department: undefined,
    isOperational: undefined,
    search: '',
  },
  sortConfig: {
    key: 'name',
    direction: 'asc',
  },
  currentPage: 1,
  itemsPerPage: 6,
};

export const useInventoryStore = create<
  InventoryState & {
    fetchItems: () => Promise<void>;
    setFilters: (types: EquipmentType[], department?: string, isOperational?: boolean, search?: string) => Promise<void>;
    setSortConfig: (key: keyof Equipment, direction: 'asc' | 'desc') => void;
    setPage: (page: number) => void;
    selectItem: (item: Equipment | null) => void;
    openCreateModal: () => void;
    openEditModal: (item: Equipment) => void;
    openViewModal: (item: Equipment) => void;
    closeModal: () => void;
    createItem: (item: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt' | 'lastUpdate'>) => Promise<void>;
    updateItem: (id: string, updates: Partial<Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
  }
>((set, get) => ({
  ...initialState,

  fetchItems: async () => {
    const { filters } = get();
    set({ loading: true, error: null });
    
    try {
      const items = await inventoryApi.getItems(
        filters.search,
        filters.types.length > 0 ? filters.types : undefined,
        filters.department,
        filters.isOperational
      );
      set({ items, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  setFilters: async (types: EquipmentType[], department?: string, isOperational?: boolean, search?: string) => {
    set(state => ({
      filters: {
        ...state.filters,
        types,
        department,
        isOperational,
        search: search !== undefined ? search : state.filters.search
      },
      currentPage: 1,
    }));
    await get().fetchItems();
  },

  setSortConfig: (key: keyof Equipment, direction: 'asc' | 'desc') => {
    set({ sortConfig: { key, direction } });
  },

  setPage: (page: number) => {
    set({ currentPage: page });
  },

  selectItem: (item: Equipment | null) => {
    set({ selectedItem: item });
  },

  openCreateModal: () => {
    set({ isModalOpen: true, modalMode: 'create', selectedItem: null });
  },

  openEditModal: (item: Equipment) => {
    set({ isModalOpen: true, modalMode: 'edit', selectedItem: item });
  },

  openViewModal: (item: Equipment) => {
    set({ isModalOpen: true, modalMode: 'view', selectedItem: item });
  },

  closeModal: () => {
    set({ isModalOpen: false });
  },

  createItem: async (item: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt' | 'lastUpdate'>) => {
    set({ loading: true, error: null });
    
    try {
      await inventoryApi.createItem(item);
      await get().fetchItems();
      set({ isModalOpen: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateItem: async (id: string, updates: Partial<Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>>) => {
    set({ loading: true, error: null });
    
    try {
      await inventoryApi.updateItem(id, updates);
      await get().fetchItems();
      set({ isModalOpen: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteItem: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      await inventoryApi.deleteItem(id);
      await get().fetchItems();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  }
}));