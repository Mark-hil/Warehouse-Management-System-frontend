import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { Inventory } from '../../types/inventory.types';

interface StockLevelProps {
  inventory: Inventory;
  showDetails?: boolean;
}

const StockLevel: React.FC<StockLevelProps> = ({ inventory, showDetails = true }) => {
  const getStockStatus = () => {
    const ratio = inventory.quantity / inventory.minimumQuantity;
    if (ratio <= 1) return 'low';
    if (ratio <= 1.5) return 'medium';
    return 'good';
  };

  const status = getStockStatus();
  
  const statusConfig = {
    low: {
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      text: 'Low Stock',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
    },
    medium: {
      icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
      text: 'Medium Stock',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
    },
    good: {
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      text: 'Good Stock',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`rounded-lg ${config.bgColor} p-4`}>
      <div className="flex items-center">
        {config.icon}
        <span className={`ml-2 font-medium ${config.textColor}`}>
          {config.text}
        </span>
      </div>
      
      {showDetails && (
        <div className="mt-2 text-sm">
          <p className={config.textColor}>
            Current: {inventory.quantity} units
          </p>
          <p className={config.textColor}>
            Minimum: {inventory.minimumQuantity} units
          </p>
        </div>
      )}
    </div>
  );
};

export default StockLevel;