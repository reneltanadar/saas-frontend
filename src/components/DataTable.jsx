
export default function DataTable({
  title,
  columns,
  rows,
  emptyText,
  onAdd,
  onEdit,
  onDelete
}) {
  const hasActions = onEdit || onDelete

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-800">
          {title}
        </h2>

        {onAdd && (
          <button
            onClick={onAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            + Add
          </button>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="text-gray-500 text-sm">{emptyText}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b text-slate-500">
                {columns.map((c) => (
                  <th key={c.key} className="py-3 pr-4">
                    {c.label}
                  </th>
                ))}

                {hasActions && (
                  <th className="py-3">Actions</th>
                )}
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b last:border-0">

                  {columns.map((c) => (
                    <td key={c.key} className="py-3 pr-4 text-slate-700">
                      {row[c.key] ?? '-'}
                    </td>
                  ))}

                  {hasActions && (
                    <td className="py-3 space-x-3">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          Edit
                        </button>
                      )}

                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  )
}
