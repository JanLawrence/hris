import type { ComponentProps } from 'react';
import { Textarea } from '@/components/ui/textarea';
import FieldWrapper, { type FieldWrapperProps } from './FieldWrapper';

type TextareaFieldProps = FieldWrapperProps & ComponentProps<typeof Textarea>;

export default function TextareaField({ label, name, description, error, required, ...textareaProps }: TextareaFieldProps) {
  return (
    <FieldWrapper label={label} name={name} description={description} error={error} required={required}>
      <Textarea
        id={name}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...textareaProps}
      />
    </FieldWrapper>
  );
}
