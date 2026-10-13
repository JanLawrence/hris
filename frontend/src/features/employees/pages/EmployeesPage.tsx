import InputField from '@/components/form/InputField'
import MultiSelectField from '@/components/form/MultiSelectField'
import { formatDate } from '@/utils/date';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from "@/components/ui/button-group"
import { Badge } from '@/components/ui/badge';
import ActionButton from '@/components/table/ActionButton';
import { employmentTypeOptions } from '../constants';
import { CirclePlus, Trash2Icon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDepartmentOptions } from '@/features/settings/hooks/useDepartments';
import { useEmployees } from '../hooks/useEmployees';
import type { Employee } from '@/types/employee';

export default function EmployeesPage() {

  const navigate = useNavigate();

  const { options: departmentOptions, isLoading: isLoadingOptions } = useDepartmentOptions();
  
  const [department, setDepartment] = useState<string[]>([]);
  const [employmentType, setEmploymentType] = useState<string[]>([]);
  const [status, setStatus] = useState("active")
  
  const { data = [], isLoading, error } = useEmployees({ status });
  const openEdit = (emp: Employee) => {
    return
  }
  const handleDelete = async (emp: Employee) => {
    return
  }

 
  return (
    <>
      <header className="h-14 border-b flex items-center justify-between px-6 bg-white">
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-md">Employees</h1>
        </div>
        <Button variant={'default'} size={'lg'} className={'gap-1'}  onClick={() => navigate('/employees/form/add')}><CirclePlus /> Add Employee</Button>
      </header>
      <header className="border-b border-gray-200 flex items-center justify-between px-6 py-5 bg-[#fafaf8]">
        <div className="grid w-full max-w-4xl grid-cols-[3fr_1fr_1fr] gap-4">
          <InputField name="Search" label="Search" />
          <MultiSelectField
            label="Department"
            name="deparment"
            options={departmentOptions}
            value={department}
            onChange={setDepartment}
            loading={isLoadingOptions}
            placeholder="Select Department"
          />
          <MultiSelectField
            label="Employment Type"
            name="employement_type"
            options={employmentTypeOptions}
            value={employmentType}
            onChange={setEmploymentType}
            placeholder="Select Employment Type"
          />
        </div>
        <div>
        <ButtonGroup>
          <Button variant={status === "active" ? "default" : "outline"} size={"lg"} onClick={() => setStatus("active")}>Active</Button>
          <Button variant={status === "inactive" ? "default" : "outline"} size={"lg"} onClick={() => setStatus("inactive")}>Inactive</Button>
          <Button variant={status === "all" ? "default" : "outline"} size={"lg"} onClick={() => setStatus("all")}>All</Button>
        </ButtonGroup>
        </div>
      </header>
      <div className="mx-5 my-5 overflow-hidden rounded-sm border border-gray-200 bg-white">

        {isLoading && <p className="p-4 text-sm text-muted-foreground">Loading...</p>}
        {error && <p className="p-4 text-sm text-destructive">Failed to load employees.</p>}

        {!isLoading && !error && data.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground">No employees yet.</p>
        )}

        {!isLoading && !error && data.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date Hired</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.employee_no}</TableCell>
                  <TableCell>{emp.full_name}</TableCell>
                  <TableCell>{emp.position_title || '—'}</TableCell>
                  <TableCell>{emp.department_name || '—'}</TableCell>
                  <TableCell>{emp.employment_type_display}</TableCell>
                  <TableCell>{formatDate(emp.hire_date)}</TableCell>
                  <TableCell>
                    <Badge variant={emp.is_active ? 'default' : 'secondary'}>
                      {emp.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionButton onEdit={() => openEdit(emp)} onDelete={() => handleDelete(emp)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  )
}