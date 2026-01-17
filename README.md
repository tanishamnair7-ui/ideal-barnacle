# Relationship Compatibility Assessment App

A privacy-first web application for creating comprehensive relationship compatibility profiles. This app allows users to complete a multi-section assessment covering values, attachment style, personality traits, and relationship preferences.

## Features

### Core Functionality
- **Multi-section Assessment**: 6 sections covering basics, non-negotiables, values (PVQ-21), attachment (ECR-S), personality (TIPI), and money mindset (MAS)
- **Autosave Progress**: Automatically saves after each answer, allowing users to pause and resume anytime
- **Privacy-First**: All data stored locally in SQLite database on your device
- **Visual Profile**: Beautiful profile page with interactive charts showing your results
- **Export Options**: Download your profile as JSON or CSV

### UX Features
- One question per screen for focused engagement
- Progress bar with percentage and time estimates
- Optional breaks between sections
- Mobile-first, responsive design
- Accessible keyboard navigation

### Assessment Sections

1. **Basics** (4 questions): Name, age range, gender identity, dating preferences
2. **Non-Negotiables** (10 questions): Relationship dealbreakers and preferences
3. **Values** (21 items): PVQ-21 placeholder items measuring 10 core values
4. **Attachment** (12 items): ECR-S placeholder items measuring anxiety and avoidance
5. **Personality** (10 items): TIPI placeholder items measuring Big Five traits
6. **Money Mindset** (29 items, optional): MAS placeholder items measuring financial attitudes

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite with Prisma ORM
- **Charts**: Recharts
- **Runtime**: Node.js

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database and seed questions:
```bash
npm run seed
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
.
├── app/                          # Next.js App Router pages
│   ├── api/                     # API routes
│   │   ├── profiles/           # Profile CRUD operations
│   │   ├── questions/          # Fetch questions
│   │   ├── responses/          # Save responses
│   │   └── scores/             # Compute and fetch scores
│   ├── assessment/[profileId]/ # Assessment flow
│   ├── profile/[profileId]/    # Results page
│   ├── start/                  # Consent page
│   └── page.tsx                # Landing page
├── components/                  # Reusable UI components
│   ├── SectionHeader.tsx       # Progress display
│   ├── LikertScaleRow.tsx      # Likert scale input
│   ├── ChoicePills.tsx         # Single choice input
│   ├── TextInput.tsx           # Text input
│   ├── SaveIndicator.tsx       # Save status
│   └── BreakModal.tsx          # Break prompt
├── lib/                         # Utility modules
│   ├── prisma.ts               # Prisma client
│   └── scoring.ts              # Scoring engine
├── prisma/                      # Database configuration
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed script with question bank
└── README.md
```

## Replacing Placeholder Items

### Important Note on Copyrighted Scales

This app uses **placeholder items** for the following copyrighted psychometric instruments:

- **PVQ-21** (Portrait Values Questionnaire)
- **ECR-S** (Experiences in Close Relationships - Short Form)
- **TIPI** (Ten-Item Personality Inventory)
- **MAS** (Money Attitude Scale)

To use the actual instruments, you must:

1. **Obtain proper licensing** for each scale from the copyright holders
2. **Replace placeholder text** in `prisma/seed.ts` with actual item text
3. **Verify scoring keys** match the official scoring procedures

### How to Replace Items

1. Open `prisma/seed.ts`
2. Find the section for the instrument you want to update (search for comments like `// ===== SECTION C: VALUES (PVQ-21 PLACEHOLDERS) =====`)
3. Replace the placeholder `prompt` text with actual licensed item text
4. Verify the `scaleMin`, `scaleMax`, and `scaleLabels` match the instrument requirements
5. Open `prisma/seed.ts` again and find the scoring key section (search for `// ===== SCORING KEYS =====`)
6. Update the item-to-subscale mappings to match the official scoring procedure
7. Re-run the seed script:
   ```bash
   npm run seed
   ```

### Example Replacement

**Before (placeholder):**
```typescript
prompt: 'Values Item 1 placeholder - This person thinks [value-related behavior] is important. (Replace with actual PVQ item text)'
```

**After (with licensed item):**
```typescript
prompt: 'Thinking up new ideas and being creative is important to them. They like to do things in their own original way.'
```

## Scoring Engine

The scoring engine (`lib/scoring.ts`) implements:

- **Reverse scoring** for negatively-keyed items
- **Values centering** (Schwartz method): subtracts individual mean from each subscale
- **Attachment dimensions**: Anxiety and Avoidance scores
- **Big Five personality**: TIPI scoring with proper reverse coding
- **Money factors**: Average scores across 5 factors

Scores are automatically computed when the assessment is completed and stored in the `ComputedScores` table.

## Data Privacy

- All data is stored locally in `prisma/dev.db` (SQLite database)
- No data is transmitted to external servers
- Users can delete their profile and all associated data at any time from the profile page
- This tool is for **personal use only** and not intended for clinical diagnosis

## API Endpoints

- `POST /api/profiles` - Create new profile
- `GET /api/profiles?profileId=...` - Fetch profile and responses
- `PATCH /api/profiles/[profileId]` - Update profile
- `DELETE /api/profiles/[profileId]` - Delete profile
- `GET /api/questions` - Fetch all questions
- `POST /api/responses` - Save response
- `GET /api/responses?profileId=...` - Fetch responses for profile
- `POST /api/scores` - Compute scores for profile
- `GET /api/scores?profileId=...` - Fetch computed scores

## Development

### Database Management

```bash
# Generate Prisma Client after schema changes
npm run prisma:generate

# Push schema changes to database (development)
npm run prisma:migrate

# Re-seed the database
npm run seed
```

### Adding New Questions

1. Edit `prisma/seed.ts` to add new questions to the appropriate section
2. If adding a new section, update:
   - The seed script to create questions with the new `sectionId`
   - `SECTION_NAMES` in `app/assessment/[profileId]/page.tsx`
   - The scoring engine if the section requires computed scores
3. Re-run `npm run seed`

## License

This project template is open source. However, note that:

- The **psychometric instruments** (PVQ, ECR-S, TIPI, MAS) are copyrighted and require licensing
- Placeholder items are provided for structure only
- You must obtain proper permissions before using actual scale items

## Acknowledgments

This app provides a framework for relationship compatibility assessment. The placeholder items are not validated instruments. For research or clinical use, obtain licensed versions of:

- **PVQ-21**: Schwartz et al. (2001)
- **ECR-S**: Wei et al. (2007)
- **TIPI**: Gosling et al. (2003)
- **MAS**: Yamauchi & Templer (1982)

---

**For personal use only. Not intended for commercial use, clinical diagnosis, or professional relationship counseling.**
