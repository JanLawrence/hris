import { type EmployeeForm, type FieldErrors } from "@/features/employees/employeeForm";

import { format, parseISO } from "date-fns"

import DatePickerField from "@/components/form/DatePickerField"
import SelectField from "@/components/form/SelectField"
import { workSetupOption, employmentTypeOptions } from '@/features/employees/constants';

import { useDepartmentOptions } from '@/features/settings/hooks/useDepartments';
import { usePositionOptions } from '@/features/settings/hooks/usePositions';


type Props = {
    form: EmployeeForm
    errors: FieldErrors
    update: (field: keyof EmployeeForm, value: string) => void
}


export default function JobStep({ form, errors, update }: Props) {
    
    const { options: departmentOptions, isLoading: isLoadingDepartmentOptions } = useDepartmentOptions();
    const { options: positionOptions, isLoading: isLoadingPositionOptions } = usePositionOptions();

    return (
        <div className="flex flex-col gap-y-5">
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                <SelectField
                    label="Department"
                    name="department"
                    options={departmentOptions}
                    value={form.department}
                    onChange={(v) => update('department', v)}
                    loading={isLoadingDepartmentOptions}
                    placeholder="Select Department"
                    required
                    error={errors.department}
                />
                <SelectField
                    label="Position"
                    name="position"
                    options={positionOptions}
                    value={form.position}
                    onChange={(v) => update('position', v)}
                    loading={isLoadingPositionOptions}
                    placeholder="Select Position"
                    required
                    error={errors.position}
                />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                <SelectField
                    label="Employment Type"
                    name="employment_type"
                    options={employmentTypeOptions}
                    value={form.employment_type}
                    onChange={(v) => update('employment_type', v)}
                    placeholder="Select Employment Type"
                    required
                    error={errors.employment_type}
                />
                <SelectField
                    label="Work Setup"
                    name="work_setup"
                    options={workSetupOption}
                    value={form.work_setup}
                    onChange={(v) => update('work_setup', v)}
                    placeholder="Select Work Setup"
                    required
                    error={errors.work_setup}
                />
            </div>
            <div className="grid grid-cols-2  gap-x-4 gap-y-5">
                <DatePickerField label="Hire Date" name="hire_date" required
                    value={form.hire_date ? parseISO(form.hire_date) : undefined}
                    onChange={(date) => update('hire_date', date ? format(date, 'yyyy-MM-dd') : '')} 
                    error={errors.hire_date}
                />
            </div>
        </div>
    )
}