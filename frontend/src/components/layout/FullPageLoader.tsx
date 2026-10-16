import { CalendarClock, Loader2 } from "lucide-react";

export default function FullPageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f3f3f0]"
    >
      <div className="flex items-center gap-2 text-lg font-semibold">
        <CalendarClock className="size-5" />
        HRIS
      </div>
      <Loader2 className="size-5 animate-spin text-muted-foreground" />
    </div>
  );
}
