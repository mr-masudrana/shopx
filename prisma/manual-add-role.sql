-- Run this ONCE in Supabase's SQL Editor if your "User" table already
-- exists (i.e. you set the DB up before the admin dashboard was added).
-- If you are setting the database up for the first time instead, just
-- use manual-init.sql — it already includes this column.

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'customer';

-- Promote your own account to admin (replace the email):
-- UPDATE "User" SET "role" = 'admin' WHERE "email" = 'you@example.com';
