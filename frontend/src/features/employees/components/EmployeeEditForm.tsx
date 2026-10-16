import { useState } from "react"
import { type Employee } from "@/types/employee"
import { employeeToForm, formToPayload, type EmployeeForm, type FieldErrors } from "../employeeForm"
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

type Props = {
    employee: Employee
}

export default function EmployeeEditForm({ employee }: Props) {
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

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        const payload = formToPayload(form)
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
                        <BasicInfoStep
                            form={form}
                            errors={errors}
                            update={update}
                            sameAsPresent={sameAsPresent}
                            onSameAsPresentChange={handleSameAsPresent}
                        />

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
       </form>
    )
}
