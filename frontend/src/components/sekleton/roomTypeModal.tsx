export default function RoomTypeSkeleton() {
    return (
      <div className="space-y-6">
        {/* Nama Tipe Kamar - Loading */}
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
        </div>
  
        {/* Harga per Bulan - Loading */}
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
        </div>
  
        {/* Fasilitas - Loading */}
        <div className="space-y-2">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Generate 6 skeleton facility checkboxes */}
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="flex items-center">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="ml-2 h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  