import React from 'react';
import { PackageOpen, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { useInventoryStore } from '../../store/inventory-store';

interface EmptyStateProps {
  filtered?: boolean;
}

export const EmptyState = ({ filtered = false }: EmptyStateProps) => {
  const { openCreateModal, setFilters } = useInventoryStore();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
      <PackageOpen className="h-12 w-12 text-gray-400 mb-4" />
      
      <h3 className="text-lg font-medium text-gray-900">
        {filtered ? 'No equipment matches your filters' : 'No equipment found'}
      </h3>
      
      <p className="mt-1 text-sm text-gray-500 text-center max-w-sm">
        {filtered 
          ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
          : 'Get started by adding your first piece of equipment.'}
      </p>
      
      <div className="mt-6">
        {filtered ? (
          <Button 
            onClick={() => setFilters([], undefined, undefined, '')}
            variant="outline"
          >
            Limpar Filtros
          </Button>
        ) : (
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Item
          </Button>
        )}
      </div>
    </div>
  );
};