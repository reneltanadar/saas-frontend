
import { useEffect, useState } from 'react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import DataTable from '../components/DataTable'
import FormModal from '../components/FormModal'

// Fields for adding or editing a company
const companyFields = [
  { key: 'name', label: 'Name' },
  { key: 'industry', label: 'Industry' },
]

// Fields for creating a user
const userCreateFields = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'password', label: 'Password (8+ chars)', type: 'password' },
  { key: 'role', label: 'Role', options: ['employee', 'admin'] },
]

// Fields for editing a user
const userEditFields = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [companies, setCompanies] = useState([])
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  // Load companies and users from the backend
  const load = async () => {
    setError('')

    try {
      const [c, u] = await Promise.all([
        api.get('/companies', { params: { limit: 100 } }),
        api.get('/users', { params: { limit: 100 } }),
      ])

      setCompanies(c.data.companies)
      setUsers(u.data.users)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Failed to load data'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  // Delete a company or user
  const handleDelete = async (type, row) => {
    if (!window.confirm(`Delete "${row.name}"?`)) return

    try {
      await api.delete(`/${type}/${row.id}`)
      await load()
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Delete failed'
      )
    }
  }

  // Add a new record or update an existing one
  const handleSubmit = async (form) => {
    const { type, mode, item } = modal

    if (mode === 'add') {
      await api.post(`/${type}`, form)
    } else {
      const { name, email, industry } = form

      const body =
        type === 'users'
          ? { name, email }
          : { name, industry }

      await api.patch(`/${type}/${item.id}`, body)
    }

    await load()
  }

  // Select the correct fields for the modal
  const fieldsFor = () => {
    if (modal.type === 'companies') {
      return companyFields
    }

    return modal.mode === 'add'
      ? userCreateFields
      : userEditFields
  }

  // Set the initial values in the modal
  const initialFor = () => {
    if (modal.mode === 'edit') {
      return modal.item
    }

    return modal.type === 'users'
      ? { role: 'employee' }
      : {}
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your companies and users
          </p>
        </div>

        {error && (
          <p className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : (
          <>
            <DataTable
              title="Companies"
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Name' },
                { key: 'industry', label: 'Industry' },
              ]}
              rows={companies}
              emptyText="No companies yet."
              onAdd={
                isAdmin
                  ? () => setModal({ type: 'companies', mode: 'add' })
                  : null
              }
              onEdit={
                isAdmin
                  ? (row) => setModal({
                      type: 'companies',
                      mode: 'edit',
                      item: row
                    })
                  : null
              }
              onDelete={
                isAdmin
                  ? (row) => handleDelete('companies', row)
                  : null
              }
            />

            <DataTable
              title="Users"
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'role', label: 'Role' },
              ]}
              rows={users}
              emptyText="No users yet."
              onAdd={
                isAdmin
                  ? () => setModal({ type: 'users', mode: 'add' })
                  : null
              }
              onEdit={
                isAdmin
                  ? (row) => setModal({
                      type: 'users',
                      mode: 'edit',
                      item: row
                    })
                  : null
              }
              onDelete={
                isAdmin
                  ? (row) => handleDelete('users', row)
                  : null
              }
            />
          </>
        )}
      </main>

      {modal && (
        <FormModal
          title={`${modal.mode === 'add' ? 'Add' : 'Edit'} ${
            modal.type === 'users' ? 'user' : 'company'
          }`}
          fields={fieldsFor()}
          initial={initialFor()}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
