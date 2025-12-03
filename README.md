# VerifySL

A public directory platform for verifying business legitimacy in Sierra Leone. Built with Next.js, Supabase, and Prisma.

## 🎯 Problem Statement

Citizens, banks, and foreign investors cannot easily verify whether a business is legitimate in Sierra Leone. Fake businesses on social media and scattered official records create risk for consumers and investors.

## ✨ Features

### Phase 1 (Completed)
- ✅ Modern Next.js web application
- ✅ Admin authentication system (Supabase Auth)
- ✅ Database schema for businesses and admins (Prisma + PostgreSQL)
- ✅ Secure admin dashboard
- ✅ Responsive UI components (Radix UI + Tailwind CSS)

### Phase 2 (Completed)
- ✅ **Business Search** - Search by name (fuzzy) or registration number (exact)
- ✅ **Verified Business Badge** - Visual indicator with verification dates
- ✅ **Business Profile Pages** - Detailed business information with:
  - Registration details and owner information
  - Contact information (address, phone, email)
  - QR code for easy sharing
  - Verification status and date
  - Responsive layout
- ✅ **Admin Verification Workflow** - Manage business verifications
  - View all businesses
  - Verify/unverify businesses
  - Track verification statistics
  - Real-time dashboard updates

### Future Phases
- SMS platform support (search via SMS)
- Blockchain verification (Solana + IPFS)
- Advanced analytics and reporting
- Email notifications
- Public API for third-party integrations

## 🚀 Tech Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **Styling**: Tailwind CSS v4, Radix UI
- **Backend**: Supabase (PostgreSQL, Auth)
- **ORM**: Prisma 5.19
- **Icons**: Lucide React
- **Date Formatting**: date-fns
- **QR Code Generation**: qrcode
- **Future**: Typesense (search), Solana (blockchain), IPFS (storage)

## 📋 Prerequisites

- Node.js >= 18.17.0 (currently using 18.16.0, upgrade recommended)
- pnpm (package manager)
- Supabase account and project
- PostgreSQL database (via Supabase)

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd VerifySL
pnpm install

# Install Phase 2 dependencies
pnpm add qrcode date-fns
pnpm add -D @types/qrcode
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
\`\`\`

Required environment variables:

\`\`\`env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/verifysl?schema=public"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# App
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
NODE_ENV=development
\`\`\`

### 3. Database Setup

Run Prisma migrations to create the database schema:

\`\`\`bash
pnpm prisma generate
pnpm prisma db push
\`\`\`

### 4. Create Admin User in Supabase

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Create a new user with email/password
4. This user will be able to access the admin dashboard

### 5. Run Development Server

\`\`\`bash
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

\`\`\`
VerifySL/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin routes
│   │   ├── dashboard/     # Admin dashboard
│   │   └── login/         # Admin login
│   ├── auth/              # Auth routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   └── ui/               # UI components (Button, Card, Input, etc.)
├── lib/                  # Utility functions
│   ├── prisma.ts         # Prisma client
│   ├── supabase/         # Supabase clients
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
├── types/                # TypeScript types
└── public/               # Static assets
\`\`\`

## 🗄️ Database Schema

### Business Model
- Name, registration number (unique), owner
- Contact information (address, phone, email)
- Business type, date registered
- Verification status, verified by, verified at
- IPFS hash (documents), Solana hash (blockchain anchor)

### Admin Model
- Email (unique), password (hashed)
- Name, created/updated timestamps

## 🔐 Authentication

The admin authentication system uses **Supabase Auth** with email/password authentication.

### Access Admin Dashboard
1. Navigate to `/admin/login`
2. Enter your Supabase user credentials
3. Access the dashboard at `/admin/dashboard`

## 📜 Available Scripts

\`\`\`bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm prisma generate  # Generate Prisma client
pnpm prisma db push   # Push schema to database
pnpm prisma studio    # Open Prisma Studio (database GUI)
\`\`\`

## 🎨 UI Components

Built with Radix UI primitives for accessibility and customization:
- Button (multiple variants)
- Card (with header, content, footer)
- Input (form inputs)
- Label (accessible form labels)

## 🚧 Known Issues & Limitations

- Node.js 18.16.0 is below the recommended version (18.17.0+)
- Prisma CLI may have compatibility issues with Node 18.16.0 (using Prisma 5.19.0 for compatibility)
- Database migrations require manual Supabase configuration
- SMS functionality not yet implemented

## 📝 Next Steps

1. Set up Supabase database and configure connection string
2. Create admin users in Supabase Auth
3. Implement business search functionality
4. Add business registration form
5. Implement verification workflow
6. Add Typesense for advanced search
7. Integrate Solana + IPFS for blockchain verification

## 🤝 Contributing

This is a government project for Sierra Leone business verification. Please follow the PRD requirements when contributing.

## 📄 License

Proprietary - Government of Sierra Leone

---

**VerifySL** - Building trust in Sierra Leone's business ecosystem 🇸🇱
