import React from 'react';

export interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
  className?: string;
}

export function Toggle({
  checked = false,
  onChange,
  disabled = false,
  label,
  id,
  className = '',
}: ToggleProps) {
  const toggleId = id || `toggle-${Math.random().toString(36).slice(2, 9)}`;

  const handleClick = () => {
    if (!disabled) {
      onChange?.(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        type="button"
        role="switch"
        id={toggleId}
        aria-checked={checked}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-11 shrink-0 rounded-full
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emby-background
          focus:ring-emby-primary
          ${checked ? 'bg-emby-primary' : 'bg-gray-600'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span
          className={`
            inline-block h-5 w-5 transform rounded-full bg-white shadow
            transition-transform duration-200 ease-in-out
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
          aria-hidden="true"
        />
      </button>
      {label && (
        <label htmlFor={toggleId} className="text-sm text-white cursor-pointer">
          {label}
        </label>
      )}
    </div>
  );
}