import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import FieldSetWrapper from './FieldSetWrapper';
import type { FieldWrapperProps } from './FieldWrapper';
import type { Option } from './MultiSelect';

type CheckboxFieldProps = FieldWrapperProps & {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
};

export default function CheckboxField({
  label, name, description, error, required,
  options, value, onChange, orientation = 'vertical', disabled,
}: CheckboxFieldProps) {
  // I-check o i-uncheck ang isang option
  const toggle = (optValue: string, checked: boolean) => {
    onChange(checked ? [...value, optValue] : value.filter((v) => v !== optValue));
  };

  return (
    <FieldSetWrapper label={label} name={name} description={description} error={error} required={required}>
      <div
        data-slot="checkbox-group"
        className={cn('flex gap-3', orientation === 'vertical' ? 'flex-col' : 'flex-wrap gap-x-6')}
      >
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 text-sm">
            <Checkbox
              name={name}
              value={opt.value}
              checked={value.includes(opt.value)}
              onCheckedChange={(checked) => toggle(opt.value, checked)}
              aria-invalid={!!error}
              disabled={disabled}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </FieldSetWrapper>
  );
}
