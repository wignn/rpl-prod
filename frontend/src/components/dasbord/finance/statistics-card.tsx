interface StatisticsCardProps {
  title: string
  amount: number
  type: "income" | "outcome" | "balance"
}

export function StatisticsCard({ title, amount, type }: StatisticsCardProps) {
  const getColorClass = () => {
    switch (type) {
      case "income":
        return "bg-green-50 text-green-600"
      case "outcome":
        return "bg-red-50 text-red-600"
      case "balance":
        return "bg-blue-50 text-blue-600"
      default:
        return "bg-gray-50 text-gray-600"
    }
  }

  const getIcon = () => {
    switch (type) {
      case "income":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        )
      case "outcome":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        )
      case "balance":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
        )
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className={`p-2 rounded-full ${getColorClass()}`}>{getIcon()}</div>
      </div>
      <p className="text-xl font-bold">
        {amount.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        })}
      </p>
    </div>
  )
}

