import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "../AuthContext"
import FullPageLoader from "@/components/layout/FullPageLoader"
import type { Role } from '@/config/navigation'

type Props = { roles: Role[] }

export default function RoleRoute({ roles }: Props) {
    const { user, isLoading } = useAuth()

    if (isLoading) return <FullPageLoader />
    if (!user || !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
    return <Outlet />
}