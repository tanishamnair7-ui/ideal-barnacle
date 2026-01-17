import { NextRequest, NextResponse } from 'next/server'
import { computeScores, getComputedScores } from '@/lib/scoring'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { profileId } = body

    if (!profileId) {
      return NextResponse.json(
        { error: 'profileId is required' },
        { status: 400 }
      )
    }

    const scores = await computeScores(profileId)
    return NextResponse.json(scores)
  } catch (error) {
    console.error('Error computing scores:', error)
    return NextResponse.json(
      { error: 'Failed to compute scores' },
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

    const scores = await getComputedScores(profileId)
    return NextResponse.json(scores)
  } catch (error) {
    console.error('Error fetching scores:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scores' },
      { status: 500 }
    )
  }
}
