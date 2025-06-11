import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { useInventoryStore } from '../../store/inventory-store';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Equipment, EquipmentType } from '../../types/inventory';
import toast from 'react-hot-toast';
import { formatDateTime, getItemTypeColor, getOperationalStatusColor, isValidityExpired, isValidityExpiringSoon } from '../../lib/utils';

interface FormErrors {
  [key: string]: string;
}

const initialEquipmentState: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt' | 'lastUpdate'> = {
  name: '',
  code: '',
  quantity: 0,
  type: 'GENERIC',
  location: '',
  department: '',
  isOperational: true,
  notes: '',
  validity: '',
};

const equipmentTypeOptions = [
  { value: 'EPI', label: 'EPI' },
  { value: 'EPC', label: 'EPC' },
  { value: 'TOOL', label: 'TOOL' },
  { value: 'MATERIAL', label: 'MATERIAL' },
  { value: 'GENERIC', label: 'GENERIC' },
];

const operationalStatusOptions = [
  { value: 'true', label: 'Operacional' },
  { value: 'false', label: 'Não Operacional' },
];

const departmentOptions = [
  { value: 'Estrutura&Aerodinâmica', label: 'Estrutura&Aerodinâmica' },
  { value: 'Motor e Propulsão', label: 'Motor e Propulsão' },
  { value: 'Avionica', label: 'Avionica' },
  { value: 'Recuperação e Trajetória', label: 'Recuperação e Trajetória' },
  { value: 'Payload', label: 'Payload' },
  { value: 'Segurança', label: 'Segurança' },
  { value: 'Projetos', label: 'Projetos' },
  { value: 'Otimização', label: 'Otimização' },
  { value: 'Gestão de Pessoas', label: 'Gestão de Pessoas' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Financeiro', label: 'Financeiro' },
  { value: 'Extensão', label: 'Extensão' }
];

export const ItemModal = () => {
  const { isModalOpen, modalMode, selectedItem, closeModal, createItem, updateItem } = useInventoryStore();
  const [formData, setFormData] = useState<Omit<Equipment, 'id' | 'createdAt' | 'updatedAt' | 'lastUpdate'>>(initialEquipmentState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (modalMode === 'edit' && selectedItem) {
      setFormData({
        name: selectedItem.name,
        code: selectedItem.code,
        quantity: selectedItem.quantity,
        type: selectedItem.type,
        location: selectedItem.location,
        department: selectedItem.department,
        isOperational: selectedItem.isOperational,
        notes: selectedItem.notes || '',
        validity: selectedItem.validity ? selectedItem.validity.split('T')[0] : '',
      });
    } else if (modalMode === 'create') {
      setFormData(initialEquipmentState);
    }
    
    setErrors({});
  }, [modalMode, selectedItem, isModalOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' 
        ? parseFloat(value) || 0 
        : name === 'isOperational'
        ? value === 'true'
        : value,
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'Código é obrigatório';
    }
    
    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantidade não pode ser negativa';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Localização é obrigatória';
    }
    
    if (!formData.department.trim()) {
      newErrors.department = 'Diretoria é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...formData,
        validity: formData.validity ? new Date(formData.validity).toISOString() : undefined,
      };

      if (modalMode === 'create') {
        await createItem(submitData);
        toast.success('Item criado com sucesso!');
      } else if (modalMode === 'edit' && selectedItem) {
        await updateItem(selectedItem.id, submitData);
        toast.success('Item atualizado com sucesso!');
      }
      closeModal();
    } catch (error) {
      toast.error(
        modalMode === 'create' 
          ? 'Falha ao criar item' 
          : 'Falha ao atualizar item'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render view mode for detailed equipment view
  if (modalMode === 'view' && selectedItem) {
    const validityExpired = isValidityExpired(selectedItem.validity);
    const validityExpiringSoon = isValidityExpiringSoon(selectedItem.validity);

    return (
      <Dialog 
        open={isModalOpen} 
        onClose={closeModal} 
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="flex justify-between items-center border-b p-4">
              <Dialog.Title className="text-lg font-semibold">
                Detalhes do Item
              </Dialog.Title>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{selectedItem.name}</h3>
                <p className="mt-1 text-sm text-gray-500 font-mono">{selectedItem.code}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getItemTypeColor(selectedItem.type)}`}>
                    {selectedItem.type}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOperationalStatusColor(selectedItem.isOperational)}`}>
                    {selectedItem.isOperational ? (
                      <><CheckCircle className="h-3 w-3 mr-1" />Operacional</>
                    ) : (
                      <><XCircle className="h-3 w-3 mr-1" />Não Operacional</>
                    )}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Quantidade</h4>
                    <p className="mt-1 text-lg font-semibold">{selectedItem.quantity}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Diretoria</h4>
                    <p className="mt-1 font-medium">{selectedItem.department}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Localização</h4>
                    <p className="mt-1 font-medium">{selectedItem.location}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Criado em</h4>
                    <p className="mt-1 font-medium">{formatDateTime(selectedItem.createdAt)}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Ultima Atualização</h4>
                    <p className="mt-1 font-medium">{formatDateTime(selectedItem.lastUpdate)}</p>
                  </div>
                  
                  {selectedItem.validity && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Validade</h4>
                      <div className={`mt-1 p-2 rounded-md text-sm ${
                        validityExpired 
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : validityExpiringSoon
                          ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                          : 'bg-green-50 text-green-700 border border-green-200'
                      }`}>
                        {formatDateTime(selectedItem.validity)}
                        {validityExpired && ' (Expired)'}
                        {validityExpiringSoon && !validityExpired && ' (Expiring Soon)'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedItem.notes && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500">Notas</h4>
                  <p className="mt-1 text-gray-700 whitespace-pre-wrap">{selectedItem.notes}</p>
                </div>
              )}
              
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={() => {
                    closeModal();
                    setTimeout(() => useInventoryStore.getState().openEditModal(selectedItem), 100);
                  }}
                  variant="outline"
                  className="mr-2"
                >
                  Editar Item
                </Button>
                <Button onClick={closeModal}>Fechar</Button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    );
  }

  // Render form for create/edit modes
  return (
    <Dialog 
      open={isModalOpen} 
      onClose={closeModal} 
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="flex justify-between items-center border-b p-4">
            <Dialog.Title className="text-lg font-semibold">
              {modalMode === 'create' ? 'Add New Equipment' : 'Edit Equipment'}
            </Dialog.Title>
            <button 
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Nome"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
                className="col-span-2"
              />
              
              <Input
                label="Código"
                name="code"
                value={formData.code}
                onChange={handleChange}
                error={errors.code}
                required
              />
              
              <Input
                label="Quantidade"
                name="quantity"
                type="number"
                step="0.01"
                min="0"
                value={formData.quantity.toString()}
                onChange={handleChange}
                error={errors.quantity}
                required
              />
              
              <Select
                label="Tipo"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={equipmentTypeOptions}
              />
              
              <Select
                label="Diretoria"
                name="department"
                value={formData.department}
                onChange={handleChange}
                options={departmentOptions}
                error={errors.department}
              />
              
              <Input
                label="Localização"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={errors.location}
                required
                className="col-span-2"
              />
              
              <Select
                label="Status Operacional"
                name="isOperational"
                value={formData.isOperational.toString()}
                onChange={handleChange}
                options={operationalStatusOptions}
              />
              
              <Input
                label="Data de Validade (opcional)"
                name="validity"
                type="date"
                value={formData.validity}
                onChange={handleChange}
              />
              
              <Textarea
                label="Notas (opcional)"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="col-span-2"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={closeModal}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? 'Saving...' 
                  : modalMode === 'create' 
                  ? 'Criar Item' 
                  : 'Atualizar Item'}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};