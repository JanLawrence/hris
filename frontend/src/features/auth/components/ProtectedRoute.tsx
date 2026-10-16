import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "../AuthContext"
import FullPageLoader from "@/components/layout/FullPageLoader"
export default function ProtectedRoute() {
    const { user, isLoading } = useAuth()

    if (isLoading) return <FullPageLoader />
    if (!user) return <Navigate to="/login" replace />
    return <Outlet />
}