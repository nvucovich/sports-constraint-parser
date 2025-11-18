# Sports Scheduling Constraint Parser

A semantic search interface that translates natural language scheduling objectives into structured constraint templates for sports league scheduling optimization.

![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![Supabase](https://img.shields.io/badge/Supabase-pgvector-green)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-orange)

## Overview

This application allows users to search for sports scheduling constraints using natural language queries. It uses advanced AI to match queries against a database of constraint templates, extract parameters, and provide confidence scores.

**Demo Credentials:**
- Email: `demo@example.com`
- Password: `demo123`

## Features

### Core Functionality
- **Semantic Search**: Natural language to constraint template matching using OpenAI embeddings
- **Real-time Search**: Debounced search that executes as you type (500ms delay)
- **Parameter Extraction**: GPT-4 Mini extracts structured parameters from queries
- **Confidence Scoring**: Dual scoring system combining vector similarity (60%) + GPT assessment (40%)
- **Alternative Interpretations**: Suggests alternatives for ambiguous queries
- **3 Template Types**: Game scheduling, sequence constraints, team patterns (20 examples total)

### User Experience
- **Keyboard Shortcuts**: Esc to clear, Cmd/Ctrl+K to focus search
- **Smooth Animations**: Fade-in results, slide-down parameter expansions
- **Beautiful UI**: Gradient backgrounds, color-coded badges, hover effects
- **Mobile Responsive**: Fully responsive design for all screen sizes
- **Accessibility**: Keyboard navigation, semantic HTML, ARIA labels

### Technical Features
- **Vector Similarity Search**: Supabase pgvector with cosine similarity
- **OpenAI Embeddings**: 1536-dimensional vectors (text-embedding-ada-002)
- **GPT-4 Enhancement**: Intelligent parameter extraction and confidence scoring
- **Authentication**: Supabase Auth with email/password and protected routes
- **Type Safety**: Full TypeScript implementation with strict mode
- **Error Boundaries**: Graceful error handling throughout the app

## Architecture

### Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4

**Backend:**
- Next.js API Routes
- Supabase (PostgreSQL + pgvector)
- OpenAI API (embeddings + chat completions)

**Deployment:**
- Vercel (recommended)
- Supabase Cloud

### Data Flow

```
User Query
    ↓
OpenAI Embeddings API (text-embedding-ada-002)
    ↓
1536-dimensional vector
    ↓
Supabase pgvector similarity search (cosine distance)
    ↓
Top 5 matching constraints
    ↓
GPT-4 Mini (parameter extraction + confidence scoring)
    ↓
Combined confidence score (60% vector + 40% GPT)
    ↓
Ranked results with alternatives
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account ([supabase.com](https://supabase.com))
- OpenAI API key with credits ([platform.openai.com](https://platform.openai.com))

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd sports-constraint-parser
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI (must have credits available)
OPENAI_API_KEY=your_openai_api_key
```

**Where to find these values:**

- **Supabase**: Project Settings → API
  - `NEXT_PUBLIC_SUPABASE_URL`: Project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon/public key
  - `SUPABASE_SERVICE_ROLE_KEY`: service_role key (keep secret!)

- **OpenAI**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

4. **Set up the database**

**Option A: Using Supabase CLI**
```bash
supabase db push
```

**Option B: Manual setup**
1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy contents of `supabase/migrations/20241117000001_create_constraints_table.sql`
4. Run the SQL

This creates:
- The `constraints` table with pgvector support
- Vector similarity search function (`search_constraints`)
- IVFFlat index for performance
- Row Level Security policies

5. **Seed the database with embeddings**

```bash
npm run seed:constraints
```

This generates OpenAI embeddings for 20 constraint examples and inserts them into the database (~30-60 seconds).

6. **Create demo user** (Optional but recommended)

In Supabase Dashboard:
1. Go to Authentication → Users
2. Click "Add User" → "Create new user"
3. Email: `demo@example.com`
4. Password: `demo123`
5. Confirm email (or disable email confirmation in Auth settings)

7. **Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Searching for Constraints

1. **Login** with your credentials or demo account
2. **Automatic redirect** to search page
3. **Start typing** - results appear automatically after 500ms
4. **Click examples** to try predefined queries
5. **Expand parameters** to see structured JSON
6. **View alternatives** for ambiguous queries

### Example Queries

**Game Scheduling (Template 1):**
- "Ensure all rivalry games on a weekend on ESPN"
- "Don't schedule high profile games on weekdays"
- "All primetime games must be on FOX, NBC, or ABC"

**Sequence Constraints (Template 2):**
- "Make sure teams do not play at home on either side of their bye week"
- "No team should have three consecutive away games"
- "Penn State plays at UCLA and USC back-to-back"

**Team Patterns (Template 3):**
- "No cases of 3 games in 3 nights for any NBA team"
- "Every team must have at least 2 primetime games on national TV"
- "At most 2 cases of 3 away games in 4 rounds for Western Conference"

### Keyboard Shortcuts

- **Esc** - Clear search and reset interface
- **Cmd/Ctrl + K** - Focus search input (from anywhere)
- **Enter** - Force immediate search (bypasses debounce)

## Constraint Templates

### Template 1: Game Scheduling Constraints

Controls which games are scheduled in specific rounds, venues, or networks.

**Format:**
```
Ensure that at least <min> and at most <max> games from <games>
are scheduled across <rounds> and played in any venue from <venues>
and assigned to any of <networks>.
```

### Template 2: Sequence Constraints

Controls patterns of consecutive games or events.

**Format:**
```
Ensure at least <min> and at most <max> cases where there is a sequence
<game1>, <game2>, ... across rounds <round1>, <round2>.
```

### Template 3: Team Schedule Pattern Constraints

Controls recurring patterns in team schedules.

**Format:**
```
Ensure that <each/all> teams in <teams> have at least <min> and at most <max> instances
where they play at least <k> and at most <m> <home/away/bye/active> games
across <rounds> assigned to <networks> in <venues>.
```

## Project Structure

```
sports-constraint-parser/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Auth routes (login, signup)
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (protected)/         # Protected routes (search)
│   │   │   ├── layout.tsx       # Auth check
│   │   │   └── search/
│   │   ├── api/
│   │   │   └── search/          # Search API endpoint
│   │   ├── auth/callback/       # OAuth callback handler
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthForm.tsx     # Login/signup form
│   │   ├── search/
│   │   │   ├── SearchInterface.tsx  # Main search UI
│   │   │   └── SearchResult.tsx     # Result card
│   │   └── Navigation.tsx
│   ├── data/
│   │   └── constraint-examples.ts   # 20 constraint examples
│   └── lib/
│       └── supabase/            # Supabase client utilities
│           ├── client.ts
│           ├── server.ts
│           └── middleware.ts
├── scripts/
│   └── seed-constraints.ts      # Database seeding script
├── supabase/
│   └── migrations/              # Database migrations
│       └── 20241117000001_create_constraints_table.sql
└── package.json
```

## Deployment

### Deploy to Vercel

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Import to Vercel**

- Go to [vercel.com](https://vercel.com)
- Click "Import Project"
- Select your GitHub repository
- Framework Preset: Next.js
- Click "Deploy"

3. **Set Environment Variables**

In Vercel dashboard:
- Settings → Environment Variables
- Add each variable from `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `OPENAI_API_KEY`
- Redeploy for changes to take effect

4. **Verify Deployment**

- Test login/signup
- Try example searches
- Check API routes work
- Verify embeddings and GPT-4 integration

### Custom Domain (Optional)

- Settings → Domains
- Add your domain
- Update DNS records as instructed

## Configuration

### Adjust Search Debounce

In `src/components/search/SearchInterface.tsx`:

```typescript
debounceTimer.current = setTimeout(() => {
  performSearch(query)
}, 500) // ← Change delay (milliseconds)
```

### Modify Result Count

In `src/app/api/search/route.ts`:

```typescript
const { data: searchResults } = await supabase
  .rpc('search_constraints', {
    query_embedding: queryEmbedding,
    match_threshold: 0.4,  // ← Minimum similarity
    match_count: 5,         // ← Number of results
  })
```

### Adjust Confidence Scoring

In `src/app/api/search/route.ts`:

```typescript
const finalConfidence = (vectorConfidence * 0.6) + (gptConfidence * 0.4)
// ↑ Change weights (must sum to 1.0)
```

## Testing

### Test Authentication

```bash
# Test signup
1. Go to /signup
2. Create account
3. Check email verification (if enabled)

# Test login
1. Go to /login
2. Enter credentials
3. Should redirect to /search

# Test protected routes
1. Logout
2. Try accessing /search
3. Should redirect to /login

# Test demo credentials
Email: demo@example.com
Password: demo123
```

### Test Search

```bash
✓ "rivalry games weekend ESPN" → Template 1, high confidence
✓ "3 games 3 nights" → Template 3, high confidence
✓ "home bye week" → Template 2, medium confidence
✓ "vague query" → Lower confidence, possibly alternatives
```

## Troubleshooting

### Cannot find table constraints
- Run the database migration in Supabase SQL Editor

### OpenAI API error
- Verify `OPENAI_API_KEY` is set correctly
- Check OpenAI account has credits
- Ensure API key has embeddings + chat permissions

### No search results
- Run: `npm run seed:constraints`
- Check constraints table has 20 rows in Supabase
- Try exact example queries first

### Text too light to read
- Fixed in latest version
- Clear browser cache and refresh

## Performance

- **Average Search Time**: 2-3 seconds
- **Database Query**: 100-300ms
- **OpenAI Embedding**: 500-1000ms
- **GPT-4 Extraction**: 1-2 seconds

## Security

- Row Level Security enabled on all tables
- Service role key kept server-side only
- Environment variables never committed
- Protected routes require authentication
- HTTPS enforced in production

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed:constraints  # Seed database with embeddings
```

## Contributing

This is a developer challenge submission. Feel free to fork and modify!

## License

This project was created as a developer challenge submission.

## Acknowledgments

- OpenAI for embeddings and GPT-4 API
- Supabase for database and authentication
- Vercel for hosting and deployment
- Next.js for the framework

---

Built with Next.js, Supabase, and OpenAI
