import FieldWrapper, { type FieldWrapperProps } from './FieldWrapper';
import {
  DatePicker,
  DateRangePicker,
  TimePicker,
  type DatePickerProps,
  type DateRangePickerProps,
  type TimePickerProps,
} from './DatePicker';

type DatePickerFieldProps = FieldWrapperProps & Omit<DatePickerProps, 'id' | 'invalid'>;
type DateRangePickerFieldProps = FieldWrapperProps & Omit<DateRangePickerProps, 'id' | 'invalid'>;
type TimePickerFieldProps = FieldWrapperProps & Omit<TimePickerProps, 'id' | 'invalid'>;

export default function DatePickerField({
  label, name, description, error, required, ...pickerProps
}: DatePickerFieldProps) {
  return (
    <FieldWrapper label={label} name={name} description={description} error={error} required={required}>
      <DatePicker id={name} invalid={!!error} {...pickerProps} />
    </FieldWrapper>
  );
}

export function DateRangePickerField({
  label, name, description, error, required, ...pickerProps
}: DateRangePickerFieldProps) {
  return (
    <FieldWrapper label={label} name={name} description={description} error={error} required={required}>
      <DateRangePicker id={name} invalid={!!error} {...pickerProps} />
    </FieldWrapper>
  );
}

export function TimePickerField({
  label, name, description, error, required, ...pickerProps
}: TimePickerFieldProps) {
  return (
    <FieldWrapper label={label} name={name} description={description} error={error} required={required}>
      <TimePicker id={name} invalid={!!error} {...pickerProps} />
    </FieldWrapper>
  );
}
