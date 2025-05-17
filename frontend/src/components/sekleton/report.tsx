export default function ReportSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-32 bg-gray-200 rounded-lg animate-pulse"></div>

      {/* Filter skeleton */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="h-10 w-36 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-10 w-64 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div className="h-10 w-48 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="mt-4 rounded-lg bg-white p-6 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pl-2">
                  <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="pb-2">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="pb-2">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="pb-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 pl-2">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="py-3">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="py-3">
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="py-3 flex items-center justify-between">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-center space-x-1">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-8 w-8 bg-gray-200 rounded animate-pulse mx-1"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
