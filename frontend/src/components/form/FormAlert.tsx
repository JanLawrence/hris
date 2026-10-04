import { CircleAlert } from 'lucide-react';

interface FormAlertProps {
  message?: string;
}

export default function FormAlert({ message }: FormAlertProps) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
      <CircleAlert className="size-4 shrink-0" />
      {message}
    </div>
  );
}