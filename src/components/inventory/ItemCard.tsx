import React from 'react';
import { Package } from 'lucide-react';
import { Item } from '../../types/inventory.types';
import { formatCurrency } from '../../utils/format.utils';

interface ItemCardProps {
  item: Item;
  onEdit?: (item: Item) => void;
  onDelete?: (item: Item) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.category?.name}</p>
          </div>
        </div>
        <p className="text-lg font-semibold text-gray-900">
          {formatCurrency(item.unitPrice)}
        </p>
      </div>
      
      <p className="mt-4 text-sm text-gray-600">{item.description}</p>
      
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Unit: {item.unitMeasurement}
        </div>
        
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(item)}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(item)}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;