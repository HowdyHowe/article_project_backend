/*
  Warnings:

  - A unique constraint covering the columns `[user_id,title]` on the table `Article` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "unique_author_title" ON "public"."Article"("user_id", "title");
