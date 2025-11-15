# Sports Scheduling Constraint Parser

A semantic search interface that translates natural language scheduling objectives into structured constraint templates for sports league scheduling optimization.

## 🚀 Features

- **Semantic Search**: Natural language query processing using OpenAI embeddings
- **Template Matching**: Automatically identifies the correct constraint template
- **Parameter Extraction**: Extracts structured parameters from user queries
- **Confidence Scoring**: Provides confidence scores for matches
- **Alternative Interpretations**: Suggests alternatives for ambiguous queries
- **User Authentication**: Secure login system with Supabase Auth

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL + pgvector)
- **Search**: OpenAI Embeddings + Vector Similarity Search
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account
- OpenAI API key
- Git

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/sports-constraint-parser.git
   cd sports-constraint-parser
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Set up the database**
   
   - Go to your Supabase project
   - Navigate to SQL Editor
   - Run the contents of `supabase/schema.sql`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 🗄 Database Setup

The database schema includes:
- `constraint_examples` table with pgvector support
- Vector similarity search function
- Proper indexes for performance
- Row Level Security (RLS) policies

See `supabase/schema.sql` for the complete schema.

## 📚 Constraint Templates

### Template 1: Game Scheduling Constraints
Ensures specific games are scheduled within certain parameters.

**Example**: "Ensure all rivalry games on a weekend on ESPN"

### Template 2: Sequence Constraints
Defines patterns across consecutive rounds.

**Example**: "Make sure Penn State plays at UCLA and at USC in back-to-back weeks"

### Template 3: Team Schedule Pattern Constraints
Controls team-specific scheduling patterns.

**Example**: "No cases of 3 games in 3 nights for any NBA team"

## 🔐 Test Credentials

```
Email: demo@example.com
Password: demo123456
```

*(These will be set up after seeding the database)*

## 🏗 Project Structure

```
sports-constraint-parser/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Authentication pages
│   │   ├── (protected)/     # Protected routes
│   │   └── api/             # API routes
│   ├── components/
│   │   ├── auth/            # Auth components
│   │   └── search/          # Search components
│   ├── lib/
│   │   ├── supabase/        # Supabase clients
│   │   ├── openai.ts        # OpenAI utilities
│   │   └── config.ts        # Configuration
│   └── types/
│       └── index.ts         # TypeScript types
├── supabase/
│   └── schema.sql           # Database schema
└── middleware.ts            # Auth middleware
```

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables
4. Deploy

### Environment Variables on Vercel

Make sure to add all variables from `.env.local` to your Vercel project settings.

## 🤝 Contributing

This is a developer challenge project. Feel free to fork and modify!

## 📝 License

MIT

## 👤 Author

Your Name - [GitHub Profile](https://github.com/YOUR_USERNAME)

## 🔗 Links

- [Live Demo](https://your-demo-url.vercel.app)
- [GitHub Repository](https://github.com/YOUR_USERNAME/sports-constraint-parser)
- [Documentation](https://github.com/YOUR_USERNAME/sports-constraint-parser/wiki)

---

Built with ❤️ for the Sports Scheduling Constraint Parser Challenge