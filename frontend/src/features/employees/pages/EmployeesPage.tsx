import InputField from '@/components/form/InputField'
import MultiSelectField from '@/components/form/MultiSelectField'
import { Button } from '@/components/ui/button';
import { ButtonGroup } from "@/components/ui/button-group"
import { CirclePlus } from 'lucide-react'
import { employmentTypeOptions } from '../constants';
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

export default function EmployeesPage() {

  const navigate = useNavigate();

  const { options: departmentOptions, isLoading: isLoadingOptions } = useDepartmentOptions();

  
  const [department, setDepartment] = useState<string[]>([]);
  const [employmentType, setEmploymentType] = useState<string[]>([]);

 
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
          <Button variant={"outline"} size={"lg"}>Active</Button>
          <Button variant={"outline"} size={"lg"}>Separated</Button>
          <Button variant={"outline"} size={"lg"}>All</Button>
        </ButtonGroup>
        </div>
      </header>
      <div className="mx-5 my-5 overflow-hidden rounded-sm border border-gray-200 bg-white">
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
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>EMP-00002</TableCell>
              <TableCell>Jan Tolentino</TableCell>
              <TableCell>Full Stack Engineer</TableCell>
              <TableCell>IT</TableCell>
              <TableCell>Regular</TableCell>
              <TableCell>Oct 2022</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  )
}