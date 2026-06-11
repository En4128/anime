-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user' NOT NULL,
  avatar TEXT DEFAULT '',
  banner TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create anime table
CREATE TABLE IF NOT EXISTS anime (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  synopsis TEXT DEFAULT '',
  genres TEXT[] DEFAULT '{}'::text[] NOT NULL,
  tags TEXT[] DEFAULT '{}'::text[] NOT NULL,
  rating NUMERIC DEFAULT 0 NOT NULL,
  release_year INTEGER NOT NULL,
  status TEXT DEFAULT 'ongoing' NOT NULL,
  poster_image TEXT DEFAULT '',
  banner_image TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false NOT NULL,
  trending_score NUMERIC DEFAULT 0 NOT NULL,
  popularity NUMERIC DEFAULT 0 NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  likes INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create episodes table
CREATE TABLE IF NOT EXISTS episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anime_id UUID REFERENCES anime(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  number INTEGER NOT NULL,
  synopsis TEXT DEFAULT '',
  video_url TEXT NOT NULL,
  thumbnail TEXT DEFAULT '',
  duration INTEGER DEFAULT 0 NOT NULL,
  release_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_anime_episode UNIQUE (anime_id, number)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anime_id UUID REFERENCES anime(id) ON DELETE CASCADE NOT NULL,
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create comment_likes join table
CREATE TABLE IF NOT EXISTS comment_likes (
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (comment_id, user_id)
);

-- Create user_watchlist join table
CREATE TABLE IF NOT EXISTS user_watchlist (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  anime_id UUID REFERENCES anime(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, anime_id)
);

-- Create user_liked_anime join table
CREATE TABLE IF NOT EXISTS user_liked_anime (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  anime_id UUID REFERENCES anime(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, anime_id)
);

-- Create user_continue_watching table
CREATE TABLE IF NOT EXISTS user_continue_watching (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  anime_id UUID REFERENCES anime(id) ON DELETE CASCADE,
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0 NOT NULL,
  duration INTEGER DEFAULT 0 NOT NULL,
  last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, anime_id)
);
