import { useState, type SubmitEvent } from "react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"
import InputField from "@/components/form/InputField"
import { toast } from '@/components/ui/toast';
import { useAuth } from "../AuthContext"

type FieldErrors = { username?: string; password?: string };

function validate(username: string, password: string): FieldErrors {
    const errors: FieldErrors = {};
  
    if (!username.trim()) {
        errors.username = 'Please input your username';
    }
  
    if (!password.trim()) {
        errors.password = 'Please input your password';
    }

    return errors;
}


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

    const auth = useAuth()  
    const navigate = useNavigate();
    const location = useLocation()
    const from = (location.state as { from?: string } | null)?.from ?? "/dashboard"

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<FieldErrors>({});

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
      
        const newErrors = validate(username, password);
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;
      
        const toastId = toast.add({ type: 'loading', title: 'Logging in...'});
        
        try {
            await auth.login(username, password);
            toast.update(toastId, { type: 'success', title: 'Logged in' })
            navigate(from, { replace: true })
        } catch {
            toast.update(toastId, { type: 'error', title: 'Invalid credentials, please try again.' })
        }

      };
    

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
            <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>
                Login to your HRIS account
            </CardDescription>
            </CardHeader>
            <CardContent>
            <form id="loginForm" onSubmit={handleSubmit} noValidate> 
                <FieldGroup>
                    <InputField name="username" label="Username" autoFocus required={true}
                        value={username} onChange={(e) => setUsername(e.target.value)} error={errors.username} />
                    <InputField name="password" label="Password" required={true} type="password"
                        value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
                
                <Field>
                    <Button type="submit">Login</Button>
                    <FieldDescription className="text-center">
                    <a
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                        Forgot your password?
                    </a>
                    </FieldDescription>
                </Field>
                </FieldGroup>
            </form>
            </CardContent>
        </Card>
        <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
            and <a href="#">Privacy Policy</a>.
        </FieldDescription>
        </div>
    )
}
