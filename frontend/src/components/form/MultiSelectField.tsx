import FieldWrapper, { type FieldWrapperProps } from './FieldWrapper';
import MultiSelect, { type MultiSelectProps } from './MultiSelect';

type MultiSelectFieldProps = FieldWrapperProps & Omit<MultiSelectProps, 'id' | 'invalid'>;

export default function MultiSelectField({
  label, name, description, error, required, ...selectProps
}: MultiSelectFieldProps) {
  return (
    <FieldWrapper label={label} name={name} description={description} error={error} required={required}>
      <MultiSelect id={name} invalid={!!error} {...selectProps} />
    </FieldWrapper>
  );
}