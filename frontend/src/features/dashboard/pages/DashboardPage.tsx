import { useAuth } from "@/features/auth/AuthContext"

export default function DashboardPage() {
  const { user } = useAuth()
  return (
    <>
      <header className="h-14 border-b flex items-center justify-between px-6 bg-white">
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-md">Dashboard</h1>
        </div>
      </header>
      <div>
        <p>Hello, {user?.username} ({user?.role})</p>
      </div>
    </>
  )
}