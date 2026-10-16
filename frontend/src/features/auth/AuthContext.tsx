import { createContext, useContext, useState, type ReactNode } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getMe, login as loginRequest } from "@/api/auth"
import type { AuthUser } from "@/types/auth"

type AuthContextValue = {
    user: AuthUser | null
    isLoading: boolean
    logout: () => void
    login: (username: string, password: string) => Promise<void>

}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient()
    const [hasToken, setHasToken] = useState(() => !!localStorage.getItem("access_token"))

    const { data: user, isLoading } = useQuery({
        queryKey: ["me"],
        queryFn: () => getMe().then((res) => res.data),
        enabled: hasToken,
    })

    const login = async (username: string, password: string) => {
        const res = await loginRequest({username, password});
        localStorage.setItem('access_token', res.data.access)
        localStorage.setItem('refresh_token', res.data.refresh)
        setHasToken(true)
    }
    

    const logout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        queryClient.clear()
        setHasToken(false)
    }

    return (
        <AuthContext.Provider value={{ user: user ?? null, isLoading: hasToken && isLoading, logout, login }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
    return ctx
}
