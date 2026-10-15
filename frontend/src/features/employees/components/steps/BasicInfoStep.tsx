import { type EmployeeForm, type FieldErrors } from "@/features/employees/employeeForm";

import { format, parseISO } from "date-fns"
import { civilStatusOption } from '@/features/employees/constants';

import InputField from "@/components/form/InputField"
import DatePickerField from "@/components/form/DatePickerField"
import SelectField from "@/components/form/SelectField"
import TextareaField from "@/components/form/TextareaField"

import { Checkbox } from "@/components/ui/checkbox"

type Props = {
    form: EmployeeForm
    errors: FieldErrors
    update: (field: keyof EmployeeForm, value: string) => void
    sameAsPresent: boolean
    onSameAsPresentChange: (checked: boolean) => void
}


export default function BasicInfoStep({ form, errors, update, sameAsPresent, onSameAsPresentChange }: Props) {
    
    return (
        <div className="flex flex-col gap-y-5">
            <div className="grid grid-cols-3 gap-x-4 gap-y-5">
                <InputField name="first_name" label="First Name" autoFocus required={true} error={errors.first_name}
                    value={form.first_name} onChange={(e) => update('first_name', e.target.value)} />
                <InputField name="middle_name" label="Middle Name" error={errors.middle_name}
                    value={form.middle_name} onChange={(e) => update('middle_name', e.target.value)} />
                <InputField name="last_name" label="Last Name" required={true} error={errors.last_name}
                    value={form.last_name} onChange={(e) => update('last_name', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                <DatePickerField label="Birth Date" name="birth_date" required
                    value={form.birth_date ? parseISO(form.birth_date) : undefined} error={errors.birth_date}
                    onChange={(date) => update('birth_date', date ? format(date, 'yyyy-MM-dd') : '')}
                    maxDate={new Date()} />
                <SelectField
                    label="Civil Status" 
                    name="civil_status"
                    options={civilStatusOption}
                    value={form.civil_status}
                    onChange={(v) => update('civil_status', v)}
                    placeholder="Select Civil Status"
                    error={errors.civil_status}
                />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                <InputField name="email" label="Email" required={true} type="email" error={errors.email}
                    value={form.email} onChange={(e) => update('email', e.target.value)} />
                <InputField name="mobile_no" label="Mobile No." required={true} error={errors.mobile_no}
                    value={form.mobile_no} onChange={(e) => update('mobile_no', e.target.value)} />
            </div>
            <div className="grid grid-cols-2  gap-x-4 gap-y-5">
                <div>
                    <TextareaField name="present_address" label="Present Address" required={true} rows={5}
                        value={form.present_address} onChange={(e) => {
                            update('present_address', e.target.value)
                            if(sameAsPresent){
                                update('permanent_address', e.target.value)
                            }
                        }} 
                        error={errors.present_address}
                    />
                    <label className="mt-2 flex items-center gap-2 text-xs">
                        <Checkbox checked={sameAsPresent} onCheckedChange={onSameAsPresentChange} />
                        Same as present address
                    </label>
                </div>
                <div>
                    <TextareaField name="permanent_address" label="Permanent Address" required={true} rows={5} disabled={sameAsPresent}
                        value={form.permanent_address} onChange={(e) => update('permanent_address', e.target.value)} 
                        error={errors.permanent_address}
                    />
                    
                </div>
            </div>
        </div>
    )
}