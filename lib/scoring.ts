import { prisma } from './prisma'

interface ScoringKeyMap {
  [subscale: string]: {
    itemId: string
    reverse: boolean
    weight: number
  }[]
}

export async function computeScores(profileId: string) {
  // Fetch all responses for this profile
  const responses = await prisma.response.findMany({
    where: { profileId },
    include: { question: true },
  })

  // Fetch all scoring keys
  const scoringKeys = await prisma.scoringKey.findMany()

  // Group scoring keys by instrument
  const scoringKeysByInstrument: { [instrument: string]: ScoringKeyMap } = {}
  scoringKeys.forEach((key) => {
    if (!scoringKeysByInstrument[key.instrument]) {
      scoringKeysByInstrument[key.instrument] = {}
    }
    if (!scoringKeysByInstrument[key.instrument][key.subscale]) {
      scoringKeysByInstrument[key.instrument][key.subscale] = []
    }
    scoringKeysByInstrument[key.instrument][key.subscale].push({
      itemId: key.itemId,
      reverse: key.reverse,
      weight: key.weight || 1.0,
    })
  })

  // Group responses by instrument
  const responsesByInstrument: { [instrument: string]: any[] } = {}
  responses.forEach((response) => {
    const instrument = response.question.instrument
    if (!responsesByInstrument[instrument]) {
      responsesByInstrument[instrument] = []
    }
    responsesByInstrument[instrument].push(response)
  })

  // ===== VALUES (PVQ) SCORING =====
  const valuesSubscales: { [key: string]: number } = {}
  if (scoringKeysByInstrument['PVQ'] && responsesByInstrument['PVQ']) {
    const pvqResponses = responsesByInstrument['PVQ']

    Object.keys(scoringKeysByInstrument['PVQ']).forEach((subscale) => {
      const items = scoringKeysByInstrument['PVQ'][subscale]
      let sum = 0
      let count = 0

      items.forEach((item) => {
        const response = pvqResponses.find(
          (r) => r.question.orderIndex === parseInt(item.itemId)
        )
        if (response) {
          const rawValue = parseFloat(response.value)
          const scaleMin = response.question.scaleMin || 1
          const scaleMax = response.question.scaleMax || 6
          const scoredValue = item.reverse
            ? scaleMin + scaleMax - rawValue
            : rawValue
          sum += scoredValue * item.weight
          count++
        }
      })

      if (count > 0) {
        valuesSubscales[subscale] = sum / count
      }
    })
  }

  // Values centering: subtract mean of all values items
  const valuesCentered: { [key: string]: number } = {}
  if (Object.keys(valuesSubscales).length > 0) {
    const allValuesScores = Object.values(valuesSubscales)
    const meanAll = allValuesScores.reduce((a, b) => a + b, 0) / allValuesScores.length

    Object.keys(valuesSubscales).forEach((subscale) => {
      valuesCentered[subscale] = valuesSubscales[subscale] - meanAll
    })
  }

  // ===== ATTACHMENT (ECR-S) SCORING =====
  let attachmentAnxiety: number | null = null
  let attachmentAvoidance: number | null = null

  if (scoringKeysByInstrument['ECRS'] && responsesByInstrument['ECRS']) {
    const ecrsResponses = responsesByInstrument['ECRS']

    // Anxiety subscale
    if (scoringKeysByInstrument['ECRS']['anxiety']) {
      const anxietyItems = scoringKeysByInstrument['ECRS']['anxiety']
      let sum = 0
      let count = 0

      anxietyItems.forEach((item) => {
        const response = ecrsResponses.find(
          (r) => r.question.orderIndex === parseInt(item.itemId)
        )
        if (response) {
          const rawValue = parseFloat(response.value)
          const scaleMin = response.question.scaleMin || 1
          const scaleMax = response.question.scaleMax || 7
          const scoredValue = item.reverse
            ? scaleMin + scaleMax - rawValue
            : rawValue
          sum += scoredValue * item.weight
          count++
        }
      })

      if (count > 0) {
        attachmentAnxiety = sum / count
      }
    }

    // Avoidance subscale
    if (scoringKeysByInstrument['ECRS']['avoidance']) {
      const avoidanceItems = scoringKeysByInstrument['ECRS']['avoidance']
      let sum = 0
      let count = 0

      avoidanceItems.forEach((item) => {
        const response = ecrsResponses.find(
          (r) => r.question.orderIndex === parseInt(item.itemId)
        )
        if (response) {
          const rawValue = parseFloat(response.value)
          const scaleMin = response.question.scaleMin || 1
          const scaleMax = response.question.scaleMax || 7
          const scoredValue = item.reverse
            ? scaleMin + scaleMax - rawValue
            : rawValue
          sum += scoredValue * item.weight
          count++
        }
      })

      if (count > 0) {
        attachmentAvoidance = sum / count
      }
    }
  }

  // ===== PERSONALITY (TIPI) SCORING =====
  const tipiScores: { [key: string]: number | null } = {
    extraversion: null,
    agreeableness: null,
    conscientiousness: null,
    emotionalStability: null,
    openness: null,
  }

  if (scoringKeysByInstrument['TIPI'] && responsesByInstrument['TIPI']) {
    const tipiResponses = responsesByInstrument['TIPI']

    Object.keys(scoringKeysByInstrument['TIPI']).forEach((subscale) => {
      const items = scoringKeysByInstrument['TIPI'][subscale]
      let sum = 0
      let count = 0

      items.forEach((item) => {
        const response = tipiResponses.find(
          (r) => r.question.orderIndex === parseInt(item.itemId)
        )
        if (response) {
          const rawValue = parseFloat(response.value)
          const scaleMin = response.question.scaleMin || 1
          const scaleMax = response.question.scaleMax || 7
          const scoredValue = item.reverse
            ? scaleMin + scaleMax - rawValue
            : rawValue
          sum += scoredValue * item.weight
          count++
        }
      })

      if (count > 0) {
        tipiScores[subscale] = sum / count
      }
    })
  }

  // ===== MONEY MINDSET (MAS) SCORING =====
  const moneyFactors: { [key: string]: number } = {}

  if (scoringKeysByInstrument['MAS'] && responsesByInstrument['MAS']) {
    const masResponses = responsesByInstrument['MAS']

    Object.keys(scoringKeysByInstrument['MAS']).forEach((subscale) => {
      const items = scoringKeysByInstrument['MAS'][subscale]
      let sum = 0
      let count = 0

      items.forEach((item) => {
        const response = masResponses.find(
          (r) => r.question.orderIndex === parseInt(item.itemId)
        )
        if (response) {
          const rawValue = parseFloat(response.value)
          const scaleMin = response.question.scaleMin || 1
          const scaleMax = response.question.scaleMax || 5
          const scoredValue = item.reverse
            ? scaleMin + scaleMax - rawValue
            : rawValue
          sum += scoredValue * item.weight
          count++
        }
      })

      if (count > 0) {
        moneyFactors[subscale] = sum / count
      }
    })
  }

  // Save computed scores
  const computedScores = await prisma.computedScores.upsert({
    where: { profileId },
    update: {
      valuesSubscales: JSON.stringify(valuesSubscales),
      valuesCentered: JSON.stringify(valuesCentered),
      attachmentAnxiety,
      attachmentAvoidance,
      extraversion: tipiScores.extraversion,
      agreeableness: tipiScores.agreeableness,
      conscientiousness: tipiScores.conscientiousness,
      emotionalStability: tipiScores.emotionalStability,
      openness: tipiScores.openness,
      moneyFactors: JSON.stringify(moneyFactors),
      computedAt: new Date(),
    },
    create: {
      profileId,
      valuesSubscales: JSON.stringify(valuesSubscales),
      valuesCentered: JSON.stringify(valuesCentered),
      attachmentAnxiety,
      attachmentAvoidance,
      extraversion: tipiScores.extraversion,
      agreeableness: tipiScores.agreeableness,
      conscientiousness: tipiScores.conscientiousness,
      emotionalStability: tipiScores.emotionalStability,
      openness: tipiScores.openness,
      moneyFactors: JSON.stringify(moneyFactors),
    },
  })

  return computedScores
}

export async function getComputedScores(profileId: string) {
  const scores = await prisma.computedScores.findUnique({
    where: { profileId },
  })

  if (!scores) return null

  return {
    valuesSubscales: JSON.parse(scores.valuesSubscales),
    valuesCentered: JSON.parse(scores.valuesCentered),
    attachmentAnxiety: scores.attachmentAnxiety,
    attachmentAvoidance: scores.attachmentAvoidance,
    extraversion: scores.extraversion,
    agreeableness: scores.agreeableness,
    conscientiousness: scores.conscientiousness,
    emotionalStability: scores.emotionalStability,
    openness: scores.openness,
    moneyFactors: JSON.parse(scores.moneyFactors),
    computedAt: scores.computedAt,
  }
}
