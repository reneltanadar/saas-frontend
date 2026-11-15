
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      
      <div>
        <h1 className="text-xl font-bold tracking-wide">
          SaaS<span className="text-indigo-400">Flow</span>
        </h1>
        <p className="text-xs text-slate-400">
          Management Dashboard
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">
            {user?.name}
          </p>
          <span className="text-xs text-indigo-300 uppercase">
            {user?.role}
          </span>
        </div>

        <button
          onClick={logout}
          className="bg-slate-700 hover:bg-red-600 px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Logout
        </button>
      </div>

    </nav>
  )
}
