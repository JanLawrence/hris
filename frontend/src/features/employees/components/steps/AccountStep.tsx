import InputField from "@/components/form/InputField"
import { roleOptions } from "@/features/employees/constants";
import type { AccountPayload } from "@/types/auth";
import SwitchField from "@/components/form/SwitchField";
import SelectField from "@/components/form/SelectField";
import type { AccountErrors } from "../../employeeForm";

type Props = {
    withAccount: boolean,
    onWithAccountChange: (value: boolean) => void,
    account: AccountPayload,
    errors: AccountErrors,
    update: (field: keyof AccountPayload, value: string) => void
}


export default function AccountStep({ withAccount, onWithAccountChange, account, errors, update }: Props) {
    return (
        <div className="flex flex-col gap-y-5">
            <SwitchField
                name="has_account"
                label="Create login account"
                checked={withAccount}
                onCheckedChange={onWithAccountChange}
                description="You can also add this later from the employee's Account tab."
            />
            {withAccount && (
                <div className="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-3">
                    <InputField name="username" label="Username" required error={errors.username}
                        value={account.username} onChange={(e) => update('username', e.target.value)} />
                    <InputField type="password" name="password" label="Password" required error={errors.password}
                        description="At least 8 characters."
                        value={account.password} onChange={(e) => update('password', e.target.value)} />
                    <SelectField
                        label="Role"
                        name="role"
                        options={roleOptions}
                        value={account.role}
                        onChange={(v) => update('role', v)} 
                        placeholder="Select Role"
                        error={errors.role}
                        required
                    />
                </div>
            )}
        </div>
    )
}