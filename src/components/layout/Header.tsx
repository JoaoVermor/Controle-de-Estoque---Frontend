import React from 'react';
import { PackageSearch, Plus, LogOut, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useInventoryStore } from '../../store/inventory-store';
import { useAuthStore } from '../../store/auth-store';
import toast from 'react-hot-toast';

export const Header = () => {
  const { openCreateModal } = useInventoryStore();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <PackageSearch className="h-8 w-8 text-purple-600" />
            <h1 className="ml-2 text-xl font-bold text-gray-900">Controle de Estoque - Falcon</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              onClick={openCreateModal}
              className="transition-transform hover:scale-105 active:scale-95"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
            
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-purple-600" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};