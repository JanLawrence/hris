import FieldWrapper, { type FieldWrapperProps } from './FieldWrapper';
import Select, { type SelectProps } from './Select';

type SelectFieldProps = FieldWrapperProps & Omit<SelectProps, 'id' | 'invalid'>;

export default function SelectField({
  label, name, description, error, required, ...selectProps
}: SelectFieldProps) {
  return (
    <FieldWrapper label={label} name={name} description={description} error={error} required={required}>
      <Select id={name} invalid={!!error} {...selectProps} />
    </FieldWrapper>
  );
}
