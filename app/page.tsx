import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Create Your Relationship Profile
          </h1>
          <p className="text-xl text-gray-600">
            Discover your values, attachment style, personality traits, and relationship preferences in a comprehensive assessment.
          </p>
        </div>

        {/* Info Cards */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-indigo-600 mb-1">15-20</div>
              <div className="text-sm text-gray-600">minutes to complete</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-indigo-600 mb-1">100%</div>
              <div className="text-sm text-gray-600">privacy-first</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-indigo-600 mb-1">Auto</div>
              <div className="text-sm text-gray-600">saves progress</div>
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg">What you'll discover:</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">
                  <strong>Your core values</strong> and what matters most to you
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">
                  <strong>Attachment style</strong> in relationships
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">
                  <strong>Personality snapshot</strong> across five key traits
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">
                  <strong>Money mindset</strong> and financial compatibility factors
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">
                  <strong>Your non-negotiables</strong> and relationship preferences
                </span>
              </li>
            </ul>
          </div>

          <div className="border-t pt-6">
            <div className="bg-indigo-50 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div className="text-sm text-gray-700">
                  <strong className="text-indigo-900">Privacy first:</strong> All data is stored locally on this device. You can pause and resume anytime, and delete your profile whenever you want.
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/start"
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center font-semibold py-4 px-6 rounded-xl transition-colors text-lg"
          >
            Start Assessment
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-gray-500">
          For personal use only. Takes approximately 15-20 minutes.
        </p>
      </div>
    </div>
  )
}
