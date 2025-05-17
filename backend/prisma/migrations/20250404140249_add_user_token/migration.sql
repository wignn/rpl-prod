/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jatuh_tempo` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "jatuh_tempo" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tagihan" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_token_key" ON "User"("token");
