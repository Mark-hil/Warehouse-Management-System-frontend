import React from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="relative flex items-start mb-4">
      <div className="flex h-6 items-center">
        <input
          type="checkbox"
          className={`
            h-4 w-4 rounded border-gray-300 text-blue-600 
            focus:ring-blue-600 focus:ring-2 focus:ring-offset-2
            ${error ? 'border-red-300' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      <div className="ml-3 text-sm leading-6">
        <label className="font-medium text-gray-700">
          {label}
        </label>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 absolute -bottom-5 left-0">
          {error}
        </p>
      )}
    </div>
  );
};

export default Checkbox;
