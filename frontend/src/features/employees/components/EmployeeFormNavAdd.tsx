import { useState } from "react"
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
import { MoveLeft, Check } from "lucide-react"
import { cn } from "cn"
import { toast } from '@/components/ui/toast';

import { useSaveEmployee } from "../hooks/useEmployeeMutations"

import { formToPayload, INITIAL_FORM, type EmployeeForm, type FieldErrors, STEP_FIELDS, validateStep } from "../employeeForm";

import BasicInfoStep from "./steps/BasicInfoStep";
import JobStep from "./steps/JobStep";
import ReviewStep from "./steps/ReviewStep";
import GovIdsStep from "./steps/GovIdsStep";

const STEPS = [
    { title: "Basic info", subtitle: "Name, birthdate, contact" },
    { title: "Job", subtitle: "Position, department, hired date" },
    { title: "Government", subtitle: "Government ID Details" },
    { title: "Review", subtitle: "Check and create" },
]


export default function EmployeeFormNavAdd(){
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0)
    const saveEmployee = useSaveEmployee()

    const [form, setForm] = useState(INITIAL_FORM)
    const [errors, setErrors] = useState<FieldErrors>({})


    const [sameAsPresent, setSameAsPresent] = useState(false)

    const isLast = current === STEPS.length - 1

    const update = (field: keyof EmployeeForm, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }))
        setErrors((prev) => ({...prev, [field]: undefined }))
    }

    const handleSameAsPresent = (checked: boolean) => {
        setSameAsPresent(checked)
        if (checked) {
            update('permanent_address', form.present_address)
        }
    }

    const handleNext = () => {
        const newErrors = validateStep(current, form)
        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) {
            return;
        }
        setCurrent(current + 1)
        
    }

    const handleCreate = () => {
        const payload = formToPayload(form);

        setErrors({})

        const toastId = toast.add({ type: 'loading', title: 'Saving employee...'});
      
        saveEmployee.mutate(
          {
            data: payload,
          },
          {
            onSuccess: () => {
                toast.update(toastId, { type: 'success', title: 'Employee saved.' })
                navigate('/employees')
            },
            onError: (err) => {
                const data = (err as AxiosError<Record<string, string[]>>).response?.data;
                if (data) {
                    const newErrors: FieldErrors = {}
                    for (const field in data) {
                        newErrors[field as keyof EmployeeForm] = data[field][0]
                    }
                    setErrors(newErrors)
                    const errorStep = STEP_FIELDS.findIndex((fields) => fields.some((f) => f in newErrors))
                    if (errorStep !== -1) {
                        setCurrent(errorStep)
                    }

                    toast.update(toastId, { type: 'error', title: 'Please check fields with error.' })
                } else {
                    toast.update(toastId, { type: 'error', title: 'Failed to save employee. Please try again.' })
                }
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
                    Only the essentials here. Documents and other details can be added on the profile after creating.
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
                            <BasicInfoStep
                                form={form}
                                errors={errors}
                                update={update}
                                sameAsPresent={sameAsPresent}
                                onSameAsPresentChange={handleSameAsPresent}
                            />
                        )}

                        {current === 1 && (
                            <JobStep
                                form={form}
                                errors={errors}
                                update={update}
                            />
                        )}

                        {current === 2 && (
                            <GovIdsStep 
                                form={form}
                                errors={errors}
                                update={update}
                            />
                        )}
                        {current === 3 && (
                            <ReviewStep form={form} sameAsPresent={sameAsPresent} onEditStep={setCurrent} />
                        )}
                    </CardContent>

                    <CardFooter className="justify-between">
                        {current > 0 ? (
                            <Button variant="outline" size="lg" onClick={() => setCurrent(current - 1)}>← Back</Button>
                        ) : (
                            <span />
                        )}
                        <Button size="lg" disabled={saveEmployee.isPending} onClick={() => isLast ? handleCreate() : handleNext()}>
                            { saveEmployee.isPending ? 'Saving...' : (isLast ? "Create employee" : "Next →")}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>

    )
}

