import { type EmployeeForm, type FieldErrors } from "@/features/employees/employeeForm";
import InputField from "@/components/form/InputField"

type Props = {
    form: EmployeeForm
    errors: FieldErrors
    update: (field: keyof EmployeeForm, value: string) => void
}


export default function EmergencyContactFields({ form, errors, update }: Props) {
    

    return (
        <div className="flex flex-col gap-y-5 border-t pt-6">
            <div className="text-sm font-medium">Emergency Contact</div>
            <div className="grid grid-cols-3 gap-x-4 gap-y-5">
                <InputField name="emergency_contact_name" label="Name" error={errors.emergency_contact_name}
                    value={form.emergency_contact_name} onChange={(e) => update('emergency_contact_name', e.target.value)} />
                <InputField name="emergency_contact_relationship" label="Relationship" error={errors.emergency_contact_relationship}
                    value={form.emergency_contact_relationship} onChange={(e) => update('emergency_contact_relationship', e.target.value)} />
                <InputField name="emergency_contact_mobile" type="tel" label="Mobile No." error={errors.emergency_contact_mobile}
                    value={form.emergency_contact_mobile} onChange={(e) => update('emergency_contact_mobile', e.target.value)} />
            </div>
        </div>
    )
}