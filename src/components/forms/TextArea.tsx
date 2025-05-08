import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ 
  label, 
  error, 
  className = '', 
  rows = 4,
  ...props 
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        <textarea
          rows={rows}
          className={`
            block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 
            ring-inset ring-gray-300 placeholder:text-gray-400 
            focus:ring-2 focus:ring-inset focus:ring-blue-600 
            sm:text-sm sm:leading-6
            ${error ? 'ring-red-300 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default TextArea;
