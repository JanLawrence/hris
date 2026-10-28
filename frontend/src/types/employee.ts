import type { AuthUser } from "@/types/auth"

export interface Employee {
    id: number;
    full_name: string
    employee_no: string;
    first_name: string; 
    middle_name: string;
    last_name: string;
    birth_date: string; 
    civil_status: string; 
    email: string;
    mobile_no: string; 
    present_address: string;
    permanent_address: string;
    department_name: string | null;
    department: number | null;
    position_title: string | null;
    position: number | null;
    employment_type: string;
    employment_type_display: string;
    work_setup: string;
    hire_date: string;
    sss_no: string;
    philhealth_no: string;
    pagibig_no: string;
    tin: string;
    emergency_contact_name: string;
    emergency_contact_relationship: string;
    emergency_contact_mobile: string;
    regular_date: string | null;
    reports_to_name: string | null;
    reports_to: number | null;
    is_active: boolean;
    account: AuthUser | null;
}

export type EmployeePayload = {
    first_name: string; 
    middle_name: string;
    last_name: string;
    birth_date: string; 
    civil_status: string; 
    email: string;
    mobile_no: string; 
    present_address: string;
    permanent_address: string;
    department: number | null;
    position: number | null;
    employment_type: string;
    work_setup: string;
    hire_date: string;
    sss_no: string;
    philhealth_no: string;
    pagibig_no: string;
    tin: string;
    emergency_contact_name: string;
    emergency_contact_relationship: string;
    emergency_contact_mobile: string;
    regular_date: string | null;
    reports_to: number | null;
};

export type EmployeeFilters = {
    status?: string;
    employment_type?: string;
    department?: string;
    search?: string;
}
