import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { type Position } from '@/types/position'

import ActionButton from '@/components/table/ActionButton'
import type { AxiosError } from 'axios';
import { confirm } from '@/components/form/FormAlertDialog';
import { CirclePlus, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/toast';

import { usePositions } from "../hooks/usePositions";
import { useDeletePosition } from '../hooks/usePositionMutations';
import PositionFormSheet from '../components/PositionFormSheet'

export default function PositionPage() {
  const {data = [], isLoading, error} = usePositions();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Position | null>(null);

  const deletePosition = useDeletePosition()

  const openAdd = () => {
    setSheetOpen(true)
    setEditing(null)
  }

  const openEdit = (position: Position) => {
    setSheetOpen(true)
    setEditing(position)
  }

  const handleDelete = async (pos: Position) => {
    const ok = await confirm({
      title: 'Delete position?',
      description: `${pos.title} will be permanently deleted.`,
      icon: Trash2Icon,
      confirm_text: 'Delete',
    });
    if (!ok) return;

    const toastId = toast.add({ type: 'loading', title: 'Deleting position...' });

    deletePosition.mutate(pos.id, {
      onSuccess: () => {
        toast.update(toastId, { type: 'success', title: 'Position deleted.' });
      },
      onError: (err) => {
        const detail = (err as AxiosError<{ detail?: string }>).response?.data?.detail;
        toast.update(toastId, {
          type: 'error',
          title: detail ?? 'Failed to delete position.',
        });
      },
    });
  };

  return (
    <div className="space-y-1">
      <div className="overflow-hidden rounded-sm border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b-2 px-4 py-4 border-gray-200">
          <h2 className="font-semibold">Position</h2>
          <Button variant={'outline'} size={'lg'} className={'gap-1'} onClick={openAdd}>
            <CirclePlus /> Add Position
          </Button>
        </div>

        {isLoading && <p className="p-4 text-sm text-muted-foreground">Loading...</p>}
        {error && <p className="p-4 text-sm text-destructive">Failed to load positions.</p>}

        {!isLoading && !error && data.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground">No positions yet.</p>
        )}
        {!isLoading && !error && data.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>

            {data.map((pos) => (
                <TableRow key={pos.id} >
                  <TableCell>{pos.title}</TableCell>
                  <TableCell>
                    <Badge variant={pos.is_active ? 'default' : 'secondary'}>
                      {pos.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ActionButton onEdit={() => openEdit(pos)} onDelete={() => handleDelete(pos)} />
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
        )}

        <PositionFormSheet open={sheetOpen} onOpenChange={setSheetOpen} position={editing} />
      </div>
    </div>
  );
}
