# ChatFlow — Real-Time Chat Application

A polished real-time chat application built with React, Vite, and Supabase.

## Features

- 🔐 **Authentication** — Sign up & sign in with email/password (email confirmation required)
- 💬 **Real-time messaging** — Messages appear instantly via Supabase WebSocket subscriptions
- 📜 **Message history** — Previous messages load automatically on page visit
- 🌙 **Dark / Light mode** — Toggle with persistence across sessions
- 📱 **Responsive design** — Works on desktop and mobile
- 🎨 **Soothing UI** — Purple/indigo design system with smooth animations

## Tech Stack

- **Frontend**: React 19 + Vite
- **Backend**: Supabase (Auth, Postgres, Realtime)
- **Styling**: Vanilla CSS with custom properties
- **Routing**: React Router DOM

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run database migration

Copy the contents of `supabase_migration.sql` into your Supabase SQL Editor and run it.

### 4. Start development server

```bash
npm run dev
```

## Deployment (Vercel)

1. Push to GitHub
2. Import in Vercel — auto-detects Vite
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables
4. Add your Vercel URL to Supabase **Authentication → URL Configuration → Redirect URLs**

## Project Structure

```
src/
├── main.jsx              # Entry point
├── App.jsx               # Routes
├── index.css             # Design system
├── lib/supabase.js       # Supabase client
├── context/
│   ├── ThemeContext.jsx   # Dark/light mode
│   └── AuthContext.jsx    # Authentication state
├── components/
│   ├── ThemeToggle.jsx    # Theme switch button
│   ├── MessageBubble.jsx  # Chat message
│   └── ProtectedRoute.jsx # Auth guard
└── pages/
    ├── Login.jsx          # Sign In / Sign Up
    └── Dashboard.jsx      # Chat interface
```
