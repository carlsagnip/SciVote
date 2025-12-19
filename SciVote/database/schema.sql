-- SciVote Database Schema for Supabase
-- This schema includes all tables needed for the voting system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--------------------------------------------------------------
-- STUDENTS TABLE
--------------------------------------------------------------
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  middle_initial TEXT,
  full_name TEXT NOT NULL,
  photo TEXT, -- Base64 encoded photo
  fingerprint TEXT NOT NULL, -- Dummy fingerprint ID
  has_voted BOOLEAN DEFAULT FALSE,
  voting_status TEXT DEFAULT 'pending', -- pending, completed
  voted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on school_id for faster lookups
CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_has_voted ON students(has_voted);

--------------------------------------------------------------
-- PARTY LISTS TABLE
--------------------------------------------------------------
CREATE TABLE party_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

--------------------------------------------------------------
-- CANDIDATES TABLE
--------------------------------------------------------------
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  school_id TEXT NOT NULL,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  party_list_id UUID REFERENCES party_lists(id) ON DELETE RESTRICT,
  party_list_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one student can't run for multiple positions
  UNIQUE(student_id),
  -- Ensure one position per party (e.g., only one President per party)
  UNIQUE(position, party_list_id)
);

-- Indexes for faster queries
CREATE INDEX idx_candidates_position ON candidates(position);
CREATE INDEX idx_candidates_party_list ON candidates(party_list_id);
CREATE INDEX idx_candidates_school_id ON candidates(school_id);

--------------------------------------------------------------
-- VOTES TABLE
--------------------------------------------------------------
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  school_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  votes JSONB NOT NULL, -- Store all position votes as JSON
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one vote per student
  UNIQUE(student_id)
);

-- Index for analytics and counting
CREATE INDEX idx_votes_submitted_at ON votes(submitted_at);
CREATE INDEX idx_votes_student_id ON votes(student_id);

--------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
--------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read students (for voter registration verification)
CREATE POLICY "Allow public read access to students"
  ON students FOR SELECT
  USING (true);

-- Allow anyone to insert students (for registration)
CREATE POLICY "Allow public insert students"
  ON students FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update students (for voting status)
CREATE POLICY "Allow public update students"
  ON students FOR UPDATE
  USING (true);

-- Allow anyone to read party lists
CREATE POLICY "Allow public read access to party_lists"
  ON party_lists FOR SELECT
  USING (true);

-- Allow anyone to insert party lists
CREATE POLICY "Allow public insert party_lists"
  ON party_lists FOR INSERT
  WITH CHECK (true);

-- Allow anyone to delete party lists (admin function)
CREATE POLICY "Allow public delete party_lists"
  ON party_lists FOR DELETE
  USING (true);

-- Allow anyone to read candidates
CREATE POLICY "Allow public read access to candidates"
  ON candidates FOR SELECT
  USING (true);

-- Allow anyone to insert candidates
CREATE POLICY "Allow public insert candidates"
  ON candidates FOR INSERT
  WITH CHECK (true);

-- Allow anyone to delete candidates
CREATE POLICY "Allow public delete candidates"
  ON candidates FOR DELETE
  USING (true);

-- Allow anyone to read votes (for results)
CREATE POLICY "Allow public read access to votes"
  ON votes FOR SELECT
  USING (true);

-- Allow anyone to insert votes
CREATE POLICY "Allow public insert votes"
  ON votes FOR INSERT
  WITH CHECK (true);

--------------------------------------------------------------
-- FUNCTIONS FOR AUTOMATIC TIMESTAMP UPDATES
--------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to students table
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

--------------------------------------------------------------
-- HELPFUL VIEWS (Optional)
--------------------------------------------------------------

-- View to see vote counts per candidate
CREATE OR REPLACE VIEW vote_counts AS
SELECT 
  c.id as candidate_id,
  c.name as candidate_name,
  c.position,
  c.party_list_name,
  COUNT(v.id) as vote_count
FROM candidates c
LEFT JOIN votes v ON v.votes::jsonb ? c.position 
  AND v.votes->c.position = to_jsonb(c.name)
GROUP BY c.id, c.name, c.position, c.party_list_name
ORDER BY c.position, vote_count DESC;

