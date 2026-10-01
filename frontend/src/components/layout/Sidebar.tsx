import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/employees', label: 'Employees' },
];

export default function Sidebar() {
  return (
    <aside className="w-56 border-r p-4 space-y-1">
  <div className="h-10 flex items-center px-3 mb-4 font-semibold text-lg">janjanlawrence</div>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `block rounded-md px-3 py-2 text-sm ${
              isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </aside>
  );
}