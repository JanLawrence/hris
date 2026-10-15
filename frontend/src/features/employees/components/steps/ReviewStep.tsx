import { type ReactNode } from "react"

import { type EmployeeForm } from "@/features/employees/employeeForm";

import { Button } from "@/components/ui/button"
import type { Option } from "@/components/form/MultiSelect"
import { formatDate } from '@/utils/date';
import { Info } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { employmentTypeOptions, civilStatusOption, workSetupOption } from '@/features/employees/constants';

import { useDepartmentOptions } from '@/features/settings/hooks/useDepartments';
import { usePositionOptions } from '@/features/settings/hooks/usePositions';

const labelOf = (options: Option[], value: string) =>
    options.find((o) => o.value === value)?.label ?? ""

function ReviewSection({ title, onEdit, children }: { title: string; onEdit: () => void; children: ReactNode }) {
    return (
        <section className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">{title}</h3>
                <Button variant="link" size="sm" className="h-auto p-0" onClick={onEdit}>Edit</Button>
            </div>
            <dl className="grid grid-cols-[160px_1fr] gap-x-4 gap-y-2 text-sm">
                {children}
            </dl>
        </section>
    )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
    return (
        <>
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-medium whitespace-pre-line">{value || "—"}</dd>
        </>
    )
}

type Props = {
    form: EmployeeForm,
    sameAsPresent: boolean
    onEditStep: (step: number) => void

}

export default function ReviewStep({ form, sameAsPresent, onEditStep }: Props){

    const { options: departmentOptions } = useDepartmentOptions();
    const { options: positionOptions } = usePositionOptions();

    const fullName = [form.first_name, form.middle_name, form.last_name].filter(Boolean).join(" ")
    const initials = ((form.first_name[0] ?? "") + (form.last_name[0] ?? "")).toUpperCase()
    const departmentLabel = labelOf(departmentOptions, form.department)
    const positionLabel = labelOf(positionOptions, form.position)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <Avatar className="size-14">
                    <AvatarFallback className="text-lg font-semibold">{initials || "?"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 gap-y-0">
                    <span className="text-lg font-semibold leading-tight">{fullName || "—"}</span>
                    <span className="text-sm text-muted-foreground">
                        {[positionLabel, departmentLabel].filter(Boolean).join(" · ") || "No position or department yet"}
                    </span>
                    <div className="flex items-center gap-2 text-sm">
                        <Badge variant="secondary">{labelOf(employmentTypeOptions, form.employment_type)}</Badge>
                        {form.hire_date && (
                            <span className="text-muted-foreground">Starts {formatDate(form.hire_date)}</span>
                        )}
                    </div>
                </div>
            </div>

            <ReviewSection title="Basic info" onEdit={() => onEditStep(0)}>
                <ReviewRow label="Birth date" value={formatDate(form.birth_date)} />
                <ReviewRow label="Civil status" value={labelOf(civilStatusOption, form.civil_status)} />
                <ReviewRow label="Email" value={form.email} />
                <ReviewRow label="Mobile no." value={form.mobile_no} />
                <ReviewRow label="Present address" value={form.present_address} />
                <ReviewRow
                    label="Permanent address"
                    value={sameAsPresent ? "Same as present address" : form.permanent_address}
                />
            </ReviewSection>

            <ReviewSection title="Job" onEdit={() => onEditStep(1)}>
                <ReviewRow label="Department" value={departmentLabel} />
                <ReviewRow label="Position" value={positionLabel} />
                <ReviewRow label="Employment type" value={labelOf(employmentTypeOptions, form.employment_type)} />
                <ReviewRow label="Work setup" value={labelOf(workSetupOption, form.work_setup)} />
                <ReviewRow label="Hire date" value={formatDate(form.hire_date)} />
            </ReviewSection>

            <p className="flex items-start gap-2 rounded-md bg-muted p-3 text-sm text-muted-foreground">
                <Info className="mt-0.5 size-4 shrink-0" />
                Employee ID is assigned automatically after you create the record.
            </p>
        </div>
    )
}