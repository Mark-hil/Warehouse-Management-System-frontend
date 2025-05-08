import React from 'react';

export interface SwitchProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
}) => {
  return (
    <label className={`inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={`block w-14 h-8 rounded-full transition-colors ${
            checked ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        />
        <div
          className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform transform ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </div>
      {label && <span className="ml-3 text-sm font-medium text-gray-900">{label}</span>}
    </label>
  );
};
