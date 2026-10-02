import { useLocation } from 'react-router-dom';
import { findNavLink } from '@/config/navigation';

export default function Header() {

  const { pathname } = useLocation();
  const currentPage = findNavLink(pathname);

  const label = currentPage?.label ?? 'HRIS';
  const title = label === 'Dashboard' ? `Good Morning, Jan` : label;

  return (
    <header className="h-14 border-b flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <h1 className="font-semibold text-md">{title}</h1>
      </div>
      <span className="text-sm text-muted-foreground">Jan</span>
    </header>
  );
}