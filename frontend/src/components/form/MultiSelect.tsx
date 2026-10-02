import { useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface Option {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  id?: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  invalid?: boolean;
  className?: string;
}

export default function MultiSelect({
  id,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  invalid,
  className,
}: MultiSelectProps) {
  const [search, setSearch] = useState('');

  // Options na tugma sa search
  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  // I-check o i-uncheck ang isang option
  const toggle = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  // Text sa trigger button
  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label);

  const triggerText =
    selectedLabels.length === 0
      ? placeholder
      : selectedLabels.length <= 2
        ? selectedLabels.join(', ')
        : `${selectedLabels.length} selected`;

  return (
    <Popover onOpenChange={(open) => !open && setSearch('')}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            variant="input"
            size="lg"
            aria-invalid={invalid}
            className={cn('w-full justify-between font-normal', className)}
          />
        }
      >
        <span className={cn('truncate', value.length === 0 && 'text-muted-foreground')}>
          {triggerText}
        </span>
        <ChevronDown className="size-4 opacity-50" />
      </PopoverTrigger>

      <PopoverContent align="start" className="w-(--anchor-width) min-w-56 p-0">
        {/* Search box */}
        <div className="relative border-b p-2">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-8"
          />
        </div>

        {/* Listahan ng options */}
        <div className="max-h-60 overflow-y-auto p-1">
          {filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">No available data.</p>
          )}

          {filtered.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
            >
              <Checkbox
                checked={value.includes(opt.value)}
                tabIndex={-1}
                className="pointer-events-none"
              />
              {opt.label}
            </button>
          ))}
        </div>

        {/* Clear */}
        {value.length > 0 && (
          <div className="border-t p-1">
            <button
              type="button"
              onClick={() => onChange([])}
              className="flex w-full items-center justify-center gap-1 rounded-sm px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted"
            >
              <X className="size-3" /> Clear
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}