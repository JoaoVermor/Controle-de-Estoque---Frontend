import React, { useEffect, useMemo } from 'react';
import { useInventoryStore } from '../store/inventory-store';
import { Header } from '../components/layout/Header';
import { ItemFilters } from '../components/inventory/ItemFilters';
import { ItemCard } from '../components/inventory/ItemCard';
import { Pagination } from '../components/inventory/Pagination';
import { ItemModal } from '../components/inventory/ItemModal';
import { EmptyState } from '../components/inventory/EmptyState';
import { Toaster } from 'react-hot-toast';

export const InventoryPage = () => {
  const { 
    items, 
    loading, 
    fetchItems, 
    filters, 
    sortConfig, 
    setSortConfig,
    currentPage, 
    setPage,
    itemsPerPage 
  } = useInventoryStore();

  useEffect(() => {
    fetchItems();
  }, []);

  // Sort and paginate items
  const sortedItems = useMemo(() => {
    const { key, direction } = sortConfig;
    
    return [...items].sort((a, b) => {
      const aValue = a[key as keyof typeof a];
      const bValue = b[key as keyof typeof b];
      if (aValue === undefined || bValue === undefined) return 0;
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [items, sortConfig]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedItems.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedItems, currentPage, itemsPerPage]);

  // Determine if we're showing empty state due to filters
  const isFilteredEmpty = items.length > 0 && paginatedItems.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ItemFilters />
        
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-500">Loading equipment...</p>
            </div>
          </div>
        ) : paginatedItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
            
            <Pagination
              currentPage={currentPage}
              totalItems={sortedItems.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setPage}
            />
          </>
        ) : (
          <EmptyState filtered={isFilteredEmpty} />
        )}
      </main>
      
      <ItemModal />
    </div>
  );
};