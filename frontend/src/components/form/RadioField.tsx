import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import FieldSetWrapper from './FieldSetWrapper';
import type { FieldWrapperProps } from './FieldWrapper';
import type { Option } from './MultiSelect';

type RadioFieldProps = FieldWrapperProps & {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
};

export default function RadioField({
  label, name, description, error, required,
  options, value, onChange, orientation = 'vertical', disabled,
}: RadioFieldProps) {
  return (
    <FieldSetWrapper label={label} name={name} description={description} error={error} required={required}>
      <RadioGroup
        name={name}
        value={value}
        onValueChange={(v) => onChange(v as string)}
        disabled={disabled}
        className={cn('gap-3', orientation === 'horizontal' && 'flex flex-wrap gap-x-6')}
      >
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 text-sm">
            <RadioGroupItem value={opt.value} aria-invalid={!!error} />
            {opt.label}
          </label>
        ))}
      </RadioGroup>
    </FieldSetWrapper>
  );
}
