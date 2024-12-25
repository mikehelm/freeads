import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, id, name, error, ...props }, ref) => {
    // Use id as name if name is not provided, and vice versa
    const inputId = id || name || props['aria-label'] || 'input';
    const inputName = name || id || props['aria-label'] || 'input';

    return (
      <div className="w-full">
        <input
          type={type}
          id={inputId}
          name={inputName}
          className={cn(
            "flex h-10 w-full rounded-md border border-accent-blue/20 bg-background px-3 py-2 text-sm text-text-primary ring-offset-background placeholder:text-text-muted focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          ref={ref}
          aria-invalid={error ? "true" : "false"}
          aria-errormessage={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
