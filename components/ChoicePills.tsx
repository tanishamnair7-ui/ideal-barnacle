'use client'

interface ChoicePillsProps {
  options: string[]
  selectedValue: string | null
  onSelect: (value: string) => void
  allowNotSure?: boolean
}

export default function ChoicePills({
  options,
  selectedValue,
  onSelect,
  allowNotSure = false,
}: ChoicePillsProps) {
  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelect(option)}
          className={`
            w-full px-6 py-4 rounded-xl border-2 transition-all text-left
            ${
              selectedValue === option
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                : 'border-gray-300 hover:border-indigo-400 bg-white text-gray-700'
            }
          `}
        >
          {option}
        </button>
      ))}
      {allowNotSure && !options.includes('Not sure') && (
        <button
          onClick={() => onSelect('Not sure')}
          className={`
            w-full px-6 py-4 rounded-xl border-2 border-dashed transition-all text-left
            ${
              selectedValue === 'Not sure'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                : 'border-gray-300 hover:border-indigo-400 bg-white text-gray-500'
            }
          `}
        >
          Not sure
        </button>
      )}
    </div>
  )
}
