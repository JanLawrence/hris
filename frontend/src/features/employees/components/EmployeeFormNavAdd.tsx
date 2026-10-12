import { useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import type { AxiosError } from 'axios';
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoveLeft, Check, Info } from "lucide-react"
import { cn } from "cn"
import { format, parseISO } from "date-fns"
import InputField from "@/components/form/InputField"
import DatePickerField from "@/components/form/DatePickerField"
import SelectField from "@/components/form/SelectField"
import TextareaField from "@/components/form/TextareaField"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Option } from "@/components/form/MultiSelect"
import { toast } from '@/components/ui/toast';

import { useDepartmentOptions } from '@/features/settings/hooks/useDepartments';
import { usePositionOptions } from '@/features/settings/hooks/usePositions';

import { employmentTypeOptions, civilStatusOption, workSetupOption } from '../constants';
import type { EmployeePayload } from "@/types/employee"
import { useSaveEmployee } from "../hooks/useEmployeeMutations"

const STEPS = [
    { title: "Basic info", subtitle: "Name, birthdate, contact" },
    { title: "Job", subtitle: "Position, department, hired date" },
    { title: "Review", subtitle: "Check and create" },
]

const labelOf = (options: Option[], value: string) =>
    options.find((o) => o.value === value)?.label ?? ""

const formatDate = (value: string) =>
    value ? format(parseISO(value), "MMM d, yyyy") : ""


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

