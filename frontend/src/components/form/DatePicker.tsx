import { useState } from 'react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { CalendarIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type { DateRange };

interface BasePickerProps {
  id?: string;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export interface DatePickerProps extends BasePickerProps {
  value?: Date;
  onChange: (value: Date | undefined) => void;
  withTime?: boolean;
  dateFormat?: string;
}

export interface DateRangePickerProps extends BasePickerProps {
  value?: DateRange;
  onChange: (value: DateRange | undefined) => void;
  dateFormat?: string;
  numberOfMonths?: number;
}

// Kunin ang "HH:mm" mula sa Date
const toTimeString = (date?: Date) => (date ? format(date, 'HH:mm') : '');

// Ilagay ang oras ("HH:mm") sa isang Date
const withTimeOf = (date: Date, time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours || 0, minutes || 0, 0, 0);
  return result;
};

// Pinagsasaluhang trigger button — kamukha ng InputField / MultiSelect
function PickerTrigger({
  id, invalid, disabled, className, hasValue, text, onClear,
}: {
  id?: string;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
  hasValue: boolean;
  text: string;
  onClear?: () => void;
}) {
  return (
    <PopoverTrigger
      disabled={disabled}
      render={
        <Button
          id={id}
          variant="input"
          size="lg"
          aria-invalid={invalid}
          disabled={disabled}
          className={cn('w-full justify-between font-normal', className)}
        />
      }
    >
      <span className={cn('truncate', !hasValue && 'text-muted-foreground')}>{text}</span>
      <span className="flex items-center gap-1">
        {hasValue && onClear && (
          <span
            role="button"
            aria-label="Clear"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="rounded-sm p-0.5 opacity-50 hover:bg-muted hover:opacity-100"
          >
            <X className="size-3.5" />
          </span>
        )}
        <CalendarIcon className="size-4 opacity-50" />
      </span>
    </PopoverTrigger>
  );
}

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = 'Pick a date',
  invalid,
  disabled = false,
  clearable = true,
  withTime = false,
  dateFormat,
  minDate,
  maxDate,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const displayFormat = dateFormat ?? (withTime ? 'MMM d, yyyy h:mm a' : 'MMM d, yyyy');

  const handleSelect = (date: Date | undefined) => {
    if (!date) return onChange(undefined);
    if (withTime) {
      // Panatilihin ang dating oras kapag nagpalit ng araw
      onChange(withTimeOf(date, toTimeString(value) || '00:00'));
    } else {
      onChange(date);
      setOpen(false);
    }
  };

  const handleTimeChange = (time: string) => {
    onChange(withTimeOf(value ?? new Date(), time));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PickerTrigger
        id={id}
        invalid={invalid}
        disabled={disabled}
        className={className}
        hasValue={!!value}
        text={value ? format(value, displayFormat) : placeholder}
        onClear={clearable ? () => onChange(undefined) : undefined}
      />

      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          defaultMonth={value}
          captionLayout="dropdown"
          startMonth={minDate}
          endMonth={maxDate}
          disabled={[
            ...(minDate ? [{ before: minDate }] : []),
            ...(maxDate ? [{ after: maxDate }] : []),
          ]}
        />

        {withTime && (
          <div className="flex items-center gap-2 border-t p-2">
            <span className="text-sm text-muted-foreground">Time</span>
            <Input
              type="time"
              value={toTimeString(value)}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="flex-1"
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export function DateRangePicker({
  id,
  value,
  onChange,
  placeholder = 'Pick a date range',
  invalid,
  disabled = false,
  clearable = true,
  dateFormat = 'MMM d, yyyy',
  numberOfMonths = 2,
  minDate,
  maxDate,
  className,
}: DateRangePickerProps) {
  const text = value?.from
    ? value.to
      ? `${format(value.from, dateFormat)} – ${format(value.to, dateFormat)}`
      : format(value.from, dateFormat)
    : placeholder;

  return (
    <Popover>
      <PickerTrigger
        id={id}
        invalid={invalid}
        disabled={disabled}
        className={className}
        hasValue={!!value?.from}
        text={text}
        onClear={clearable ? () => onChange(undefined) : undefined}
      />

      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          defaultMonth={value?.from}
          numberOfMonths={numberOfMonths}
          startMonth={minDate}
          endMonth={maxDate}
          disabled={[
            ...(minDate ? [{ before: minDate }] : []),
            ...(maxDate ? [{ after: maxDate }] : []),
          ]}
        />
      </PopoverContent>
    </Popover>
  );
}

export interface TimePickerProps {
  id?: string;
  value: string; // "HH:mm"
  onChange: (value: string) => void;
  invalid?: boolean;
  disabled?: boolean;
  step?: number; // seconds, e.g. 900 = 15-minute steps
  className?: string;
}

export function TimePicker({ id, value, onChange, invalid, disabled, step, className }: TimePickerProps) {
  return (
    <Input
      id={id}
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={invalid}
      disabled={disabled}
      step={step}
      className={className}
    />
  );
}
