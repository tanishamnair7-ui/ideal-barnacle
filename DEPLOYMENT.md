# Deploying to Vercel

This guide explains how to deploy the Relationship Profile Assessment app to Vercel for demonstration purposes.

## ⚠️ Important Privacy Notice

**The Vercel deployment is for DEMONSTRATION ONLY.**

- The deployed version stores data in a Vercel Postgres database (cloud-based)
- This is **NOT privacy-first** - data is stored on Vercel's servers
- For actual private use with local storage, run the app on your own machine

The Vercel deployment is useful for:
- Portfolio demonstrations
- Testing the user experience
- Sharing with stakeholders
- Previewing changes

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free tier works)
2. A [GitHub account](https://github.com/signup) with this repository
3. The Vercel CLI installed (optional): `npm i -g vercel`

## Deployment Steps

### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub** (already done!)

2. **Go to [Vercel](https://vercel.com) and sign in**

3. **Import your GitHub repository:**
   - Click "Add New Project"
   - Select your repository: `tanishamnair7-ui/ideal-barnacle`
   - Select the branch: `claude/compatibility-assessment-app-c5Zsz` (or merge to main first)

4. **Configure the project:**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (leave as is)
   - Build Command: `prisma generate && next build` (should be auto-set from vercel.json)
   - Install Command: `npm install` (auto-set)

5. **Add Vercel Postgres:**
   - In your Vercel project dashboard, go to the "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose a region close to your target users
   - Click "Create"

   Vercel will automatically set the `DATABASE_URL` environment variable.

6. **Seed the database:**
   After the first deployment, you need to seed the questions:

   ```bash
   # Install Vercel CLI if you haven't
   npm i -g vercel

   # Link to your project
   vercel link

   # Pull environment variables
   vercel env pull .env.local

   # Run seed script
   npm run seed
   ```

   Alternatively, you can create a seed API endpoint and call it once after deployment.

7. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete (2-3 minutes)
   - Your app will be live at `https://your-project-name.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

   Follow the prompts:
   - Set up and deploy: Yes
   - Which scope: Choose your account
   - Link to existing project: No
   - Project name: (press Enter for default)
   - Directory: `./` (press Enter)
   - Override settings: No

4. **Add Postgres database:**
   - Go to your project in the Vercel dashboard
   - Navigate to Storage → Create Database → Postgres
   - The DATABASE_URL will be automatically set

5. **Redeploy to use the database:**
   ```bash
   vercel --prod
   ```

6. **Seed the database:**
   ```bash
   vercel env pull .env.local
   npm run seed
   ```

## Post-Deployment Setup

### Seed the Question Bank

After your first deployment, you need to populate the database with questions:

#### Method 1: Via Local Seed Script (Recommended)

```bash
# Pull environment variables from Vercel
vercel env pull .env.local

# Run the seed script (connects to Vercel Postgres)
npm run seed
```

#### Method 2: Via API Endpoint (Advanced)

You could create a protected API endpoint that runs the seed when called:

1. Create `/app/api/seed/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { seedDatabase } from '@/prisma/seed-function'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')

  // Simple auth - use a secure token
  if (authHeader !== `Bearer ${process.env.SEED_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await seedDatabase()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 })
  }
}
```

2. Set `SEED_TOKEN` environment variable in Vercel
3. Call the endpoint once:
```bash
curl -X POST https://your-app.vercel.app/api/seed \
  -H "Authorization: Bearer YOUR_SECRET_TOKEN"
```

### Environment Variables

Vercel automatically sets:
- `DATABASE_URL` (from Vercel Postgres)
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

You may want to add:
- `SEED_TOKEN` (if using Method 2 for seeding)

## Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Continuous Deployment

Vercel automatically redeploys when you push to your GitHub repository:

```bash
git add .
git commit -m "Update feature"
git push origin claude/compatibility-assessment-app-c5Zsz
```

Vercel will detect the push and deploy automatically.

## Troubleshooting

### Build Fails

Check the build logs in Vercel dashboard. Common issues:
- Missing environment variables
- Prisma client generation failed
- TypeScript errors

Solution:
```bash
# Test build locally first
npm run build
```

### Database Connection Issues

Verify environment variables:
```bash
vercel env pull .env.local
cat .env.local | grep DATABASE_URL
```

### Questions Not Showing Up

You likely forgot to seed the database:
```bash
vercel env pull .env.local
npm run seed
```

### Prisma Client Issues

If you see "PrismaClient is unable to run in this browser environment":
- This is expected in browser DevTools
- The Prisma client only runs server-side in API routes
- Check your API routes are using server-side code only

## Monitoring

Monitor your app in the Vercel dashboard:
- **Analytics**: Page views, performance
- **Logs**: Runtime logs, errors
- **Speed Insights**: Core Web Vitals
- **Usage**: Bandwidth, function invocations

## Costs

Vercel free tier includes:
- Unlimited deployments
- 100 GB bandwidth/month
- Serverless function executions
- Vercel Postgres: 256 MB storage (60 hours compute)

For production use or high traffic, consider upgrading to Pro ($20/month).

## Reverting to Local SQLite

If you want to go back to local SQLite for development:

1. Edit `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `.env`:
   ```
   DATABASE_URL="file:./prisma/dev.db"
   ```

3. Reset and seed:
   ```bash
   rm prisma/dev.db
   npx prisma db push
   npm run seed
   ```

## Adding Demo Disclaimer

Add a banner to the deployed version to remind users this is a demo:

Edit `app/layout.tsx` to include:
```tsx
{process.env.VERCEL && (
  <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2 text-center text-sm">
    <strong>Demo Mode:</strong> This deployment stores data on Vercel's servers.
    For privacy-first local use, run on your own machine.
  </div>
)}
```

## Security Considerations

For the Vercel deployment:
- No user authentication is implemented
- Anyone with the URL can create profiles
- Consider adding basic auth for production use
- Rate limiting may be needed for public deployment

---

**Ready to deploy?** Start with Option A (Vercel Dashboard) for the easiest experience!
