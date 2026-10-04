import type { ReactNode } from 'react';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';

export interface FieldWrapperProps {
  label: string;
  name: string;
  description?: string;
  error?: string;
  required?: boolean;
}

export default function FieldWrapper({
  label, name, description, error, children, required
}: FieldWrapperProps & { children: ReactNode }) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={name}>{label} {required && <p className='text-red-500'>*</p>}</FieldLabel>
      {children}
      {description && !error && (
        <FieldDescription>{description}</FieldDescription>
      )}
      {error && <FieldError id={`${name}-error`}>{error}</FieldError>}
    </Field>
  );
}