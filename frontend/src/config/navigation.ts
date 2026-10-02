import { BarChart, UserRoundGroup, type LucideIcon } from "lucide-react";

export type Role = 'admin' | 'hr' | 'employee';

export interface NavLink {
    to: string;
    label: string;
    icon: LucideIcon;
    roles?: Role[];  
}

export interface NavGroup {
    title?: string;
    links: NavLink[];
    roles?: Role[];
}

export const navGroups: NavGroup[] = [
    {
        title: 'Attendance',
        links: [
            {
                to: '/dashboard',
                label: 'Dashboard',
                icon: BarChart
            }
        ]
    },
    {
        title: 'Maintenance',
        links: [
            {
                to: '/employees',
                label: 'Employees',
                icon: UserRoundGroup
            }
        ]
    }
]

export function getNavForRole(role: Role): NavGroup[] {
    const allowed = (roles?: Role[]) => !roles || roles.includes(role);
  
    return navGroups
      .filter((group) => allowed(group.roles))
      .map((group) => ({
        ...group,
        links: group.links.filter((link) => allowed(link.roles)),
      }))
      .filter((group) => group.links.length > 0);
}

export function findNavLink(pathname: string): NavLink | undefined {
    const allLinks = navGroups.flatMap((group) => group.links);
  
    return allLinks.find(
      (link) => pathname === link.to || pathname.startsWith(`${link.to}/`)
    );
}