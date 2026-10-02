import { NavLink } from 'react-router-dom';
import { CalendarClock } from "lucide-react";
import { getNavForRole, type Role } from '@/config/navigation';

export default function Sidebar() {

  const role: Role = 'employee';   // pansamantala; galing sa login mamaya
  const groups = getNavForRole(role);
  return (
    <aside className="w-56 h-screen sticky top-0 border-r p-4">
      <div className="h-10 flex items-center px-3 mb-7 font-semibold text-lg gap-2"><CalendarClock className="size-4"/> HRIS</div>
      <nav className="space-y-6">
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
    </aside>
  );
}