import React from 'react';
import { Warehouse } from 'lucide-react';
import { Warehouse as WarehouseType } from '../../types/inventory.types';

interface WarehouseSelectorProps {
  warehouses: WarehouseType[];
  selectedWarehouse?: string;
  onChange: (warehouseId: string) => void;
  error?: string;
}

const WarehouseSelector: React.FC<WarehouseSelectorProps> = ({
  warehouses,
  selectedWarehouse,
  onChange,
  error,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Warehouse
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {warehouses.map((warehouse) => (
          <button
            key={warehouse.id}
            type="button"
            className={`flex items-center p-4 rounded-lg border ${
              selectedWarehouse === warehouse.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
            }`}
            onClick={() => onChange(warehouse.id)}
          >
            <div className={`p-2 rounded-full ${
              selectedWarehouse === warehouse.id
                ? 'bg-blue-100'
                : 'bg-gray-100'
            }`}>
              <Warehouse className={`h-5 w-5 ${
                selectedWarehouse === warehouse.id
                  ? 'text-blue-600'
                  : 'text-gray-500'
              }`} />
            </div>
            
            <div className="ml-3 text-left">
              <p className="text-sm font-medium text-gray-900">
                {warehouse.name}
              </p>
              <p className="text-xs text-gray-500">
                Capacity: {warehouse.currentCapacity}/{warehouse.capacity}
              </p>
            </div>
          </button>
        ))}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default WarehouseSelector;