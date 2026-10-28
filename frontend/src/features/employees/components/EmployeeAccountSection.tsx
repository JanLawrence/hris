import type { Employee } from "@/types/employee";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { capitalize } from "@/utils/text";
import { useState } from "react";
import { useCreateEmployeeAccount } from "../hooks/useEmployeeMutations";
import { toast } from "@/components/ui/toast";
import type { AxiosError } from "axios";
import type { Role } from "@/config/navigation";
import InputField from "@/components/form/InputField";
import SelectField from "@/components/form/SelectField";
import { Button } from "@/components/ui/button";

type Props = {
    employee: Employee
}

type AccountErrors = { username?: string; password?: string; role?: string }

const roleOptions = [
    {label: 'Employee', value: 'employee'},
    {label: 'HR', value: 'hr'},
]

export default function EmployeeAccountSection({ employee }: Props) {
    const account = employee.account

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<Role>('employee');
    const [errors, setErrors] = useState<AccountErrors>({})

    const createAccount = useCreateEmployeeAccount()

    
    const handleSave = () => {
        setErrors({})
        const toastId = toast.add({ type: 'loading', title: 'Creating account...'});

        createAccount.mutate(
            {
              id: employee.id,
              data: {username, password, role},
            },
            {
              onSuccess: () => {
                  toast.update(toastId, { type: 'success', title: 'Account created.' })
              },
              onError: (err) => {
                  const data = (err as AxiosError<Record<string, string[]>>).response?.data;
                  if (data) {
                      const newErrors: AccountErrors = {}
                      for (const field in data) {
                          newErrors[field as keyof AccountErrors] = data[field][0]
                      }
                      setErrors(newErrors)
    
                      toast.update(toastId, { type: 'error', title: 'Please check fields with error.' })
                  } else {
                      toast.update(toastId, { type: 'error', title: 'Failed to create account. Please try again.' })
                  }
              },
            }
          );
    }    
    
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
                    <div className="flex flex-col gap-5">
                        <p className="text-sm text-muted-foreground">
                            This employee doesn't have a login account yet.
                        </p>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-3">
                            <InputField name="username" label="Username" required error={errors.username}
                                value={username} onChange={(e) => setUsername(e.target.value)} />
                            <InputField type="password" name="password" label="Password" required error={errors.password}
                                description="At least 8 characters."
                                value={password} onChange={(e) => setPassword(e.target.value)} />
                            <SelectField
                                label="Role"
                                name="role"
                                options={roleOptions}
                                value={role}
                                onChange={(v) => setRole(v as Role)}
                                placeholder="Select Role"
                                error={errors.role}
                                required
                            />
                        </div>
                    </div>
                )}
            </CardContent>
            {!account && (
                <CardFooter className="justify-end">
                    <Button type="button" size="lg" onClick={handleSave} disabled={createAccount.isPending}>
                        {createAccount.isPending ? 'Creating...' : 'Create Account'}
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
}