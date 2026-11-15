
import { useState } from 'react'

export default function FormModal({
  title,
  fields,
  initial,
  onSubmit,
  onClose
}) {
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await onSubmit(form)
      onClose()
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Something went wrong'
      )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-3"
      >
        <h2 className="text-xl font-bold text-slate-800">
          {title}
        </h2>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        {fields.map((f) => (
          <div key={f.key}>
            <label className="text-sm text-gray-600">
              {f.label}
            </label>

            {f.options ? (
              <select
                className="w-full border p-2 rounded-lg"
                value={form[f.key] ?? ''}
                onChange={(e) =>
                  setForm({ ...form, [f.key]: e.target.value })
                }
              >
                {f.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="w-full border p-2 rounded-lg"
                type={f.type || 'text'}
                value={form[f.key] ?? ''}
                onChange={(e) =>
                  setForm({ ...form, [f.key]: e.target.value })
                }
                required
              />
            )}
          </div>
        ))}

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg"
          >
            Save
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 p-2 rounded-lg"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  )
}
