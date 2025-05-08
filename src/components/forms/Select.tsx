import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  options: Option[];
  error?: string;
  icon?: React.ReactNode;
  onChange?: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  icon,
  className = '',
  onChange,
  value,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{icon}</span>
          </div>
        )}
        <select
          value={value}
          onChange={handleChange}
          className={`
            block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 
            ring-inset ring-gray-300 placeholder:text-gray-400 
            focus:ring-2 focus:ring-inset focus:ring-blue-600 
            sm:text-sm sm:leading-6
            ${icon ? 'pl-10' : 'pl-4'}
            ${error ? 'ring-red-300 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;
