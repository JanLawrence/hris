import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
    Avatar,
    AvatarFallback
} from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { MoveLeft } from "lucide-react"
import { cn } from "cn"
import { getInitials } from "@/utils/text"
import { useEmployee } from "../hooks/useEmployees"
import EmployeeEditForm from "./EmployeeEditForm"
import EmployeeAccountSection from "./EmployeeAccountSection"

const STEPS = ["personal", "employment", "government", "account"] as const
type Step = (typeof STEPS)[number]

const triggerClass =
  "h-auto flex-none px-4 py-3 text-base " +
  "after:bg-black group-data-horizontal/tabs:after:h-1 group-data-horizontal/tabs:after:-bottom-px"

export default function EmployeeFormNav(){
    const navigate = useNavigate();
    const { id } = useParams()
    const { data: employee, isLoading } = useEmployee(Number(id))

    const [step, setStep] = useState<Step>("personal")


    return (
        <Tabs value={step} onValueChange={(value) => setStep(value as Step)}>
            <header className="border-b border-gray-200 flex flex-col gap-3 px-10 pt-6 bg-[#ffffff]">
                <Button variant={'default'} size={'sm'} className={'self-start mb-4 gap-1'} onClick={() => navigate('/employees')}><MoveLeft />Back</Button>
                <div className="flex justify-between">
                    {isLoading ? (
                        <div className="flex items-center gap-3 mb-6">
                            <Skeleton className="size-14 rounded-full" />
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-8 w-48" />
                                    <Skeleton className="h-5 w-24 rounded-full" />
                                </div>
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                    ) : employee ? (
                        <div className="flex items-center gap-3 mb-6">
                            <Avatar className="size-14">
                                <AvatarFallback>{getInitials(employee.full_name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-medium">{employee.full_name}</span>
                                    <Badge
                                        className={cn(
                                            employee.is_active
                                                ? "bg-green-100 text-green-700"
                                                : "bg-muted text-muted-foreground",
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "size-1.5 rounded-full",
                                                employee.is_active ? "bg-green-600" : "bg-muted-foreground",
                                            )}
                                        />
                                        {employee.is_active ? "Active" : "Inactive"} · {employee.employment_type_display}
                                    </Badge>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {employee.position_title ?? "No position"}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="mb-6 text-sm text-destructive">Employee not found.</p>
                    )}
                    <div className="flex items-center gap-3 mb-7">
                        {step !== "account" && (
                            <Button type="submit" form="employee-edit-form" variant={'default'} size={'lg'} className={'gap-1'}>Save Changes</Button>
                        )}

                    </div>
                </div>
                <TabsList variant="line" className="group-data-horizontal/tabs:h-auto p-0 gap-2">
                    <TabsTrigger value="personal" className={triggerClass}>Personal</TabsTrigger>
                    <TabsTrigger value="employment" className={triggerClass}>Employment</TabsTrigger>
                    <TabsTrigger value="government" className={triggerClass}>Government</TabsTrigger>
                    <TabsTrigger value="account" className={triggerClass}>Account</TabsTrigger>
                </TabsList>
            </header>

            {employee && <EmployeeEditForm employee={employee} onErrorStep={(i) => setStep(STEPS[i])} />}
            {employee && (
                <TabsContent value="account">
                    <EmployeeAccountSection employee={employee} />
                </TabsContent>
            )}
            
        </Tabs>
    )
}
