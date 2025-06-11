import React from 'react';
import { Edit, Trash2, Eye, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useInventoryStore } from '../../store/inventory-store';
import { Equipment } from '../../types/inventory';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatDateTime, getItemTypeColor, getOperationalStatusColor, isValidityExpired, isValidityExpiringSoon } from '../../lib/utils';
import toast from 'react-hot-toast';

interface ItemCardProps {
  item: Equipment;
}

export const ItemCard = ({ item }: ItemCardProps) => {
  const { openEditModal, openViewModal, deleteItem } = useInventoryStore();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this equipment?')) {
      try {
        await deleteItem(item.id);
        toast.success('Equipment deleted successfully');
      } catch (error) {
        toast.error('Failed to delete equipment');
      }
    }
  };

  const validityExpired = isValidityExpired(item.validity);
  const validityExpiringSoon = isValidityExpiringSoon(item.validity);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-200 hover:shadow-lg">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate" title={item.name}>
              {item.name}
            </h3>
            <p className="text-sm text-gray-500 font-mono">{item.code}</p>
          </div>
          <div className="flex flex-col gap-1 ml-2">
            <Badge color={getItemTypeColor(item.type)}>{item.type}</Badge>
            <Badge color={getOperationalStatusColor(item.isOperational)}>
              {item.isOperational ? (
                <><CheckCircle className="h-3 w-3 mr-1" />Operacional</>
              ) : (
                <><XCircle className="h-3 w-3 mr-1" />Não Operacional</>
              )}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div>
            <span className="text-gray-500">Quantidade:</span>
            <span className="ml-1 font-medium">{item.quantity}</span>
          </div>
          <div>
            <span className="text-gray-500">Diretoria:</span>
            <span className="ml-1 font-medium">{item.department}</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500">Localização:</span>
            <span className="ml-1 font-medium">{item.location}</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500">Ultima Atualização:</span>
            <span className="ml-1 font-medium">{formatDateTime(item.lastUpdate)}</span>
          </div>
        </div>

        {/* Validity Status */}
        {item.validity && (
          <div className="mb-4">
            <div className={`flex items-center p-2 rounded-md text-sm ${
              validityExpired 
                ? 'bg-red-50 text-red-700 border border-red-200'
                : validityExpiringSoon
                ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span>
                Valid until: {formatDateTime(item.validity)}
                {validityExpired && ' (Expired)'}
                {validityExpiringSoon && !validityExpired && ' (Expiring Soon)'}
              </span>
            </div>
          </div>
        )}

        {/* Notes Preview */}
        {item.notes && (
          <div className="mb-4">
            <p className="text-gray-600 text-sm line-clamp-2" title={item.notes}>
              <span className="text-gray-500">Notas:</span> {item.notes}
            </p>
          </div>
        )}
        
        <div className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openViewModal(item)}
            className="text-purple-600 hover:text-purple-800"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <div className="space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEditModal(item)}
              className="text-amber-600 hover:text-amber-800"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};