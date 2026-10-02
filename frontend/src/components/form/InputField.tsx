import type { ComponentProps } from 'react';
import { Input } from '@/components/ui/input';
import FieldWrapper, { type FieldWrapperProps } from './FieldWrapper';

type InputFieldProps = FieldWrapperProps & ComponentProps<typeof Input>;

export default function InputField({ label, name, description, error, ...inputProps }: InputFieldProps) {
  return (
    <FieldWrapper label={label} name={name} description={description} error={error}>
      <Input
        id={name}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...inputProps}
      />
    </FieldWrapper>
  );
}