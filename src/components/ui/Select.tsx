import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  label?: string;
  error?: string;
  id?: string;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  disabled = false,
  label,
  error,
  id,
  className = '',
}: SelectProps) {
  const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`;
  const errorId = error ? `${selectId}-error` : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-white"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={`
            w-full px-3 py-2 pr-10 rounded-md appearance-none
            bg-emby-surface border
            text-white
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emby-background
            focus:ring-emby-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'}
            ${className}
          `}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div
          className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400"
          aria-hidden="true"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {error && (
        <p id={errorId} className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}