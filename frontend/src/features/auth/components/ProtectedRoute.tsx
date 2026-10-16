import { Outlet, Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../AuthContext"
import FullPageLoader from "@/components/layout/FullPageLoader"
export default function ProtectedRoute() {
    const location = useLocation()
    const { user, isLoading } = useAuth()

    if (isLoading) return <FullPageLoader />
    if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
    return <Outlet />
}