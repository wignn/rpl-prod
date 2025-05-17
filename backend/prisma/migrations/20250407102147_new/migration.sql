/*
  Warnings:

  - Added the required column `id_facility` to the `RoomType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RoomType" ADD COLUMN     "id_facility" TEXT NOT NULL,
ADD COLUMN     "image" TEXT;

-- AddForeignKey
ALTER TABLE "RoomType" ADD CONSTRAINT "RoomType_id_facility_fkey" FOREIGN KEY ("id_facility") REFERENCES "Facility"("id_facility") ON DELETE RESTRICT ON UPDATE CASCADE;
