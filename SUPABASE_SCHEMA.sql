--============================================================================
--DECISION ANALYZER LOG - SUPABASE DATABASE SCHEMA
--Final Database Setup Script
--============================================================================

--============================================================================
--1. USERS TABLE (RBAC)
--============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--Create index for faster role queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

--============================================================================
--2. DECISIONS TABLE
--============================================================================
CREATE TABLE IF NOT EXISTS decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

--Create index for faster queries by owner
CREATE INDEX IF NOT EXISTS idx_decisions_owner_id ON decisions(owner_id);

--============================================================================
--3. DECISION_OPTIONS TABLE
--============================================================================
CREATE TABLE IF NOT EXISTS decision_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID NOT NULL REFERENCES decisions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  rating INTEGER CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--Create index for faster queries by decision
CREATE INDEX IF NOT EXISTS idx_decision_options_decision_id ON decision_options(decision_id);

--============================================================================
--ROW LEVEL SECURITY (RLS) - USERS TABLE
--============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

--Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

--Admins can view all users
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

--Users can insert their own profile (for initial signup)
CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

--============================================================================
--ROW LEVEL SECURITY (RLS) - DECISIONS TABLE
--============================================================================
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;

--Users can view their own decisions
CREATE POLICY "Users can view their own decisions"
  ON decisions FOR SELECT
  USING (auth.uid() = owner_id);

--Users can create decisions
CREATE POLICY "Users can create decisions"
  ON decisions FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

--Users can update their own decisions
CREATE POLICY "Users can update their own decisions"
  ON decisions FOR UPDATE
  USING (auth.uid() = owner_id);

--Users can delete their own decisions
CREATE POLICY "Users can delete their own decisions"
  ON decisions FOR DELETE
  USING (auth.uid() = owner_id);

--============================================================================
--ROW LEVEL SECURITY (RLS) - DECISION_OPTIONS TABLE
--============================================================================
ALTER TABLE decision_options ENABLE ROW LEVEL SECURITY;

--Users can view options of their decisions
CREATE POLICY "Users can view options of their decisions"
  ON decision_options FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM decisions
      WHERE decisions.id = decision_options.decision_id
      AND decisions.owner_id = auth.uid()
    )
  );

--Users can add options to their decisions
CREATE POLICY "Users can add options to their decisions"
  ON decision_options FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM decisions
      WHERE decisions.id = decision_options.decision_id
      AND decisions.owner_id = auth.uid()
    )
  );

--Users can update options in their decisions
CREATE POLICY "Users can update options in their decisions"
  ON decision_options FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM decisions
      WHERE decisions.id = decision_options.decision_id
      AND decisions.owner_id = auth.uid()
    )
  );

--Users can delete options from their decisions
CREATE POLICY "Users can delete options from their decisions"
  ON decision_options FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM decisions
      WHERE decisions.id = decision_options.decision_id
      AND decisions.owner_id = auth.uid()
    )
  );

--Create trigger for auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

--============================================================================
--SUMMARY OF TABLES AND FIELDS
--============================================================================
--
--TABLE: users
--  - id (UUID, PK, FK to auth.users)
--  - email (TEXT, NOT NULL)
--  - role (TEXT, 'user' or 'admin', DEFAULT 'user')
--  - created_at (TIMESTAMP)
--  - updated_at (TIMESTAMP)
--
--TABLE: decisions
--  - id (UUID, PK, auto-generated)
--  - owner_id (UUID, FK to auth.users)
--  - title (TEXT, NOT NULL)
--  - description (TEXT, nullable)
--  - created_at (TIMESTAMP)
--  - updated_at (TIMESTAMP)
--  - is_active (BOOLEAN, DEFAULT true)
--
--TABLE: decision_options
--  - id (UUID, PK, auto-generated)
--  - decision_id (UUID, FK to decisions, CASCADE DELETE)
--  - option_text (TEXT, NOT NULL)
--  - rating (INTEGER, 1-5, nullable)
--  - created_at (TIMESTAMP)
--  - updated_at (TIMESTAMP)
--
--============================================================================
