/*
  # Fix stories table RLS policies

  1. Security Updates
    - Add INSERT policy for authenticated users
    - Add UPDATE policy for authenticated users  
    - Add DELETE policy for authenticated users
    - Keep existing SELECT policy for public access

  This allows admin users to manage stories while keeping them publicly viewable.
*/

-- Add INSERT policy for authenticated users
CREATE POLICY "Authenticated users can insert stories"
  ON stories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add UPDATE policy for authenticated users
CREATE POLICY "Authenticated users can update stories"
  ON stories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add DELETE policy for authenticated users
CREATE POLICY "Authenticated users can delete stories"
  ON stories
  FOR DELETE
  TO authenticated
  USING (true);