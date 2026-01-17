import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { profileId, questionId, value, lastSeenQuestionId } = body

    // Upsert the response
    const response = await prisma.response.upsert({
      where: {
        profileId_questionId: {
          profileId,
          questionId,
        },
      },
      update: {
        value: String(value),
      },
      create: {
        profileId,
        questionId,
        value: String(value),
      },
    })

    // Update profile's lastSeenQuestionId
    if (lastSeenQuestionId) {
      await prisma.profile.update({
        where: { id: profileId },
        data: { lastSeenQuestionId },
      })
    }

    // If this is a basics question about name, update the profile name
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    })

    if (question && question.instrument === 'BASICS' && question.orderIndex === 1) {
      await prisma.profile.update({
        where: { id: profileId },
        data: { name: String(value) },
      })
    }

    return NextResponse.json({ success: true, response })
  } catch (error) {
    console.error('Error saving response:', error)
    return NextResponse.json(
      { error: 'Failed to save response' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get('profileId')

    if (!profileId) {
      return NextResponse.json(
        { error: 'profileId is required' },
        { status: 400 }
      )
    }

    const responses = await prisma.response.findMany({
      where: { profileId },
      include: {
        question: true,
      },
    })

    return NextResponse.json(responses)
  } catch (error) {
    console.error('Error fetching responses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch responses' },
      { status: 500 }
    )
  }
}
