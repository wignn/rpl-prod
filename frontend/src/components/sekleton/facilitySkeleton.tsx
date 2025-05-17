export default function FacilitySkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      {/* Search and Filter Skeleton */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row justify-between gap-4">
        <div className="h-10 w-full max-w-md bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-6 py-3 text-right">
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse ml-auto"></div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse mt-2"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
