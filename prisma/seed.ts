import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Clear existing data
  await prisma.computedScores.deleteMany()
  await prisma.response.deleteMany()
  await prisma.scoringKey.deleteMany()
  await prisma.question.deleteMany()
  await prisma.profile.deleteMany()

  console.log('Cleared existing data')

  // ===== SECTION A: BASICS =====
  const basicsQuestions = [
    {
      sectionId: 'basics',
      instrument: 'BASICS',
      orderIndex: 1,
      prompt: 'What would you like us to call you?',
      responseType: 'text',
      required: true,
    },
    {
      sectionId: 'basics',
      instrument: 'BASICS',
      orderIndex: 2,
      prompt: 'Age range (optional)',
      responseType: 'single_choice',
      options: JSON.stringify(['18-24', '25-29', '30-34', '35-39', '40-49', '50+', 'Prefer not to say']),
      required: false,
    },
    {
      sectionId: 'basics',
      instrument: 'BASICS',
      orderIndex: 3,
      prompt: 'Gender identity (optional)',
      responseType: 'single_choice',
      options: JSON.stringify(['Woman', 'Man', 'Non-binary', 'Prefer to self-describe', 'Prefer not to say']),
      required: false,
    },
    {
      sectionId: 'basics',
      instrument: 'BASICS',
      orderIndex: 4,
      prompt: 'Open to dating (optional)',
      responseType: 'single_choice',
      options: JSON.stringify(['Women', 'Men', 'Everyone', 'Prefer not to say']),
      required: false,
    },
  ]

  await prisma.question.createMany({ data: basicsQuestions })
  console.log('Created basics questions')

  // ===== SECTION B: NON-NEGOTIABLES =====
  const nonNegQuestions = [
    {
      sectionId: 'nonneg',
      instrument: 'NONNEG',
      orderIndex: 1,
      prompt: 'Do you want children (now or in the future)?',
      responseType: 'single_choice',
      options: JSON.stringify(['Yes, definitely', 'Open to it', 'Unsure', 'Probably not', 'Definitely not', 'Already have children', 'Not sure']),
      required: true,
    },
    {
      sectionId: 'nonneg',
      instrument: 'NONNEG',
      orderIndex: 2,
      prompt: 'How important is religion/spirituality in your life?',
      responseType: 'single_choice',
      options: JSON.stringify(['Very important', 'Somewhat important', 'Not very important', 'Not important at all', 'Not sure']),
      required: true,
    },
    {
      sectionId: 'nonneg',
      instrument: 'NONNEG',
      orderIndex: 3,
      prompt: 'Would you date someone with a very different political view?',
      responseType: 'single_choice',
      options: JSON.stringify(['Yes', 'Maybe', 'No', 'Not sure']),
      required: true,
    },
    {
      sectionId: 'nonneg',
      instrument: 'NONNEG',
      orderIndex: 4,
      prompt: 'Do you smoke or vape?',
      responseType: 'single_choice',
      options: JSON.stringify(['Never', 'Occasionally', 'Regularly', 'Trying to quit', 'Not sure']),
      required: true,
    },
    {
      sectionId: 'nonneg',
      instrument: 'NONNEG',
      orderIndex: 5,
      prompt: 'How often do you drink alcohol?',
      responseType: 'single_choice',
      options: JSON.stringify(['Never', 'Rarely', 'Socially', 'Regularly', 'Prefer not to say']),
      required: true,
    },
    {
      sectionId: 'nonneg',
      instrument: 'NONNEG',
      orderIndex: 6,
      prompt: 'Would you date someone who has pets?',
      responseType: 'single_choice',
      options: JSON.stringify(['Love pets!', 'Yes', 'Depends on the pet', 'Allergic but flexible', 'No', 'Not sure']),
      required: true,
    },
    {
      sectionId: 'nonneg',
      instrument: 'NONNEG',
      orderIndex: 7,
      prompt: 'Ideal living arrangement?',
      responseType: 'single_choice',
      options: JSON.stringify(['Urban/city', 'Suburban', 'Rural', 'Flexible', 'Not sure']),
      required: true,
    },
    {
      sectionId: 'nonneg',
      instrument: 'NONNEG',
      orderIndex: 8,
      prompt: 'How do you feel about long-distance relationships?',
      responseType: 'single_choice',
      options: JSON.stringify(['Open to it', 'Would consider', 'Prefer not', 'Absolutely not', 'Not sure']),
      required: true,
    },
    {
      sectionId: 'nonneg',
      instrument: 'NONNEG',
      orderIndex: 9,
      prompt: 'Do you have any dietary preferences or restrictions?',
      responseType: 'single_choice',
      options: JSON.stringify(['None', 'Vegetarian', 'Vegan', 'Pescatarian', 'Religious dietary laws', 'Allergies', 'Other']),
      required: true,
    },
    {
      sectionId: 'nonneg',
      instrument: 'NONNEG',
      orderIndex: 10,
      prompt: 'Relationship goal right now?',
      responseType: 'single_choice',
      options: JSON.stringify(['Long-term relationship', 'Marriage', 'Companionship', 'Exploring', 'Not sure yet']),
      required: true,
    },
  ]

  await prisma.question.createMany({ data: nonNegQuestions })
  console.log('Created non-negotiables questions')

  // ===== SECTION C: VALUES (PVQ-21 PLACEHOLDERS) =====
  // NOTE: These are PLACEHOLDER items. Replace with actual PVQ-21 items if licensed.
  // The PVQ-21 measures 10 values: Self-Direction, Stimulation, Hedonism, Achievement,
  // Power, Security, Conformity, Tradition, Benevolence, Universalism
  const valuesQuestions = []
  for (let i = 1; i <= 21; i++) {
    valuesQuestions.push({
      sectionId: 'values',
      instrument: 'PVQ',
      orderIndex: i,
      prompt: `Values Item ${i} placeholder - This person thinks [value-related behavior] is important. (Replace with actual PVQ item text)`,
      responseType: 'likert',
      scaleMin: 1,
      scaleMax: 6,
      scaleLabels: JSON.stringify({
        1: 'Not like me at all',
        6: 'Very much like me'
      }),
      required: true,
    })
  }

  await prisma.question.createMany({ data: valuesQuestions })
  console.log('Created PVQ values questions (placeholders)')

  // ===== SECTION D: ATTACHMENT (ECR-S PLACEHOLDERS) =====
  // NOTE: These are PLACEHOLDER items. Replace with actual ECR-S items if licensed.
  // The ECR-S measures Anxiety and Avoidance dimensions
  const attachmentQuestions = []
  for (let i = 1; i <= 12; i++) {
    attachmentQuestions.push({
      sectionId: 'attachment',
      instrument: 'ECRS',
      orderIndex: i,
      prompt: `Attachment Item ${i} placeholder - [Statement about relationships and closeness]. (Replace with actual ECR-S item text)`,
      responseType: 'likert',
      scaleMin: 1,
      scaleMax: 7,
      scaleLabels: JSON.stringify({
        1: 'Strongly disagree',
        4: 'Neutral',
        7: 'Strongly agree'
      }),
      required: true,
    })
  }

  await prisma.question.createMany({ data: attachmentQuestions })
  console.log('Created ECR-S attachment questions (placeholders)')

  // ===== SECTION E: PERSONALITY (TIPI PLACEHOLDERS) =====
  // NOTE: These are PLACEHOLDER items. Replace with actual TIPI items if needed.
  // The TIPI measures Big Five: Extraversion, Agreeableness, Conscientiousness,
  // Emotional Stability, Openness (2 items per trait)
  const tipiQuestions = []
  const tipiPlaceholders = [
    'Personality Item 1 placeholder - I see myself as extraverted, enthusiastic.',
    'Personality Item 2 placeholder - I see myself as critical, quarrelsome. (reverse)',
    'Personality Item 3 placeholder - I see myself as dependable, self-disciplined.',
    'Personality Item 4 placeholder - I see myself as anxious, easily upset. (reverse)',
    'Personality Item 5 placeholder - I see myself as open to new experiences, complex.',
    'Personality Item 6 placeholder - I see myself as reserved, quiet. (reverse)',
    'Personality Item 7 placeholder - I see myself as sympathetic, warm.',
    'Personality Item 8 placeholder - I see myself as disorganized, careless. (reverse)',
    'Personality Item 9 placeholder - I see myself as calm, emotionally stable.',
    'Personality Item 10 placeholder - I see myself as conventional, uncreative. (reverse)',
  ]

  for (let i = 1; i <= 10; i++) {
    tipiQuestions.push({
      sectionId: 'personality',
      instrument: 'TIPI',
      orderIndex: i,
      prompt: tipiPlaceholders[i - 1],
      responseType: 'likert',
      scaleMin: 1,
      scaleMax: 7,
      scaleLabels: JSON.stringify({
        1: 'Disagree strongly',
        4: 'Neither agree nor disagree',
        7: 'Agree strongly'
      }),
      required: true,
    })
  }

  await prisma.question.createMany({ data: tipiQuestions })
  console.log('Created TIPI personality questions (placeholders)')

  // ===== SECTION F: MONEY MINDSET (MAS PLACEHOLDERS) =====
  // NOTE: These are PLACEHOLDER items. Replace with actual Money Attitude Scale items if licensed.
  // Typical factors: Security, Retention, Power/Prestige, Distrust, Anxiety
  const moneyQuestions = []
  for (let i = 1; i <= 29; i++) {
    moneyQuestions.push({
      sectionId: 'money',
      instrument: 'MAS',
      orderIndex: i,
      prompt: `Money Mindset Item ${i} placeholder - [Statement about money attitudes]. (Replace with actual MAS item text)`,
      responseType: 'likert',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: JSON.stringify({
        1: 'Strongly disagree',
        3: 'Neutral',
        5: 'Strongly agree'
      }),
      required: true,
    })
  }

  await prisma.question.createMany({ data: moneyQuestions })
  console.log('Created MAS money mindset questions (placeholders)')

  // ===== SCORING KEYS =====

  // PVQ SCORING KEY (PLACEHOLDER MAPPING)
  // This is a simplified placeholder. Actual PVQ-21 has specific items for each value.
  // Replace these mappings with correct item-to-subscale assignments.
  const pvqScoringKeys = [
    // Self-Direction: items 1, 11 (placeholder)
    { instrument: 'PVQ', itemId: '1', subscale: 'selfDirection', reverse: false },
    { instrument: 'PVQ', itemId: '11', subscale: 'selfDirection', reverse: false },
    // Stimulation: items 6, 15 (placeholder)
    { instrument: 'PVQ', itemId: '6', subscale: 'stimulation', reverse: false },
    { instrument: 'PVQ', itemId: '15', subscale: 'stimulation', reverse: false },
    // Hedonism: items 10, 21 (placeholder)
    { instrument: 'PVQ', itemId: '10', subscale: 'hedonism', reverse: false },
    { instrument: 'PVQ', itemId: '21', subscale: 'hedonism', reverse: false },
    // Achievement: items 4, 13 (placeholder)
    { instrument: 'PVQ', itemId: '4', subscale: 'achievement', reverse: false },
    { instrument: 'PVQ', itemId: '13', subscale: 'achievement', reverse: false },
    // Power: items 2, 17 (placeholder)
    { instrument: 'PVQ', itemId: '2', subscale: 'power', reverse: false },
    { instrument: 'PVQ', itemId: '17', subscale: 'power', reverse: false },
    // Security: items 5, 14 (placeholder)
    { instrument: 'PVQ', itemId: '5', subscale: 'security', reverse: false },
    { instrument: 'PVQ', itemId: '14', subscale: 'security', reverse: false },
    // Conformity: items 7, 16 (placeholder)
    { instrument: 'PVQ', itemId: '7', subscale: 'conformity', reverse: false },
    { instrument: 'PVQ', itemId: '16', subscale: 'conformity', reverse: false },
    // Tradition: items 9, 20 (placeholder)
    { instrument: 'PVQ', itemId: '9', subscale: 'tradition', reverse: false },
    { instrument: 'PVQ', itemId: '20', subscale: 'tradition', reverse: false },
    // Benevolence: items 12, 18 (placeholder)
    { instrument: 'PVQ', itemId: '12', subscale: 'benevolence', reverse: false },
    { instrument: 'PVQ', itemId: '18', subscale: 'benevolence', reverse: false },
    // Universalism: items 3, 8, 19 (placeholder)
    { instrument: 'PVQ', itemId: '3', subscale: 'universalism', reverse: false },
    { instrument: 'PVQ', itemId: '8', subscale: 'universalism', reverse: false },
    { instrument: 'PVQ', itemId: '19', subscale: 'universalism', reverse: false },
  ]

  await prisma.scoringKey.createMany({ data: pvqScoringKeys })
  console.log('Created PVQ scoring keys (placeholder)')

  // ECR-S SCORING KEY (PLACEHOLDER)
  // Anxiety: items 1, 3, 5, 7, 9, 11 (placeholder)
  // Avoidance: items 2, 4, 6, 8, 10, 12 (placeholder)
  const ecrsScoringKeys = [
    { instrument: 'ECRS', itemId: '1', subscale: 'anxiety', reverse: false },
    { instrument: 'ECRS', itemId: '3', subscale: 'anxiety', reverse: false },
    { instrument: 'ECRS', itemId: '5', subscale: 'anxiety', reverse: false },
    { instrument: 'ECRS', itemId: '7', subscale: 'anxiety', reverse: false },
    { instrument: 'ECRS', itemId: '9', subscale: 'anxiety', reverse: false },
    { instrument: 'ECRS', itemId: '11', subscale: 'anxiety', reverse: false },
    { instrument: 'ECRS', itemId: '2', subscale: 'avoidance', reverse: false },
    { instrument: 'ECRS', itemId: '4', subscale: 'avoidance', reverse: false },
    { instrument: 'ECRS', itemId: '6', subscale: 'avoidance', reverse: false },
    { instrument: 'ECRS', itemId: '8', subscale: 'avoidance', reverse: false },
    { instrument: 'ECRS', itemId: '10', subscale: 'avoidance', reverse: false },
    { instrument: 'ECRS', itemId: '12', subscale: 'avoidance', reverse: false },
  ]

  await prisma.scoringKey.createMany({ data: ecrsScoringKeys })
  console.log('Created ECR-S scoring keys (placeholder)')

  // TIPI SCORING KEY (STABLE MAPPING - based on standard TIPI)
  // This is the correct TIPI structure with proper reverse scoring
  const tipiScoringKeys = [
    { instrument: 'TIPI', itemId: '1', subscale: 'extraversion', reverse: false },
    { instrument: 'TIPI', itemId: '6', subscale: 'extraversion', reverse: true },
    { instrument: 'TIPI', itemId: '7', subscale: 'agreeableness', reverse: false },
    { instrument: 'TIPI', itemId: '2', subscale: 'agreeableness', reverse: true },
    { instrument: 'TIPI', itemId: '3', subscale: 'conscientiousness', reverse: false },
    { instrument: 'TIPI', itemId: '8', subscale: 'conscientiousness', reverse: true },
    { instrument: 'TIPI', itemId: '9', subscale: 'emotionalStability', reverse: false },
    { instrument: 'TIPI', itemId: '4', subscale: 'emotionalStability', reverse: true },
    { instrument: 'TIPI', itemId: '5', subscale: 'openness', reverse: false },
    { instrument: 'TIPI', itemId: '10', subscale: 'openness', reverse: true },
  ]

  await prisma.scoringKey.createMany({ data: tipiScoringKeys })
  console.log('Created TIPI scoring keys (stable)')

  // MAS SCORING KEY (PLACEHOLDER)
  // Typical factors: security, retention, power, distrust, anxiety
  // This is a simplified placeholder mapping
  const masScoringKeys = [
    // Security factor: items 1-6
    ...Array.from({ length: 6 }, (_, i) => ({
      instrument: 'MAS',
      itemId: String(i + 1),
      subscale: 'security',
      reverse: false,
    })),
    // Retention factor: items 7-12
    ...Array.from({ length: 6 }, (_, i) => ({
      instrument: 'MAS',
      itemId: String(i + 7),
      subscale: 'retention',
      reverse: false,
    })),
    // Power/Prestige: items 13-18
    ...Array.from({ length: 6 }, (_, i) => ({
      instrument: 'MAS',
      itemId: String(i + 13),
      subscale: 'power',
      reverse: false,
    })),
    // Distrust: items 19-24
    ...Array.from({ length: 6 }, (_, i) => ({
      instrument: 'MAS',
      itemId: String(i + 19),
      subscale: 'distrust',
      reverse: false,
    })),
    // Anxiety: items 25-29
    ...Array.from({ length: 5 }, (_, i) => ({
      instrument: 'MAS',
      itemId: String(i + 25),
      subscale: 'anxiety',
      reverse: false,
    })),
  ]

  await prisma.scoringKey.createMany({ data: masScoringKeys })
  console.log('Created MAS scoring keys (placeholder)')

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
