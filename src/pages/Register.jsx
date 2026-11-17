import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/client'

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', tenant_id: '', role: 'employee',
  })

  const [tenants, setTenants] = useState([])
  const [newTenant, setNewTenant] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const loadTenants = async () => {
    const { data } = await api.get('/tenants')
    setTenants(data)
  }

  useEffect(() => {
    loadTenants().catch(() => setError('Could not load tenants'))
  }, [])

  const set = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value })

  const createTenant = async () => {
    setError('')
    if (!newTenant.trim()) return

    try {
      const { data } = await api.post('/tenants', {
        name: newTenant.trim(),
        slug: slugify(newTenant),
      })

      await loadTenants()

      setForm((f) => ({
        ...f,
        tenant_id: String(data.id),
        role: 'admin',
      }))

      setNewTenant('')
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Could not create tenant'
      )
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await api.post('/auth/register', {
        ...form,
        tenant_id: Number(form.tenant_id),
      })

      navigate('/login')
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Registration failed'
      )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold">Register</h1>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <input
          className="w-full border p-2 rounded"
          placeholder="Name"
          value={form.name}
          onChange={set('name')}
          required
        />

        <input
          className="w-full border p-2 rounded"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={set('email')}
          required
        />

        <input
          className="w-full border p-2 rounded"
          type="password"
          placeholder="Password (8+ chars)"
          value={form.password}
          onChange={set('password')}
          minLength={8}
          required
        />

        <select
          className="w-full border p-2 rounded"
          value={form.tenant_id}
          onChange={set('tenant_id')}
          required
        >
          <option value="" disabled>Select tenant</option>
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <div className="border rounded-lg p-3 space-y-2 bg-gray-50">
          <p className="text-sm text-gray-600">
            Or create a new tenant
          </p>

          <div className="flex gap-2">
            <input
              className="flex-1 min-w-0 border p-2 rounded"
              placeholder="Organization name"
              value={newTenant}
              onChange={(e) => setNewTenant(e.target.value)}
            />

            <button
              type="button"
              onClick={createTenant}
              className="bg-slate-800 text-white px-3 rounded text-sm"
            >
              Create
            </button>
          </div>
        </div>

        <select
          className="w-full border p-2 rounded"
          value={form.role}
          onChange={set('role')}
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded">
          Register
        </button>

        <p className="text-sm">
          Have an account?{' '}
          <Link to="/login" className="text-indigo-600">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}
