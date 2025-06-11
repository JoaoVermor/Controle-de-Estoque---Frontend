import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function getOperationalStatusColor(isOperational: boolean): string {
  return isOperational 
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800';
}

export function getItemTypeColor(type: string): string {
  switch (type) {
    case 'EPI':
      return 'bg-blue-100 text-blue-800';
    case 'EPC':
      return 'bg-purple-100 text-purple-800';
    case 'TOOL':
      return 'bg-amber-100 text-amber-800';
    case 'MATERIAL':
      return 'bg-emerald-100 text-emerald-800';
    case 'GENERIC':
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function isValidityExpired(validityDate?: string): boolean {
  if (!validityDate) return false;
  return new Date(validityDate) < new Date();
}

export function isValidityExpiringSoon(validityDate?: string, daysThreshold: number = 30): boolean {
  if (!validityDate) return false;
  const validity = new Date(validityDate);
  const threshold = new Date();
  threshold.setDate(threshold.getDate() + daysThreshold);
  return validity <= threshold && validity >= new Date();
}