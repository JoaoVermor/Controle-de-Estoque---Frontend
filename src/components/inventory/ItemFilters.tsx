import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useInventoryStore } from '../../store/inventory-store';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { EquipmentType } from '../../types/inventory';
import { Badge } from '../ui/Badge';
import { getItemTypeColor } from '../../lib/utils';

const EQUIPMENT_TYPES: { value: EquipmentType; label: string }[] = [
  { value: 'EPI', label: 'EPI' },
  { value: 'EPC', label: 'EPC' },
  { value: 'TOOL', label: 'TOOL' },
  { value: 'MATERIAL', label: 'MATERIAL' },
  { value: 'GENERIC', label: 'GENERIC' },
];

const OPERATIONAL_STATUS_OPTIONS = [
  { value: true, label: 'Operacional' },
  { value: false, label: 'Não Operacional' },
];

// Common departments - you can expand this list based on your needs
const DEPARTMENT_OPTIONS = [
  'Estrutura&Aerodinâmica',
  'Motor e Propulsão',
  'Avionica',
  'Recuperação e Trajetória',
  'Payload',
  'Segurança',
  'Projetos',
  'Otimização',
  'Gestão de Pessoas',
  'Marketing',
  'Financeiro',
  'Extensão'
];

export const ItemFilters = () => {
  const { filters, setFilters } = useInventoryStore();
  const [searchValue, setSearchValue] = useState(filters.search);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<EquipmentType[]>(filters.types);
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(filters.department);
  const [selectedOperationalStatus, setSelectedOperationalStatus] = useState<boolean | undefined>(filters.isOperational);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(filters.types, filters.department, filters.isOperational, searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleTypeToggle = (type: EquipmentType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(prev => prev === department ? undefined : department);
  };

  const handleOperationalStatusChange = (status: boolean) => {
    setSelectedOperationalStatus(prev => prev === status ? undefined : status);
  };

  const applyFilters = () => {
    setFilters(selectedTypes, selectedDepartment, selectedOperationalStatus);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedDepartment(undefined);
    setSelectedOperationalStatus(undefined);
    setSearchValue('');
    setFilters([], undefined, undefined, '');
    setIsFilterOpen(false);
  };

  const activeFiltersCount = filters.types.length + 
    (filters.department ? 1 : 0) + 
    (filters.isOperational !== undefined ? 1 : 0);

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search equipment..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 bg-purple-100 text-purple-800">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Active filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500">Filtros Ativos:</span>
          {filters.types.map(type => (
            <Badge 
              key={type} 
              color={getItemTypeColor(type)}
              className="flex items-center gap-1"
            >
              {type}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  const newTypes = filters.types.filter(t => t !== type);
                  setSelectedTypes(newTypes);
                  setFilters(newTypes, filters.department, filters.isOperational);
                }}
              />
            </Badge>
          ))}
          {filters.department && (
            <Badge 
              color="bg-indigo-100 text-indigo-800"
              className="flex items-center gap-1"
            >
              {filters.department}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  setSelectedDepartment(undefined);
                  setFilters(filters.types, undefined, filters.isOperational);
                }}
              />
            </Badge>
          )}
          {filters.isOperational !== undefined && (
            <Badge 
              color={filters.isOperational ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
              className="flex items-center gap-1"
            >
              {filters.isOperational ? 'Operational' : 'Non-Operational'}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  setSelectedOperationalStatus(undefined);
                  setFilters(filters.types, filters.department, undefined);
                }}
              />
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Filter panel */}
      {isFilterOpen && (
        <div className="bg-white p-4 rounded-md shadow-md border border-gray-200 animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-2">Tipo de Item</h3>
              <div className="flex flex-wrap gap-2">
                {EQUIPMENT_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => handleTypeToggle(type.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedTypes.includes(type.value)
                        ? getItemTypeColor(type.value)
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Diretoria</h3>
              <div className="flex flex-wrap gap-2">
                {DEPARTMENT_OPTIONS.map(department => (
                  <button
                    key={department}
                    onClick={() => handleDepartmentChange(department)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedDepartment === department
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {department}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Status Operacional</h3>
              <div className="flex flex-wrap gap-2">
                {OPERATIONAL_STATUS_OPTIONS.map(status => (
                  <button
                    key={status.value.toString()}
                    onClick={() => handleOperationalStatusChange(status.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedOperationalStatus === status.value
                        ? status.value
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Limpar Todos
            </Button>
            <Button size="sm" onClick={applyFilters}>
              Aplicar Filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};