import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    const baseClasses = 'w-full px-3 py-2 border border-gray-950 text-black rounded-lg focus:outline-none ring-none focus:ring-none';
    const errorClasses = error ? 'border-red-500' : 'border-gray-300';
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`${baseClasses} ${errorClasses} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
