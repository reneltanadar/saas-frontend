
export default function DataTable({ title, columns, rows, emptyText }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-bold mb-4 text-slate-800">
        {title}
      </h2>

      {rows.length === 0 ? (
        <p className="text-gray-500 text-sm">{emptyText}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b text-slate-500">
                {columns.map((c) => (
                  <th key={c.key} className="py-3 pr-4 font-semibold">
                    {c.label}
                  </th>
                ))}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
