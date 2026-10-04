import { useState } from 'react';
import type { AxiosError } from 'axios';
import { CirclePlus, Trash2Icon } from 'lucide-react';
import { confirm } from '@/components/form/FormAlertDialog';
import ActionButton from '@/components/table/ActionButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { toast } from '@/components/ui/toast';
import type { Department } from '@/types/department';
import DepartmentFormSheet from '../components/DepartmentFormSheet';
import { useDeleteDepartment } from '../hooks/useDepartmentMutations';
import { useDepartments } from '../hooks/useDepartments';

export default function DepartmentPage() {
  const { data = [], isLoading, error } = useDepartments();
  const deleteDepartment = useDeleteDepartment();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);

  const openAdd = () => {
    setEditing(null);
    setSheetOpen(true);
  };

  const openEdit = (dept: Department) => {
    setEditing(dept);
    setSheetOpen(true);
  };

  const handleDelete = async (dept: Department) => {
    const ok = await confirm({
      title: 'Delete department?',
      description: `${dept.name} will be permanently deleted.`,
      icon: Trash2Icon,
      confirm_text: 'Delete',
    });
    if (!ok) return;

    const toastId = toast.add({ type: 'loading', title: 'Deleting department...' });

    deleteDepartment.mutate(dept.id, {
      onSuccess: () => {
        toast.update(toastId, { type: 'success', title: 'Department deleted.' });
      },
      onError: (err) => {
        const detail = (err as AxiosError<{ detail?: string }>).response?.data?.detail;
        toast.update(toastId, {
          type: 'error',
          title: detail ?? 'Failed to delete department.',
        });
      },
    });
  };

  return (
    <div className="overflow-hidden rounded-sm border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b-2 border-gray-200 p-4">
        <h2 className="font-semibold">Department</h2>
        <Button variant="outline" size="lg" className="gap-1" onClick={openAdd}>
          <CirclePlus /> Add Department
        </Button>
      </div>

      {isLoading && <p className="p-4 text-sm text-muted-foreground">Loading...</p>}
      {error && <p className="p-4 text-sm text-destructive">Failed to load departments.</p>}

      {!isLoading && !error && data.length === 0 && (
        <p className="p-4 text-sm text-muted-foreground">No departments yet.</p>
      )}

      {!isLoading && !error && data.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((dept) => (
              <TableRow key={dept.id}>
                <TableCell>{dept.name}</TableCell>
                <TableCell>{dept.code}</TableCell>
                <TableCell>
                  <Badge variant={dept.is_active ? 'default' : 'secondary'}>
                    {dept.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <ActionButton onEdit={() => openEdit(dept)} onDelete={() => handleDelete(dept)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <DepartmentFormSheet open={sheetOpen} onOpenChange={setSheetOpen} department={editing} />
    </div>
  );
}