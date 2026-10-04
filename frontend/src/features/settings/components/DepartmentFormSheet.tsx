
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
// import { Switch } from '@/components/ui/switch';
import type { Department } from '@/types/department';
import { useSaveDepartment } from '../hooks/useDepartmentMutations';
import { capitalize } from '@/utils/text';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    department: Department | null;
}
  
type FieldErrors = { name?: string; code?: string };

function validate(name: string, code: string): FieldErrors {
    const errors: FieldErrors = {};
  
    if (!name.trim()) {
      errors.name = 'This field may not be null.';
    } else if (name.trim().length > 100) {
      errors.name = 'Name must be 100 characters or less.';
    }
  
    if (!code.trim()) {
        errors.code = 'This field may not be null.';
      } else if (code.trim().length > 20) {
        errors.code = 'Code must be 20 characters or less.';
      } else if (!/^[A-Za-z0-9-]+$/.test(code.trim())) {
        errors.code = 'Letters, numbers, and dashes only.';
    }
  
    return errors;
}


export default function DepartmentFormSheet({ open, onOpenChange, department }: Props) {
    const saveDepartment = useSaveDepartment();

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        if (open) {
          setName(department?.name ?? '');
          setCode(department?.code ?? '');
          setIsActive(department?.is_active ?? true);
          setErrors({});
          setServerError('');
        }
    }, [open, department]);


    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
      
        const newErrors = validate(name, code);
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;
      
        const isEdit = !!department;
        const toastId = toast.add({ type: 'loading', title: isEdit ? 'Updating department...' : 'Saving department...'});
      
        saveDepartment.mutate(
          {
            id: department?.id,
            data: { name: name.trim(), code: code.trim().toUpperCase(), is_active: isActive },
          },
          {
            onSuccess: () => {
                toast.update(toastId, { type: 'success', title: isEdit ? 'Department updated.' : 'Department saved.' })
              onOpenChange(false);
            },
            onError: (err) => {
              const data = (err as AxiosError<Record<string, string[]>>).response?.data;
              if (data?.name || data?.code) {
                toast.close(toastId);
                setErrors({
                    name: capitalize(data.name?.[0]),
                    code: capitalize(data.code?.[0]),
                });
              } else {
                toast.update(toastId, { type: 'error', title: 'Failed to save department. Please try again.' })
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
                        <SheetTitle>{department ? 'Edit Department' : 'Add Department'}</SheetTitle>
                        <SheetDescription>
                        {department ? 'Update Department details' : 'Add New Department'}
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex-1 space-y-4 overflow-y-auto px-4">
                        <FormAlert message={serverError} />

                        <InputField name="name" label="Name" autoFocus required={true}
                            value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
                        <InputField name="code" label="Code" required={true}
                            value={code} onChange={(e) => setCode(e.target.value)} error={errors.code}
                            description={'e.g. HR, IT'}/>
                        <SwitchField
                            name="is_active"
                            label="Active"
                            description="Inactive departments are hidden."
                            checked={isActive}
                            required={true}
                            onCheckedChange={setIsActive}
                        />
                    </div>
                    <SheetFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saveDepartment.isPending}>
                            {saveDepartment.isPending ? 'Saving...' : 'Save'}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}