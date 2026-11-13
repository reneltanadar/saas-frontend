import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    tenant_id: '',
    role: 'employee'
  })

  const [tenants, setTenants] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/tenants')
      .then(res => setTenants(res.data))
      .catch(() => setError('Could not load tenants'))
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await api.post('/auth/register', {
        ...form,
        tenant_id: Number(form.tenant_id)
      })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full border p-3 rounded mb-4" required />

        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border p-3 rounded mb-4" required />

        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full border p-3 rounded mb-4" required />

        <select name="tenant_id" value={form.tenant_id} onChange={handleChange} className="w-full border p-3 rounded mb-4" required>
          <option value="">Select Tenant</option>
          {tenants.map(tenant => (
            <option key={tenant.id} value={tenant.id}>
              {tenant.name}
            </option>
          ))}
        </select>

        <select name="role" value={form.role} onChange={handleChange} className="w-full border p-3 rounded mb-4">
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>

        <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
          Register
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  )
}
