export interface Employee {
    id: number;
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
    department: number | null;
    position: number | null;
    employment_type: string;
    work_setup: string;
    hire_date: string;
    is_active: boolean;
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
};