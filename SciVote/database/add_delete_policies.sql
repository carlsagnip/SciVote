-- Add missing DELETE policies for students and votes tables
-- These are needed for admin functions like deleting students and resetting the system

-- Drop existing policies if they exist (to avoid errors)
DROP POLICY IF EXISTS "Allow public delete students" ON students;
DROP POLICY IF EXISTS "Allow public delete votes" ON votes;

-- Allow anyone to delete students (admin function)
CREATE POLICY "Allow public delete students"
  ON students FOR DELETE
  USING (true);

-- Allow anyone to delete votes (admin function for reset)
CREATE POLICY "Allow public delete votes"
  ON votes FOR DELETE
  USING (true);
