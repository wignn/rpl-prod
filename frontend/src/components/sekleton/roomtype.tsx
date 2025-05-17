"use client"

export default function RoomTypeSkeleton() {
  // Create an array of 6 items to represent loading cards
  const skeletonCards = Array(6).fill(0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletonCards.map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse relative">
              <div className="absolute top-3 left-3 h-6 w-24 bg-gray-300 rounded-lg"></div>
            </div>
            <div className="p-5">
              <div className="h-6 w-3/4 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="mt-4 flex justify-between items-center">
                <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="flex space-x-2">
                  <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
