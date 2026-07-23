import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  inputClassName?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField({ label, error, hint, inputClassName, required, id, ...props }, ref) {
  const inputId = id ?? props.name;
  return (
    <label className="block" htmlFor={inputId}>
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}{required && <span className="ml-1 text-rose-600">*</span>}
      </span>
      <input
        ref={ref}
        id={inputId}
        required={required}
        className={cn(
          'h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400',
          error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-100',
          inputClassName,
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error ? <span className="mt-1.5 block text-xs font-medium text-rose-600">{error}</span> : hint ? <span className="mt-1.5 block text-xs text-slate-400">{hint}</span> : null}
    </label>
  );
});

interface SelectFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  selectProps: React.SelectHTMLAttributes<HTMLSelectElement>;
}

export function SelectField({ label, error, required, children, selectProps }: SelectFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}{required && <span className="ml-1 text-rose-600">*</span>}</span>
      <select {...selectProps} className={cn('h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100', error && 'border-rose-400 focus:ring-rose-100', selectProps.className)}>
        {children}
      </select>
      {error && <span className="mt-1.5 block text-xs font-medium text-rose-600">{error}</span>}
    </label>
  );
}
