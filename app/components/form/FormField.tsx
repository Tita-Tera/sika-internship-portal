import React from 'react';
import { FieldError } from 'react-hook-form';

export const inputClass =
  'w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-150';

export const labelClass = 'block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5';

export const errorClass = 'text-red-500 text-xs mt-1.5 flex items-center gap-1';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: FieldError;
  icon?: React.ReactNode;
  children: React.ReactElement;
}

export function FormField({ label, required, error, icon, children }: FormFieldProps) {
  const existingClass = (children.props as { className?: string }).className || '';
  const className = `${inputClass} ${icon ? 'pl-9' : ''} ${existingClass}`.trim();
  const childWithClass = React.cloneElement(children, { className } as Record<string, unknown>);

  return (
    <div>
      <label className={labelClass}>
        {label} {required && <span className="text-blue-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
            {icon}
          </div>
        )}
        {childWithClass}
      </div>
      {error && <p className={errorClass}>· {error.message}</p>}
    </div>
  );
}

interface SelectFieldProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  label: string;
  required?: boolean;
  error?: FieldError;
  icon?: React.ReactNode;
  options: { value: string; label: string }[];
}

export function SelectField({ label, required, error, icon, options, ...props }: SelectFieldProps) {
  return (
    <FormField label={label} required={required} error={error} icon={icon}>
      <select {...props} className="appearance-none">
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}