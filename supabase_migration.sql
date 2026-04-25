-- ============================================
-- Supabase Migration for Real-Time Chat App
-- Run this in your Supabase SQL Editor
-- Safe to re-run (idempotent)
-- ============================================

-- 1. Create profiles table (stores user display info)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sender_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for profiles
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 5. RLS Policies for messages
DROP POLICY IF EXISTS "Messages are viewable by authenticated users" ON public.messages;
CREATE POLICY "Messages are viewable by authenticated users"
  ON public.messages FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can send messages" ON public.messages;
CREATE POLICY "Authenticated users can send messages"
  ON public.messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

-- 6. Auto-create profile on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Enable Realtime for messages table
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
EXCEPTION WHEN duplicate_object THEN NULL;
END;
$$;

-- 8. Index for faster message queries
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at ASC);
