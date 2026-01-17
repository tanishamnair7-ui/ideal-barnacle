# Quick Setup Guide

## First-Time Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Seed the database with placeholder questions:**
   ```bash
   npm run seed
   ```

   This will create the SQLite database and populate it with all placeholder questions.

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Using the App

### Complete the Assessment

1. Click "Start Assessment" on the landing page
2. Read and accept the consent form
3. Optionally check "Include sensitive sections" to include money mindset questions
4. Click "Begin Assessment"
5. Answer questions one at a time
   - Your progress is automatically saved after each answer
   - You can click "Exit and Save" at any time to pause
   - Use the "Back" button to review/change previous answers
6. Accept or skip breaks between sections
7. Complete the final question to see your profile

### View Your Profile

After completing the assessment, you'll be redirected to your profile page showing:

- **Non-Negotiables**: Your relationship preferences and dealbreakers
- **Top 5 Values**: Bar chart of your most important centered values
- **Attachment Style**: Visual meters for Anxiety and Avoidance dimensions
- **Personality (Big Five)**: Radar chart of your personality traits
- **Money Mindset** (if enabled): Bar chart of your financial attitudes

### Export Your Data

From your profile page, you can:
- **Export JSON**: Download complete profile data including raw scores
- **Export CSV**: Download scores in spreadsheet format
- **View Raw Data**: Expand the "View Raw Data" section to see all computed scores

### Delete Your Profile

Click "Delete My Data" on your profile page to permanently remove all your assessment data.

## Resuming an In-Progress Assessment

If you exited during the assessment:

1. You'll need to manually navigate to the assessment URL
2. The URL format is: `http://localhost:3000/assessment/[your-profile-id]`
3. Your profile ID was created when you started the assessment
4. The app will automatically resume from where you left off

**Note**: Future versions could add a "Resume" feature on the home page to list in-progress assessments.

## Replacing Placeholder Items

**IMPORTANT**: The current questions are placeholders for copyrighted psychometric scales.

To use actual validated instruments:

1. Obtain proper licensing for:
   - PVQ-21 (Portrait Values Questionnaire)
   - ECR-S (Experiences in Close Relationships)
   - TIPI (Ten-Item Personality Inventory)
   - MAS (Money Attitude Scale)

2. Edit `prisma/seed.ts`:
   - Find the placeholder sections (marked with comments)
   - Replace placeholder `prompt` text with actual licensed items
   - Verify scoring key mappings match official scoring procedures

3. Re-seed the database:
   ```bash
   npm run seed
   ```

## Troubleshooting

### Database Issues

If you encounter database errors:

```bash
# Delete the database and start fresh
rm prisma/dev.db
npm run seed
```

### Port Already in Use

If port 3000 is already in use:

```bash
# Kill the existing process
lsof -ti:3000 | xargs kill -9

# Or start on a different port
PORT=3001 npm run dev
```

### TypeScript Errors

If you see TypeScript errors after making changes:

```bash
# Regenerate Prisma client
npm run prisma:generate

# Rebuild
npm run build
```

## Development Tips

### Viewing the Database

You can use Prisma Studio to view your database:

```bash
npx prisma studio
```

This will open a web interface at `http://localhost:5555` to browse your data.

### Testing Different Profiles

- Create multiple profiles by going through the consent flow again
- Each profile gets a unique ID and stores separate responses
- No user authentication is implemented - this is for local/personal use only

### Modifying Question Text

After obtaining proper licensing, you can modify questions without changing the database structure:

1. Edit `prisma/seed.ts`
2. Run `npm run seed` (this will clear existing questions and responses)
3. Restart the dev server

## Production Deployment

For production use:

```bash
# Build the application
npm run build

# Start production server
npm start
```

The production build will be optimized and minified.

## Privacy Note

- All data stays on your local machine in `prisma/dev.db`
- No analytics or telemetry is collected by this app
- No network requests are made except to localhost
- You can use this completely offline after initial setup

---

For more details, see the main [README.md](README.md)
