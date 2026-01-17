'use client'

interface SectionHeaderProps {
  sectionName: string
  sectionProgress: string
  overallProgress: number
  estimatedMinutesRemaining?: number
}

export default function SectionHeader({
  sectionName,
  sectionProgress,
  overallProgress,
  estimatedMinutesRemaining,
}: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-sm font-medium text-gray-600">{sectionName}</h2>
          <p className="text-xs text-gray-500">{sectionProgress}</p>
        </div>
        {estimatedMinutesRemaining !== undefined && (
          <div className="text-right">
            <p className="text-xs text-gray-500">
              ~{estimatedMinutesRemaining} min remaining
            </p>
          </div>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${overallProgress}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1 text-right">{overallProgress}% complete</p>
    </div>
  )
}
