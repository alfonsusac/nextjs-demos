/*
  Warnings:

  - You are about to drop the column `ast` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "ast",
DROP COLUMN "content";
