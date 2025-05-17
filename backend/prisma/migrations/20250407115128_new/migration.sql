-- CreateTable
CREATE TABLE "RoomFacility" (
    "id" TEXT NOT NULL,
    "id_room" TEXT NOT NULL,
    "id_facility" TEXT NOT NULL,

    CONSTRAINT "RoomFacility_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomFacility_id_room_id_facility_key" ON "RoomFacility"("id_room", "id_facility");

-- AddForeignKey
ALTER TABLE "RoomFacility" ADD CONSTRAINT "RoomFacility_id_room_fkey" FOREIGN KEY ("id_room") REFERENCES "Room"("id_room") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomFacility" ADD CONSTRAINT "RoomFacility_id_facility_fkey" FOREIGN KEY ("id_facility") REFERENCES "Facility"("id_facility") ON DELETE RESTRICT ON UPDATE CASCADE;
