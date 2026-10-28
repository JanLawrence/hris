import type { Employee } from "@/types/employee";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { capitalize } from "@/utils/text";

type Props = {
    employee: Employee
}


export default function EmployeeAccountSection({ employee }: Props) {
    const account = employee.account

    return (
        <Card className="mx-6 my-5">
            <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Login access to the HRIS.</CardDescription>
            </CardHeader>
            <CardContent>
                {account ? (
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{account.username}</span>
                        <Badge variant="secondary">{capitalize(account.role)}</Badge>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        This employee doesn't have a login account yet.
                    </p>
                )}
            </CardContent>
        </Card>
    )
}