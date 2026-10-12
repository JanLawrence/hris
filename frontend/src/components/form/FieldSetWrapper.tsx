import type { ReactNode } from 'react';
import { FieldDescription, FieldError, FieldLegend, FieldSet } from '@/components/ui/field';
import type { FieldWrapperProps } from './FieldWrapper';

// Parang FieldWrapper, pero para sa grupo ng checkbox/radio (fieldset + legend)
export default function FieldSetWrapper({
  label, name, description, error, children, required
}: FieldWrapperProps & { children: ReactNode }) {
  return (
    <FieldSet data-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined} className="gap-2">
      <FieldLegend variant="label" className="mb-2 flex gap-1 leading-snug font-normal data-[variant=label]:text-xs">
        {label} {required && <span className='text-red-500'>*</span>}
      </FieldLegend>
      {children}
      {description && !error && (
        <FieldDescription>{description}</FieldDescription>
      )}
      {error && <FieldError id={`${name}-error`}>{error}</FieldError>}
    </FieldSet>
  );
}
