'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

interface Profile {
  id: string
  name: string
  completionStatus: string
}

interface ComputedScores {
  valuesSubscales: { [key: string]: number }
  valuesCentered: { [key: string]: number }
  attachmentAnxiety: number | null
  attachmentAvoidance: number | null
  extraversion: number | null
  agreeableness: number | null
  conscientiousness: number | null
  emotionalStability: number | null
  openness: number | null
  moneyFactors: { [key: string]: number }
}

interface Response {
  questionId: string
  value: string
  question: {
    sectionId: string
    instrument: string
    prompt: string
  }
}

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const profileId = params.profileId as string

  const [profile, setProfile] = useState<Profile | null>(null)
  const [scores, setScores] = useState<ComputedScores | null>(null)
  const [responses, setResponses] = useState<Response[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      try {
        const profileRes = await fetch(`/api/profiles?profileId=${profileId}`)
        const profileData = await profileRes.json()
        setProfile(profileData)

        const scoresRes = await fetch(`/api/scores?profileId=${profileId}`)
        const scoresData = await scoresRes.json()
        setScores(scoresData)

        const responsesRes = await fetch(`/api/responses?profileId=${profileId}`)
        const responsesData = await responsesRes.json()
        setResponses(responsesData)

        setIsLoading(false)
      } catch (error) {
        console.error('Error loading profile:', error)
        alert('Failed to load profile')
      }
    }

    loadProfile()
  }, [profileId])

  const handleExportJSON = () => {
    const exportData = {
      profile,
      scores,
      responses,
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `profile-${profile?.name}-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  const handleExportCSV = () => {
    if (!scores) return

    const rows = [
      ['Category', 'Subscale', 'Score'],
      // Values
      ...Object.entries(scores.valuesCentered).map(([key, value]) => [
        'Values (Centered)',
        key,
        value.toFixed(2),
      ]),
      // Attachment
      ['Attachment', 'Anxiety', scores.attachmentAnxiety?.toFixed(2) || 'N/A'],
      ['Attachment', 'Avoidance', scores.attachmentAvoidance?.toFixed(2) || 'N/A'],
      // Personality
      ['Personality', 'Extraversion', scores.extraversion?.toFixed(2) || 'N/A'],
      ['Personality', 'Agreeableness', scores.agreeableness?.toFixed(2) || 'N/A'],
      ['Personality', 'Conscientiousness', scores.conscientiousness?.toFixed(2) || 'N/A'],
      ['Personality', 'Emotional Stability', scores.emotionalStability?.toFixed(2) || 'N/A'],
      ['Personality', 'Openness', scores.openness?.toFixed(2) || 'N/A'],
      // Money
      ...Object.entries(scores.moneyFactors).map(([key, value]) => [
        'Money Mindset',
        key,
        value.toFixed(2),
      ]),
    ]

    const csv = rows.map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `profile-${profile?.name}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const handleDelete = async () => {
    if (
      !confirm(
        'Are you sure you want to delete your profile? This action cannot be undone.'
      )
    ) {
      return
    }

    try {
      await fetch(`/api/profiles/${profileId}`, {
        method: 'DELETE',
      })
      router.push('/')
    } catch (error) {
      console.error('Error deleting profile:', error)
      alert('Failed to delete profile')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!profile || !scores) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <p className="text-gray-600">Profile not found</p>
      </div>
    )
  }

  // Get non-negotiables responses
  const nonNegResponses = responses.filter(
    (r) => r.question.instrument === 'NONNEG'
  )

  // Prepare values chart data
  const valuesData = Object.entries(scores.valuesCentered)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      score: parseFloat(value.toFixed(2)),
    }))

  // Prepare personality radar data
  const personalityData = [
    { trait: 'Extraversion', score: scores.extraversion || 0 },
    { trait: 'Agreeableness', score: scores.agreeableness || 0 },
    { trait: 'Conscientiousness', score: scores.conscientiousness || 0 },
    { trait: 'Emotional Stability', score: scores.emotionalStability || 0 },
    { trait: 'Openness', score: scores.openness || 0 },
  ]

  // Prepare money factors data
  const moneyData = Object.entries(scores.moneyFactors).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    score: parseFloat(value.toFixed(2)),
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Profile for {profile.name}
              </h1>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✓ Completed
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportJSON}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
              >
                Export JSON
              </button>
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Non-Negotiables */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your Non-Negotiables
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {nonNegResponses.map((response, index) => (
              <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2">
                <p className="text-sm text-gray-600 mb-1">
                  {response.question.prompt}
                </p>
                <p className="font-semibold text-gray-900">{response.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Grid for charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Values */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Top 5 Values (Centered)
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              These are your most important values relative to your overall value profile.
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={valuesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Attachment */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Attachment Style
            </h2>
            <div className="space-y-6 pt-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-medium">Anxiety</span>
                  <span className="text-gray-900 font-semibold">
                    {scores.attachmentAnxiety?.toFixed(2) || 'N/A'} / 7
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-purple-600 h-4 rounded-full"
                    style={{
                      width: `${((scores.attachmentAnxiety || 0) / 7) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Lower scores indicate less relationship anxiety
                </p>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-medium">Avoidance</span>
                  <span className="text-gray-900 font-semibold">
                    {scores.attachmentAvoidance?.toFixed(2) || 'N/A'} / 7
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-pink-600 h-4 rounded-full"
                    style={{
                      width: `${((scores.attachmentAvoidance || 0) / 7) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Lower scores indicate more comfort with closeness
                </p>
              </div>
            </div>
          </div>

          {/* Personality */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Personality (Big Five)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={personalityData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="trait" />
                <PolarRadiusAxis domain={[0, 7]} />
                <Radar
                  name="Personality"
                  dataKey="score"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Money Mindset */}
          {Object.keys(scores.moneyFactors).length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Money Mindset
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Your attitudes and beliefs about money across key factors.
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={moneyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Data Section */}
        <details className="bg-white rounded-2xl shadow-lg p-8">
          <summary className="text-xl font-bold text-gray-900 cursor-pointer">
            View Raw Data
          </summary>
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Values Subscales (Raw)</h3>
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(scores.valuesSubscales, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">All Scores</h3>
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(scores, null, 2)}
              </pre>
            </div>
          </div>
        </details>

        {/* Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Data Management</h3>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
            >
              Back to Home
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-3 border-2 border-red-300 text-red-700 hover:bg-red-50 rounded-lg font-semibold transition"
            >
              Delete My Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
