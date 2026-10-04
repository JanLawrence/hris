import { useSyncExternalStore } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CircleFadingPlusIcon, type LucideIcon } from "lucide-react"


interface ConfirmOptions {
    title?: string;
    description: string;
    icon?: LucideIcon;
    confirm_text?: string;
    cancel_text?: string;
}

interface ConfirmState {
    open: boolean;
    options: ConfirmOptions;
    resolve?: (value: boolean) => void;
}

let state: ConfirmState = { open: false, options: { description: '' } };
const listeners = new Set<() => void>();

function setState(next: ConfirmState) {
    state = next;
    listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function confirm(options: ConfirmOptions): Promise<boolean> {
    state.resolve?.(false);
    return new Promise((resolve) => setState({ open: true, options, resolve }));
}

function close(result: boolean) {
    state.resolve?.(result);
    setState({ ...state, open: false, resolve: undefined });
}

// Need i mount to sa app.tsx para lagi na gamitin

export default function FormAlertDialog() {
    const { open, options } = useSyncExternalStore(subscribe, () => state);
    const {
        title = 'Are you sure?',
        description,
        icon: Icon = CircleFadingPlusIcon,
        confirm_text = 'Yes',
        cancel_text = 'Cancel',
    } = options;

    return (
        <AlertDialog open={open} onOpenChange={(nextOpen) => !nextOpen && close(false)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogMedia>
                    <Icon />
                </AlertDialogMedia>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>
                    {description}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>{cancel_text}</AlertDialogCancel>
                <AlertDialogAction onClick={() => close(true)}>{confirm_text}</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    )
}
