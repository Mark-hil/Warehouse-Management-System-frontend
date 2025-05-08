import React from 'react';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  description?: string;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  error?: string;
}

const Form: React.FC<FormProps> = ({
  title,
  description,
  children,
  onSubmit,
  submitLabel = 'Submit',
  isSubmitting = false,
  error,
  className = '',
  ...props
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`} {...props}>
      {(title || description) && (
        <div className="mb-8">
          {title && (
            <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {description}
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {children}

      <div className="flex items-center justify-end gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            flex justify-center rounded-md bg-blue-600 px-6 py-2.5 text-sm 
            font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
            focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
};

export default Form;
