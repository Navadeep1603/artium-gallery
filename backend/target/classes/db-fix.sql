-- Run this manually on your Aiven MySQL database to fix the artist_id NOT NULL constraint
-- This allows artworks to be uploaded by self-registered artists who don't have an entry in the artists table

ALTER TABLE artworks MODIFY COLUMN artist_id BIGINT NULL;
