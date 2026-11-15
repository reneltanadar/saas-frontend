
import { useEffect, useState } from 'react'
import api from '../api/client'
import Navbar from '../components/Navbar'
import DataTable from '../components/DataTable'

export default function Dashboard() {
  const [companies, setCompanies] = useState([])
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
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

    load()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your companies and users.
          </p>
        </div>

        {error && (
          <p className="text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-slate-500">Loading dashboard...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <p className="text-slate-500 text-sm">Total Companies</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">
                  {companies.length}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <p className="text-slate-500 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">
                  {users.length}
                </p>
              </div>

            </div>

            <DataTable
              title="Companies"
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Name' },
                { key: 'industry', label: 'Industry' },
              ]}
              rows={companies}
              emptyText="No companies yet."
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
            />
          </>
        )}

      </main>
    </div>
  )
}
