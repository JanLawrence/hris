import FieldWrapper, { type FieldWrapperProps } from './FieldWrapper';
import MultiSelect, { type MultiSelectProps } from './MultiSelect';

type MultiSelectFieldProps = FieldWrapperProps & Omit<MultiSelectProps, 'id' | 'invalid'>;

export default function MultiSelectField({
  label, name, description, error, ...selectProps
}: MultiSelectFieldProps) {
  return (
    <FieldWrapper label={label} name={name} description={description} error={error}>
      <MultiSelect id={name} invalid={!!error} {...selectProps} />
    </FieldWrapper>
  );
}