import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface SettingsLink {
  to: string;
  label: string;
  icon?: LucideIcon;
}

const settingsLinks: SettingsLink[] = [
  { to: '/settings/department', label: 'Department' },
  { to: '/settings/position', label: 'Position' },
];

export default function SettingsSidebar() {
  return (
    <aside className="w-56 shrink-0 border-r p-4 bg-[#fafaf8]">
      <nav className="space-y-1">
        {settingsLinks.map((link) => {
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
              {Icon && <Icon className="size-4" />}
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
