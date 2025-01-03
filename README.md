# Social Media Platform

A modern social media platform built with Next.js 13, featuring a sleek dark theme design and real-time interactions. This platform allows users to share thoughts, engage with others through likes and comments, and maintain their own profiles.

## Features

### User Experience
- 🌙 Beautiful dark theme design
- 📱 Fully responsive layout
- 🚀 Fast and seamless navigation
- ⚡ Real-time updates

### Authentication
- 📧 Email/Password authentication
- 🔐 Secure user sessions
- 🔄 Google OAuth integration

### Social Features
- ✍️ Create and share tweets
- ❤️ Like posts
- 💬 Comment on tweets
- 👤 User profiles
- 📊 Tweet engagement tracking

### Technical Features
- 🔒 Secure authentication with NextAuth.js
- 📦 SQLite database with Prisma ORM
- 🎨 Styling with Tailwind CSS
- 🏗️ Built with TypeScript

## Tech Stack

- **Framework**: Next.js 13 with App Router
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/social-media.git
cd social-media
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Set up your environment variables in `.env`:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

5. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

6. Run the development server:
```bash
npm run dev
# or
yarn dev
```

7. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── app/                  # Next.js 13 app directory
│   ├── api/             # API routes
│   ├── auth/            # Authentication pages
│   └── profile/         # Profile pages
├── components/          # React components
├── lib/                 # Utility functions
├── prisma/             # Database schema and migrations
└── public/             # Static files
```

## Features in Detail

### Authentication
- Secure email/password authentication
- Google OAuth integration
- Protected routes and API endpoints

### Tweet Management
- Create, read, and delete tweets
- Like and unlike tweets
- Comment on tweets
- View tweet engagement metrics

### User Profiles
- Customizable user profiles
- View user's tweets
- Track user engagement

### Real-time Updates
- Instant tweet updates
- Real-time like and comment counts
- Seamless user experience

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)

#   n e x t j s - s o c i a l - m e d i a 
 
 