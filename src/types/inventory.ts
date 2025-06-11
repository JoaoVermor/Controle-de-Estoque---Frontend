export type EquipmentType = 'EPI' | 'EPC' | 'TOOL' | 'MATERIAL' | 'GENERIC';

export interface Equipment {
  id: string;
  name: string;
  code: string;
  quantity: number;
  type: EquipmentType;
  location: string;
  department: string;
  isOperational: boolean;
  notes?: string;
  validity?: string;
  lastUpdate: string;
  createdAt: string;
  updatedAt: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: keyof Equipment;
  direction: SortDirection;
}

export interface FilterConfig {
  types: EquipmentType[];
  department?: string;
  isOperational?: boolean;
  search: string;
}

export interface InventoryState {
  items: Equipment[];
  loading: boolean;
  error: string | null;
  selectedItem: Equipment | null;
  isModalOpen: boolean;
  modalMode: 'create' | 'edit' | 'view';
  filters: FilterConfig;
  sortConfig: SortConfig;
  currentPage: number;
  itemsPerPage: number;
}