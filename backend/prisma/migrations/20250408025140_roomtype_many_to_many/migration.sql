/*
  Warnings:

  - You are about to drop the column `id_facility` on the `RoomType` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "RoomType" DROP CONSTRAINT "RoomType_id_facility_fkey";

-- AlterTable
ALTER TABLE "RoomType" DROP COLUMN "id_facility";

-- CreateTable
CREATE TABLE "_RoomTypeFacilities" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RoomTypeFacilities_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RoomTypeFacilities_B_index" ON "_RoomTypeFacilities"("B");

-- AddForeignKey
ALTER TABLE "_RoomTypeFacilities" ADD CONSTRAINT "_RoomTypeFacilities_A_fkey" FOREIGN KEY ("A") REFERENCES "Facility"("id_facility") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomTypeFacilities" ADD CONSTRAINT "_RoomTypeFacilities_B_fkey" FOREIGN KEY ("B") REFERENCES "RoomType"("id_roomtype") ON DELETE CASCADE ON UPDATE CASCADE;
