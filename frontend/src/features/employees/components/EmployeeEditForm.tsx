import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { AxiosError } from 'axios';
import { type Employee } from "@/types/employee"
import { employeeToForm, formToPayload, STEP_FIELDS, type EmployeeForm, type FieldErrors, validateStep } from "../employeeForm"
import BasicInfoStep from "./steps/BasicInfoStep"
import JobStep from "./steps/JobStep"

import {
    TabsContent,
} from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { toast } from '@/components/ui/toast';

import { useSaveEmployee } from "../hooks/useEmployeeMutations"
import GovIdsStep from "./steps/GovIdsStep";
import EmergencyContactFields from "./EmergencyContactFields";

type Props = {
    employee: Employee
    onErrorStep: (step: number) => void
}

export default function EmployeeEditForm({ employee, onErrorStep }: Props) {

    const saveEmployee = useSaveEmployee()
    const navigate = useNavigate();

    const [form, setForm] = useState(() => employeeToForm(employee))
    const [errors, setErrors] = useState<FieldErrors>({})
    const [sameAsPresent, setSameAsPresent] = useState(
        employee.present_address !== "" && employee.present_address === employee.permanent_address
    )

    const update = (field: keyof EmployeeForm, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }))
        setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    const handleSameAsPresent = (checked: boolean) => {
        setSameAsPresent(checked)
        if (checked) {
            update("permanent_address", form.present_address)
        }
    }

    const showErrors = (newErrors: FieldErrors) => {
        setErrors(newErrors)
        const errorStep = STEP_FIELDS.findIndex((fields) => fields.some((f) => f in newErrors))
        if (errorStep !== -1) {
            onErrorStep(errorStep)
        }
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()

        const newErrors = {
            ...validateStep(0, form),
            ...validateStep(1, form),
        }

        if (Object.keys(newErrors).length > 0) {
            showErrors(newErrors)
            return
        }
    
        const payload = formToPayload(form)

        const toastId = toast.add({ type: 'loading', title: 'Updating employee...'});

        saveEmployee.mutate(
            {
              id: employee.id,
              data: payload,
            },
            {
              onSuccess: () => {
                  toast.update(toastId, { type: 'success', title: 'Employee updated.' })
                  navigate('/employees')
              },
              onError: (err) => {
                  const data = (err as AxiosError<Record<string, string[]>>).response?.data;
                  if (data) {
                      const newErrors: FieldErrors = {}
                      for (const field in data) {
                          newErrors[field as keyof EmployeeForm] = data[field][0]
                      }
                      showErrors(newErrors)
  
                      toast.update(toastId, { type: 'error', title: 'Please check fields with error.' })
                  } else {
                      toast.update(toastId, { type: 'error', title: 'Failed to update employee. Please try again.' })
                  }
              },
            }
          );
    }

    return (
        <form id="employee-edit-form" onSubmit={handleSave}>
            <TabsContent value="personal">
                <Card className="mx-6 my-5">
                    <CardHeader>
                        <CardTitle>Personal</CardTitle>
                        <CardDescription>Basic personal information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-y-6">
                            <BasicInfoStep
                                form={form}
                                errors={errors}
                                update={update}
                                sameAsPresent={sameAsPresent}
                                onSameAsPresentChange={handleSameAsPresent}
                            />
                            <EmergencyContactFields form={form} errors={errors} update={update} />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="employment">
                <Card className="mx-6 my-5">
                    <CardHeader>
                        <CardTitle>Employment</CardTitle>
                        <CardDescription>Position, department and employment details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <JobStep
                            form={form}
                            errors={errors}
                            update={update}
                        />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="government">
                <Card className="mx-6 my-5">
                    <CardHeader>
                        <CardTitle>Government</CardTitle>
                        <CardDescription>Government ID details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <GovIdsStep
                            form={form}
                            errors={errors}
                            update={update}
                        />
                    </CardContent>
                </Card>
            </TabsContent>
       </form>
    )
}
