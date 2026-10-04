
import { useEffect, useState, type SubmitEvent } from 'react';
import type { AxiosError } from 'axios';
import InputField from '@/components/form/InputField';
import SwitchField from '@/components/form/SwitchField';
import FormAlert from '@/components/form/FormAlert';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import {
  Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import type { Position } from '@/types/position';
import { useSavePosition } from '../hooks/usePositionMutations';
import { capitalize } from '@/utils/text';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    position: Position | null;
}
  
type FieldErrors = { title?: string; }

function validate(title: string): FieldErrors {
    const errors: FieldErrors = {};
  
    if (!title.trim()) {
      errors.title = 'This field may not be null.';
    } else if (title.trim().length > 100) {
      errors.title = 'Title must be 100 characters or less.';
    }

    return errors;
}


export default function PositionFormSheet({ open, onOpenChange, position }: Props) {
    const savePosition = useSavePosition();

    const [title, setTitle] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        if (open) {
          setTitle(position?.title ?? '');
          setIsActive(position?.is_active ?? true);
          setErrors({});
          setServerError('');
        }
    }, [open, position]);


    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
      
        const newErrors = validate(title);
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;
      
        const isEdit = !!position;
        const toastId = toast.add({ type: 'loading', title: isEdit ? 'Updating position...' : 'Saving position...'});
      
        savePosition.mutate(
          {
            id: position?.id,
            data: { title: title.trim(), is_active: isActive },
          },
          {
            onSuccess: () => {
                toast.update(toastId, { type: 'success', title: isEdit ? 'Position updated.' : 'Position saved.' })
              onOpenChange(false);
            },
            onError: (err) => {
              const data = (err as AxiosError<Record<string, string[]>>).response?.data;
              if (data?.title) {
                toast.close(toastId);
                setErrors({
                    title: capitalize(data.name?.[0]),
                });
              } else {
                toast.update(toastId, { type: 'error', title: 'Failed to save position. Please try again.' })
              }
            },
          }
        );
      };
    
    return (
        <Sheet 
            open={open} 
            disablePointerDismissal
            onOpenChange={(nextOpen, details) => {
                if (details.reason === 'escape-key') return;
                onOpenChange(nextOpen);
            }}
        >
             <SheetContent side="right" className="sm:max-w-md">
                <form onSubmit={handleSubmit} className="flex h-full flex-col" noValidate>
                    <SheetHeader>
                        <SheetTitle>{position ? 'Edit Position' : 'Add Position'}</SheetTitle>
                        <SheetDescription>
                        {position ? 'Update Position details' : 'Add New Position'}
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex-1 space-y-4 overflow-y-auto px-4">
                        <FormAlert message={serverError} />

                        <InputField name="name" label="Title" autoFocus required={true}
                            value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} />
                        <SwitchField
                            name="is_active"
                            label="Active"
                            description="Inactive positions are hidden."
                            checked={isActive}
                            required={true}
                            onCheckedChange={setIsActive}
                        />
                    </div>
                    <SheetFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={savePosition.isPending}>
                            {savePosition.isPending ? 'Saving...' : 'Save'}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}