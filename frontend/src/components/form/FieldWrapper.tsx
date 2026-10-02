import type { ReactNode } from 'react';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';

export interface FieldWrapperProps {
  label: string;
  name: string;
  description?: string;
  error?: string;
}

export default function FieldWrapper({
  label, name, description, error, children,
}: FieldWrapperProps & { children: ReactNode }) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      {children}
      {description && !error && (
        <FieldDescription className="text-xs">{description}</FieldDescription>
      )}
      {error && <FieldError id={`${name}-error`}>{error}</FieldError>}
    </Field>
  );
}