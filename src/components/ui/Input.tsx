import React from 'react';

export type InputType = 'text' | 'password' | 'email' | 'number';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type?: InputType;
  error?: string;
  label?: string;
}

export function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  label,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id || `input-${type}-${Math.random().toString(36).slice(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-white"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={`
          w-full px-3 py-2 rounded-md
          bg-emby-surface border
          text-white placeholder:text-gray-500
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emby-background
          focus:ring-emby-primary
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}