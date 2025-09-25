/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "user_id_prikey",
ALTER COLUMN "user_id" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "username" SET DATA TYPE VARCHAR(99),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(99),
ADD CONSTRAINT "user_id_prikey" PRIMARY KEY ("user_id");
