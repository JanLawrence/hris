import type { Employee, EmployeePayload } from "@/types/employee"

export const INITIAL_FORM = {
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
}

export const REQUIRED_FIELDS: (keyof EmployeeForm)[] = [
    "first_name", "last_name", "birth_date", "civil_status", "email", "mobile_no", "present_address", "permanent_address",
    "department", "position", "employment_type", "work_setup", "hire_date"
]

export const STEP_FIELDS: (keyof EmployeeForm)[][] = [
    ["first_name", "middle_name", "last_name", "birth_date", "civil_status", "email", "mobile_no", "present_address", "permanent_address"],
    ["department", "position", "employment_type", "work_setup", "hire_date"],
]

export type EmployeeForm = typeof INITIAL_FORM
export type FieldErrors = Partial<Record<keyof EmployeeForm, string>>

export function validateStep(step: number, form: EmployeeForm): FieldErrors {
    const errors: FieldErrors = {}

    for (const field of STEP_FIELDS[step]) {
        const isFieldRequired = REQUIRED_FIELDS.includes(field);

        if (isFieldRequired && !form[field].trim()) {
            errors[field] = 'This field is required.';
        }
    }

    if (step === 0) {
        if (!errors.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
            errors.email = 'Enter a valid email address.'
        } 
        if (!errors.mobile_no && !/^09\d{9}$/.test(form.mobile_no)){
            errors.mobile_no = 'Enter a valid mobile number. e.g. 09177461299'
        }
    }

    return errors
}

export function employeeToForm(employee: Employee): EmployeeForm {
    return {
        first_name: employee.first_name, 
        middle_name: employee.middle_name, 
        last_name: employee.last_name, 
        birth_date: employee.birth_date, 
        civil_status: employee.civil_status, 
        email: employee.email, 
        mobile_no: employee.mobile_no, 
        present_address: employee.present_address,
        permanent_address: employee.permanent_address,
        department: employee.department ? String(employee.department) : "",
        position: employee.position ? String(employee.position) : "",
        employment_type: employee.employment_type,
        work_setup: employee.work_setup,
        hire_date: employee.hire_date,
    }
}

export function formToPayload(form: EmployeeForm): EmployeePayload {
    return {
        ...form,
        department: form.department ? Number(form.department) : null,
        position: form.position ? Number(form.position) : null,
    }
}