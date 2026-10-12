import { useState } from 'react';
import { Check, ChevronDown, Loader2, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { Option } from './MultiSelect';

export interface SelectProps {
  id?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export default function Select({
  id,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  searchable = true,
  clearable = true,
  invalid,
  disabled = false,
  loading = false,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Buksan/isara ang popover; i-reset ang search kapag nagsara
  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setSearch('');
  };

  // Options na tugma sa search
  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  // Piliin ang option tapos isara ang popover
  const select = (optValue: string) => {
    onChange(optValue);
    handleOpenChange(false);
  };

  // Text sa trigger button
  const selected = options.find((opt) => opt.value === value);
  const triggerText = loading ? 'Loading...' : selected?.label ?? placeholder;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        disabled={disabled || loading}
        render={
          <Button
            id={id}
            variant="input"
            size="lg"
            aria-invalid={invalid}
            disabled={disabled || loading}
            className={cn('w-full justify-between font-normal', className)}
          />
        }
      >
        <span className={cn('truncate', (!selected || loading) && 'text-muted-foreground')}>
          {triggerText}
        </span>
        {loading ? (
          <Loader2 className="size-4 animate-spin opacity-50" />
        ) : (
          <ChevronDown className="size-4 opacity-50" />
        )}
      </PopoverTrigger>

      <PopoverContent align="start" className="w-(--anchor-width) min-w-56 p-0">
        {/* Search box */}
        {searchable && (
          <div className="relative border-b p-2">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-8"
            />
          </div>
        )}

        {/* Listahan ng options */}
        <div className="max-h-60 overflow-y-auto p-1">
          {filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">No available data.</p>
          )}

          {filtered.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => select(opt.value)}
              className={cn(
                'flex w-full items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted',
                opt.value === value && 'font-medium'
              )}
            >
              {opt.label}
              {opt.value === value && <Check className="size-4" />}
            </button>
          ))}
        </div>

        {/* Clear */}
        {clearable && value && (
          <div className="border-t p-1">
            <button
              type="button"
              onClick={() => select('')}
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
