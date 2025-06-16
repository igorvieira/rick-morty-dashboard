import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({ className = '', error, ...props }: InputProps) {
  const baseClasses = 'w-full px-3 py-2 border border-gray-950 text-black rounded-lg focus:outline-none ring-none focus:ring-none';
  const errorClasses = error ? 'border-red-500' : 'border-gray-300';
  return (
    <div className="w-full">
      <input
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
