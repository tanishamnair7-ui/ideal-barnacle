import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { consentGiven, allowSensitive } = body

    const profile = await prisma.profile.create({
      data: {
        name: 'New User', // Will be updated in basics section
        consentGiven: consentGiven || false,
        allowSensitive: allowSensitive || false,
        completionStatus: 'in_progress',
      },
    })

    return NextResponse.json({ profileId: profile.id })
  } catch (error) {
    console.error('Error creating profile:', error)
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get('profileId')

    if (profileId) {
      const profile = await prisma.profile.findUnique({
        where: { id: profileId },
        include: {
          responses: {
            include: {
              question: true,
            },
          },
        },
      })

      if (!profile) {
        return NextResponse.json(
          { error: 'Profile not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(profile)
    }

    // List all profiles
    const profiles = await prisma.profile.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(profiles)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
