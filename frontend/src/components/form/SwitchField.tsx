import type { ComponentProps } from 'react';
import { Switch } from '@/components/ui/switch';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import type { FieldWrapperProps } from './FieldWrapper';

type SwitchFieldProps = FieldWrapperProps & ComponentProps<typeof Switch>;

export default function SwitchField({ label, name, description, error, required, ...switchProps }: SwitchFieldProps) {
  return (
    <Field orientation="horizontal" data-invalid={!!error}>
      <FieldContent>
        <FieldLabel htmlFor={name}>{label}{required && <p className='text-red-700'>*</p>}</FieldLabel>
        {description && !error && (
          <FieldDescription>{description}</FieldDescription>
        )}
        {error && <FieldError id={`${name}-error`}>{error}</FieldError>}
      </FieldContent>
      <Switch
        id={name}
        name={name}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...switchProps}
      />
    </Field>
  );
}
