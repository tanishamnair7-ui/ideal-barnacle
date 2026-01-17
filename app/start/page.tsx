'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function StartPage() {
  const router = useRouter()
  const [consentGiven, setConsentGiven] = useState(false)
  const [allowSensitive, setAllowSensitive] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleStartAssessment = async () => {
    if (!consentGiven) {
      alert('Please provide consent to continue.')
      return
    }

    setIsCreating(true)

    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consentGiven,
          allowSensitive,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create profile')
      }

      const { profileId } = await response.json()
      router.push(`/assessment/${profileId}`)
    } catch (error) {
      console.error('Error creating profile:', error)
      alert('Failed to create profile. Please try again.')
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Before We Begin
          </h1>
          <p className="text-gray-600">
            Please review and accept our privacy and consent terms
          </p>
        </div>

        {/* Consent Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Privacy Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Privacy & Data Storage
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm text-gray-700">
              <p>
                This assessment stores your answers locally on this device in a private database. Your data:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Is stored only on this device</li>
                <li>Is never transmitted to external servers</li>
                <li>Can be deleted at any time from your profile page</li>
                <li>Autosaves after each answer so you can pause and resume</li>
              </ul>
              <p className="pt-2">
                This tool is for personal use only and is not intended for clinical diagnosis or professional relationship counseling.
              </p>
            </div>
          </div>

          {/* Required Consent */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300 transition cursor-pointer"
              onClick={() => setConsentGiven(!consentGiven)}>
              <input
                type="checkbox"
                id="consent"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-1 w-5 h-5 text-indigo-600 rounded cursor-pointer"
              />
              <label htmlFor="consent" className="text-gray-700 cursor-pointer">
                <strong className="text-gray-900">Required:</strong> I consent to storing my answers locally on this device in the app database. I understand this is for personal use and can be deleted at any time.
              </label>
            </div>

            {/* Optional: Sensitive Sections */}
            <div className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300 transition cursor-pointer"
              onClick={() => setAllowSensitive(!allowSensitive)}>
              <input
                type="checkbox"
                id="sensitive"
                checked={allowSensitive}
                onChange={(e) => setAllowSensitive(e.target.checked)}
                className="mt-1 w-5 h-5 text-indigo-600 rounded cursor-pointer"
              />
              <label htmlFor="sensitive" className="text-gray-700 cursor-pointer">
                <strong className="text-gray-900">Optional:</strong> Include sensitive sections (money mindset and financial attitudes). You can skip this if you prefer.
              </label>
            </div>
          </div>

          {/* Assessment Info */}
          <div className="border-t pt-6 space-y-3">
            <h3 className="font-semibold text-gray-900">
              What to expect:
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>6 sections covering basics, non-negotiables, values, attachment, personality, and money mindset</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Approximately 76 questions total (fewer if you skip optional sections)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>One question at a time with autosave after each answer</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>You can exit and resume at any time - progress is saved automatically</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Optional breaks between sections</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => router.push('/')}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button
              onClick={handleStartAssessment}
              disabled={!consentGiven || isCreating}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition ${
                consentGiven && !isCreating
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isCreating ? 'Creating...' : 'Begin Assessment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
