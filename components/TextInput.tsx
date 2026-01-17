'use client'

interface TextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function TextInput({ value, onChange, placeholder }: TextInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-indigo-600 focus:outline-none text-gray-900 placeholder-gray-400"
    />
  )
}
