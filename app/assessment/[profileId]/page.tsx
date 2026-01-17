'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import SectionHeader from '@/components/SectionHeader'
import LikertScaleRow from '@/components/LikertScaleRow'
import ChoicePills from '@/components/ChoicePills'
import TextInput from '@/components/TextInput'
import SaveIndicator from '@/components/SaveIndicator'
import BreakModal from '@/components/BreakModal'

interface Question {
  id: string
  sectionId: string
  instrument: string
  orderIndex: number
  prompt: string
  responseType: string
  options: string | null
  scaleMin: number | null
  scaleMax: number | null
  scaleLabels: string | null
  required: boolean
}

interface Profile {
  id: string
  name: string
  allowSensitive: boolean
  lastSeenQuestionId: string | null
}

const SECTION_NAMES: { [key: string]: string } = {
  basics: 'Basics',
  nonneg: 'Non-Negotiables',
  values: 'Values',
  attachment: 'Attachment Style',
  personality: 'Personality',
  money: 'Money Mindset',
}

export default function AssessmentPage() {
  const router = useRouter()
  const params = useParams()
  const profileId = params.profileId as string

  const [profile, setProfile] = useState<Profile | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<{ [questionId: string]: string }>({})
  const [currentAnswer, setCurrentAnswer] = useState<string | number | null>(null)
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'error'>('saved')
  const [showBreak, setShowBreak] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load profile and questions
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch profile
        const profileRes = await fetch(`/api/profiles?profileId=${profileId}`)
        const profileData = await profileRes.json()
        setProfile(profileData)

        // Fetch all questions
        const questionsRes = await fetch('/api/questions')
        let allQuestions: Question[] = await questionsRes.json()

        // Filter out money section if user didn't consent
        if (!profileData.allowSensitive) {
          allQuestions = allQuestions.filter((q) => q.sectionId !== 'money')
        }

        setQuestions(allQuestions)

        // Load existing responses
        const responsesRes = await fetch(`/api/responses?profileId=${profileId}`)
        const existingResponses = await responsesRes.json()
        const responsesMap: { [questionId: string]: string } = {}
        existingResponses.forEach((r: any) => {
          responsesMap[r.questionId] = r.value
        })
        setResponses(responsesMap)

        // Resume from last seen question or start from beginning
        if (profileData.lastSeenQuestionId) {
          const lastIndex = allQuestions.findIndex(
            (q) => q.id === profileData.lastSeenQuestionId
          )
          if (lastIndex !== -1) {
            setCurrentQuestionIndex(lastIndex)
            setCurrentAnswer(responsesMap[allQuestions[lastIndex].id] || null)
          }
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Error loading data:', error)
        alert('Failed to load assessment. Please try again.')
      }
    }

    loadData()
  }, [profileId])

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  // Check if we just completed a section
  const checkForSectionBreak = (index: number) => {
    if (index === 0 || index >= questions.length) return false
    const currentSection = questions[index].sectionId
    const prevSection = questions[index - 1].sectionId
    return currentSection !== prevSection
  }

  const saveResponse = async (questionId: string, value: string | number) => {
    setSaveStatus('saving')

    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId,
          questionId,
          value,
          lastSeenQuestionId: questionId,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      setSaveStatus('saved')
      setResponses((prev) => ({ ...prev, [questionId]: String(value) }))

      // Brief delay to show saved indicator
      setTimeout(() => setSaveStatus('saved'), 500)
    } catch (error) {
      console.error('Error saving response:', error)
      setSaveStatus('error')
    }
  }

  const handleNext = async () => {
    if (currentAnswer === null || currentAnswer === '') {
      if (currentQuestion.required) {
        alert('Please answer this question to continue.')
        return
      }
    }

    // Save current answer
    if (currentAnswer !== null && currentAnswer !== '') {
      await saveResponse(currentQuestion.id, currentAnswer)
    }

    // Check if assessment is complete
    if (isLastQuestion) {
      // Compute scores
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId }),
      })

      // Mark profile as completed
      await fetch(`/api/profiles/${profileId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completionStatus: 'completed' }),
      })

      router.push(`/profile/${profileId}`)
      return
    }

    // Move to next question
    const nextIndex = currentQuestionIndex + 1
    setCurrentQuestionIndex(nextIndex)
    setCurrentAnswer(responses[questions[nextIndex].id] || null)

    // Check for section break
    if (checkForSectionBreak(nextIndex)) {
      setShowBreak(true)
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1
      setCurrentQuestionIndex(prevIndex)
      setCurrentAnswer(responses[questions[prevIndex].id] || null)
    }
  }

  const handleExit = () => {
    if (confirm('Your progress is saved. Exit the assessment?')) {
      router.push('/')
    }
  }

  const handleBreakContinue = () => {
    setShowBreak(false)
  }

  const handleBreakSkip = () => {
    setShowBreak(false)
  }

  // Calculate progress
  const overallProgress = questions.length > 0
    ? Math.round((currentQuestionIndex / questions.length) * 100)
    : 0

  const currentSectionQuestions = questions.filter(
    (q) => q.sectionId === currentQuestion?.sectionId
  )
  const currentQuestionInSection = currentSectionQuestions.findIndex(
    (q) => q.id === currentQuestion?.id
  ) + 1
  const sectionProgress = `${currentQuestionInSection} / ${currentSectionQuestions.length}`

  // Estimate time remaining (assume 15 seconds per question)
  const questionsRemaining = questions.length - currentQuestionIndex
  const estimatedMinutes = Math.ceil((questionsRemaining * 15) / 60)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No questions found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-3xl mx-auto py-8">
        {/* Exit button */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleExit}
            className="text-sm text-gray-600 hover:text-gray-900 transition"
          >
            ← Exit and Save
          </button>
          <SaveIndicator status={saveStatus} />
        </div>

        {/* Progress */}
        <SectionHeader
          sectionName={SECTION_NAMES[currentQuestion.sectionId] || currentQuestion.sectionId}
          sectionProgress={sectionProgress}
          overallProgress={overallProgress}
          estimatedMinutesRemaining={estimatedMinutes}
        />

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 min-h-[400px] flex flex-col">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {currentQuestion.prompt}
            </h2>

            {/* Render appropriate input based on question type */}
            {currentQuestion.responseType === 'text' && (
              <TextInput
                value={String(currentAnswer || '')}
                onChange={setCurrentAnswer}
                placeholder="Type your answer..."
              />
            )}

            {currentQuestion.responseType === 'single_choice' && (
              <ChoicePills
                options={JSON.parse(currentQuestion.options || '[]')}
                selectedValue={String(currentAnswer || '')}
                onSelect={(value) => setCurrentAnswer(value)}
                allowNotSure={!currentQuestion.required}
              />
            )}

            {currentQuestion.responseType === 'likert' && (
              <LikertScaleRow
                scaleMin={currentQuestion.scaleMin || 1}
                scaleMax={currentQuestion.scaleMax || 7}
                scaleLabels={JSON.parse(currentQuestion.scaleLabels || '{}')}
                selectedValue={currentAnswer as number | null}
                onSelect={(value) => setCurrentAnswer(value)}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition ${
                currentQuestionIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
            >
              {isLastQuestion ? 'Complete Assessment' : 'Next'}
            </button>
          </div>
        </div>

        {/* Motivation strip */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Building your profile helps you understand yourself better
        </div>
      </div>

      {/* Break Modal */}
      <BreakModal
        isOpen={showBreak}
        onContinue={handleBreakContinue}
        onSkip={handleBreakSkip}
      />
    </div>
  )
}