export default function EmployeeFormNavAdd(){
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0)
    const saveEmployee = useSaveEmployee()

    const { options: departmentOptions, isLoading: isLoadingDepartmentOptions } = useDepartmentOptions();
    const { options: positionOptions, isLoading: isLoadingPositionOptions } = usePositionOptions();

    const [form, setForm] = useState({
        first_name: "", 
        middle_name: "", 
        last_name: "", 
        birth_date: "", 
        civil_status: "single", 
        email: "", 
        mobile_no: "", 
        present_address: "",
        permanent_address: "",
        department: "",
        position: "",
        employment_type: "probationary",
        work_setup: "onsite",
        hire_date: "",
    })

    const [sameAsPresent, setSameAsPresent] = useState(false)

    const fullName = [form.first_name, form.middle_name, form.last_name].filter(Boolean).join(" ")
    const initials = ((form.first_name[0] ?? "") + (form.last_name[0] ?? "")).toUpperCase()
    const departmentLabel = labelOf(departmentOptions, form.department)
    const positionLabel = labelOf(positionOptions, form.position)

    const isLast = current === STEPS.length - 1

    const update = (field: keyof typeof form, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }))

    const handleSameAsPresent = (checked: boolean) => {
        setSameAsPresent(checked)
        if (checked) {
            update('permanent_address', form.present_address)
        }
    }

    const handleCreate = () => {
        const payload: EmployeePayload = {
            ...form,
            department: form.department ? Number(form.department) : null,
            position: form.position ? Number(form.position) : null,
        }

        const toastId = toast.add({ type: 'loading', title: 'Saving employee...'});
      
        saveEmployee.mutate(
          {
            // id: null,
            data: payload,
          },
          {
            onSuccess: () => {
                toast.update(toastId, { type: 'success', title: 'Employee saved.' })
                navigate('/employees')
            },
            onError: (err) => {
                const data = (err as AxiosError<Record<string, string[]>>).response?.data;
                toast.update(toastId, { type: 'error', title: 'Failed to save employee. Please try again.' })
                // if (data?.name || data?.code) {
                //     toast.close(toastId);
                //     setErrors({
                //         name: capitalize(data.name?.[0]),
                //         code: capitalize(data.code?.[0]),
                //     });
                // } else {
                //     toast.update(toastId, { type: 'error', title: 'Failed to save employee. Please try again.' })
                // }
            },
          }
        );
    }


    return (
        <div className="flex min-h-screen flex-col bg-[#f4f4f1]">
            {/* HEADER */}
            <header className="flex flex-col gap-3 border-b bg-white px-6 py-4">
                <Button variant={'default'} size={'sm'} className={'self-start mb-4 gap-1'} onClick={() => navigate('/employees')}><MoveLeft />Back</Button>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex size-14 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-xl text-gray-500">
                        +
                        </div>
                        <div>
                        <h1 className="text-xl flex font-semibold gap-2">
                            <span>New Employee</span>
                            <Badge variant="secondary" className="self-center">Draft · not saved</Badge>
                        </h1>
                        <p className="text-sm text-muted-foreground">Employee ID is assigned automatically when you create the record</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* BODY */}
            <div className="flex flex-1 gap-5 p-4">
                <aside className="flex w-60 shrink-0 flex-col gap-2">
                {STEPS.map((s, i) => {
                    const status = i < current ? "done" : i === current ? "current" : "upcoming"

                    return (
                        <button
                            key={s.title}
                            type="button"
                            disabled={i > current}
                            onClick={() => setCurrent(i)}
                            className={cn(
                                "flex items-center gap-3 rounded-lg border bg-white px-3 py-2.5 text-left",
                                status === "current" && "border-indigo-600 bg-indigo-50",
                            )}
                        >
                        <span
                            className={cn(
                            "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                            status === "done" && "bg-green-800 text-white",
                            status === "current" && "bg-indigo-700 text-white",
                            status === "upcoming" && "bg-gray-100 text-gray-600",
                            )}
                        >
                            {status === "done" ? <Check className="size-3.5" /> : i + 1}
                        </span>
                        <span className="flex flex-col">
                            <span className="text-sm font-medium">{s.title}</span>
                            <span className="text-xs text-muted-foreground">{s.subtitle}</span>
                        </span>
                        </button>
                    )
                    })}
                <p className="mt-2 rounded-md border border-dashed border-gray-300 p-3 text-xs text-muted-foreground">
                    Only the essentials here. Gov't IDs, documents and other details are filled in on the profile after creating.
                </p>
                </aside>

                <Card className="flex flex-1 flex-col">
                    <CardHeader>
                        <CardTitle>{STEPS[current].title}</CardTitle>
                    </CardHeader>
                    
                    {/* FORM CONTENT */}
                    <CardContent className="flex flex-1 flex-col gap-y-5">
                        {/* <pre>{JSON.stringify(form, null, 2)}</pre> */}
                        { current === 0 && (
                            <div className="flex flex-col gap-y-5">
                                <div className="grid grid-cols-3 gap-x-4 gap-y-5">
                                    <InputField name="first_name" label="First Name" autoFocus required={true}
                                        value={form.first_name} onChange={(e) => update('first_name', e.target.value)} />
                                    <InputField name="middle_name" label="Middle Name"
                                        value={form.middle_name} onChange={(e) => update('middle_name', e.target.value)} />
                                    <InputField name="last_name" label="Last Name" required={true}
                                        value={form.last_name} onChange={(e) => update('last_name', e.target.value)} />
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                                    <DatePickerField label="Birth Date" name="birth_date" required
                                        value={form.birth_date ? parseISO(form.birth_date) : undefined}
                                        onChange={(date) => update('birth_date', date ? format(date, 'yyyy-MM-dd') : '')}
                                        maxDate={new Date()} />
                                    <SelectField
                                        label="Civil Status"
                                        name="civil_status"
                                        options={civilStatusOption}
                                        value={form.civil_status}
                                        onChange={(v) => update('civil_status', v)}
                                        placeholder="Select Civil Status"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                                    <InputField name="email" label="Email" required={true} type="email"
                                        value={form.email} onChange={(e) => update('email', e.target.value)} />
                                    <InputField name="mobile_no" label="Mobile No." required={true}
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
                                        />
                                        <label className="mt-2 flex items-center gap-2 text-xs">
                                            <Checkbox checked={sameAsPresent} onCheckedChange={handleSameAsPresent} />
                                            Same as present address
                                        </label>
                                    </div>
                                    <div>
                                        <TextareaField name="permanent_address" label="Permanent Address" required={true} rows={5} disabled={sameAsPresent}
                                            value={form.permanent_address} onChange={(e) => update('permanent_address', e.target.value)} />
                                        
                                    </div>
                                </div>
                            </div>
                        )}

                        {current === 1 && (
                            <>
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
                                    />
                                    <SelectField
                                        label="Work Setup"
                                        name="work_setup"
                                        options={workSetupOption}
                                        value={form.work_setup}
                                        onChange={(v) => update('work_setup', v)}
                                        placeholder="Select Work Setup"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2  gap-x-4 gap-y-5">
                                    <DatePickerField label="Hire Date" name="hire_date" required
                                        value={form.hire_date ? parseISO(form.hire_date) : undefined}
                                        onChange={(date) => update('hire_date', date ? format(date, 'yyyy-MM-dd') : '')} />
                                </div>
                            </>
                        )}

                        {current === 2 && (
                            <div className="flex flex-col gap-4">
                                {/* Summary */}
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

                                <ReviewSection title="Basic info" onEdit={() => setCurrent(0)}>
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

                                <ReviewSection title="Job" onEdit={() => setCurrent(1)}>
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
                        )}
                    </CardContent>

                    <CardFooter className="justify-between">
                        {current > 0 ? (
                            <Button variant="outline" size="lg" onClick={() => setCurrent(current - 1)}>← Back</Button>
                        ) : (
                            <span />
                        )}
                        <Button size="lg" disabled={saveEmployee.isPending} onClick={() => isLast ? handleCreate() : setCurrent(current + 1)}>
                            { saveEmployee.isPending ? 'Saving...' : (isLast ? "Create employee" : "Next →")}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>

    )
}

