import { NavLink, useNavigate } from 'react-router-dom';
import { CalendarClock, LogOut } from "lucide-react";
import { getNavForRole, type Role } from '@/config/navigation';
import { useAuth } from '@/features/auth/AuthContext';
import { capitalize, getInitials } from '@/utils/text';
import { Button } from '@/components/ui/button';
import {
  Avatar,
  AvatarFallback
} from "@/components/ui/avatar"

export default function Sidebar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const role: Role = user?.role ?? 'employee';
  const groups = getNavForRole(role);
  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.username || ""

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="w-56 h-screen sticky top-0 border-r p-4 flex flex-col">
      <div className="h-10 flex items-center px-3 mb-7 font-semibold text-lg gap-2"><CalendarClock className="size-4"/> HRIS</div>
      <nav className="space-y-6 flex-1">
        {groups.map((group, i) => (
          <div key={group.title ?? i}>
            {group.title && (
              <p className="px-3 mb-2 text-[0.65rem] font-medium uppercase text-muted-foreground">
                {group.title}
              </p>
            )}

            <div className="space-y-1">
              {group.links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                        isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                      }`
                    }
                  >
                    <Icon className="size-4" />
                    {link.label}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="flex items-center gap-3 border-t pt-4">
        <Avatar className="size-8">
          <AvatarFallback className="text-xs">{getInitials(displayName)}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium">{displayName}</span>
          <span className="text-xs text-muted-foreground">{capitalize(role)}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto shrink-0"
          onClick={handleLogout}
          aria-label="Log out"
          title="Log out"
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </aside>
  );
}