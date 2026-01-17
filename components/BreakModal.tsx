'use client'

import { useEffect, useState } from 'react'

interface BreakModalProps {
  isOpen: boolean
  onContinue: () => void
  onSkip: () => void
}

export default function BreakModal({ isOpen, onContinue, onSkip }: BreakModalProps) {
  const [countdown, setCountdown] = useState(30)

  useEffect(() => {
    if (!isOpen) {
      setCountdown(30)
      return
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onContinue()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen, onContinue])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full space-y-6 animate-fade-in">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Great progress!
          </h3>
          <p className="text-gray-600">
            You just completed a section. Take a quick 30-second break to stretch or rest your eyes.
          </p>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative w-24 h-24">
            <svg className="transform -rotate-90 w-24 h-24">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - countdown / 30)}`}
                className="text-indigo-600 transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{countdown}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onSkip}
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Skip break
          </button>
          <button
            onClick={onContinue}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Continue now
          </button>
        </div>
      </div>
    </div>
  )
}
