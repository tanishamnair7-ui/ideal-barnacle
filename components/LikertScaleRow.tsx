'use client'

interface LikertScaleRowProps {
  scaleMin: number
  scaleMax: number
  scaleLabels: { [key: string]: string }
  selectedValue: number | null
  onSelect: (value: number) => void
}

export default function LikertScaleRow({
  scaleMin,
  scaleMax,
  scaleLabels,
  selectedValue,
  onSelect,
}: LikertScaleRowProps) {
  const options = []
  for (let i = scaleMin; i <= scaleMax; i++) {
    options.push(i)
  }

  return (
    <div className="space-y-3">
      {/* Scale buttons */}
      <div className="flex gap-2 justify-center flex-wrap">
        {options.map((value) => (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className={`
              flex-1 min-w-[60px] px-4 py-3 rounded-lg border-2 transition-all
              ${
                selectedValue === value
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                  : 'border-gray-300 hover:border-indigo-400 bg-white text-gray-700'
              }
            `}
          >
            {value}
          </button>
        ))}
      </div>

      {/* Scale labels */}
      <div className="flex justify-between text-xs text-gray-600 px-1">
        <span>{scaleLabels[scaleMin] || ''}</span>
        <span>{scaleLabels[scaleMax] || ''}</span>
      </div>
    </div>
  )
}
