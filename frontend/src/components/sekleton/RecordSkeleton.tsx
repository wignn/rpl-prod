import { Filter, Search, ArrowUpDown } from "lucide-react"

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      {/* Filter and Search Skeleton */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-4 h-4" />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-300" />
          <div className="w-36 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center">
                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                    <ArrowUpDown className="ml-1 h-4 w-4 text-gray-300" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <ArrowUpDown className="ml-1 h-4 w-4 text-gray-300" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center">
                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                    <ArrowUpDown className="ml-1 h-4 w-4 text-gray-300" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center">
                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                    <ArrowUpDown className="ml-1 h-4 w-4 text-gray-300" />
                  </div>
                </th>
                <th className="px-6 py-3 text-right">
                  <div className="h-4 w-10 bg-gray-200 rounded animate-pulse ml-auto"></div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse mr-3"></div>
                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="h-5 w-16 bg-gray-200 rounded animate-pulse ml-auto"></div>
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
