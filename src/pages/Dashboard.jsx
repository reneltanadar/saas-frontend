
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">

        <h1 className="text-3xl font-bold mb-4">
          Welcome, {user?.name}!
        </h1>

        <p className="text-gray-600 mb-2">
          Role: {user?.role}
        </p>

        <p className="text-gray-600 mb-6">
          Tenant ID: {user?.tenant_id}
        </p>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700"
        >
          Logout
        </button>

      </div>
    </div>
  )
}
