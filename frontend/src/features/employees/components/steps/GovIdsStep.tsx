
import { type EmployeeForm, type FieldErrors } from "@/features/employees/employeeForm";

import InputField from "@/components/form/InputField"

type Props = {
    form: EmployeeForm
    errors: FieldErrors
    update: (field: keyof EmployeeForm, value: string) => void
}


export default function GovIdsStep({ form, errors, update }: Props) {
    

    return (
        <div className="flex flex-col gap-y-5">
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                <InputField name="sss_no" label="SSS" autoFocus error={errors.sss_no}
                    value={form.sss_no} onChange={(e) => update('sss_no', e.target.value)} />
                <InputField name="philhealth_no" label="PhilHealth" error={errors.philhealth_no}
                    value={form.philhealth_no} onChange={(e) => update('philhealth_no', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                <InputField name="pagibig_no" label="Pag-IBIG" error={errors.pagibig_no}
                    value={form.pagibig_no} onChange={(e) => update('pagibig_no', e.target.value)} />
                <InputField name="tin" label="TIN" error={errors.tin}
                    value={form.tin} onChange={(e) => update('tin', e.target.value)} />
            </div>
        </div>
    )
}