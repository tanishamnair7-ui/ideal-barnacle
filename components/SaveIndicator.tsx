'use client'

interface SaveIndicatorProps {
  status: 'saving' | 'saved' | 'error'
}

export default function SaveIndicator({ status }: SaveIndicatorProps) {
  if (status === 'saving') {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Saving...
      </div>
    )
  }

  if (status === 'saved') {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        Saved
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600">
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        Error saving
      </div>
    )
  }

  return null
}
