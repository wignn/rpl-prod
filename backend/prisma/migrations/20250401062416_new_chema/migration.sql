-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('SINGLE', 'MARRIED');

-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('ADMIN', 'TENANT');

-- CreateEnum
CREATE TYPE "ROOMSTATUS" AS ENUM ('AVAILABLE', 'NOTAVAILABLE');

-- CreateEnum
CREATE TYPE "REPORTSTATUS" AS ENUM ('PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "INOUT" AS ENUM ('INCOME', 'OUTCOME');

-- CreateTable
CREATE TABLE "User" (
    "id_user" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "ROLE" NOT NULL,
    "phone" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id_tenant" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "no_ktp" TEXT NOT NULL,
    "status" "STATUS" NOT NULL,
    "no_telp" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id_tenant")
);

-- CreateTable
CREATE TABLE "RentData" (
    "id_rent" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "rent_date" TIMESTAMP(3) NOT NULL,
    "rent_out" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentData_pkey" PRIMARY KEY ("id_rent")
);

-- CreateTable
CREATE TABLE "Room" (
    "id_room" TEXT NOT NULL,
    "id_roomtype" TEXT NOT NULL,
    "status" "ROOMSTATUS" NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id_room")
);

-- CreateTable
CREATE TABLE "RoomType" (
    "id_roomtype" TEXT NOT NULL,
    "room_type" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomType_pkey" PRIMARY KEY ("id_roomtype")
);

-- CreateTable
CREATE TABLE "Report" (
    "id_report" TEXT NOT NULL,
    "id_tenant" TEXT NOT NULL,
    "id_facility" TEXT NOT NULL,
    "report_desc" TEXT NOT NULL,
    "report_date" TIMESTAMP(3) NOT NULL,
    "status" "REPORTSTATUS" NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id_report")
);

-- CreateTable
CREATE TABLE "Facility" (
    "id_facility" TEXT NOT NULL,
    "facility_name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id_facility")
);

-- CreateTable
CREATE TABLE "Finance" (
    "id_finance" TEXT NOT NULL,
    "id_tenant" TEXT,
    "id_rent" TEXT,
    "type" "INOUT" NOT NULL,
    "category" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Finance_pkey" PRIMARY KEY ("id_finance")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "RentData_tenantId_key" ON "RentData"("tenantId");

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentData" ADD CONSTRAINT "RentData_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id_tenant") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentData" ADD CONSTRAINT "RentData_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id_room") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_id_roomtype_fkey" FOREIGN KEY ("id_roomtype") REFERENCES "RoomType"("id_roomtype") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_id_tenant_fkey" FOREIGN KEY ("id_tenant") REFERENCES "Tenant"("id_tenant") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_id_facility_fkey" FOREIGN KEY ("id_facility") REFERENCES "Facility"("id_facility") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Finance" ADD CONSTRAINT "Finance_id_tenant_fkey" FOREIGN KEY ("id_tenant") REFERENCES "Tenant"("id_tenant") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Finance" ADD CONSTRAINT "Finance_id_rent_fkey" FOREIGN KEY ("id_rent") REFERENCES "RentData"("id_rent") ON DELETE SET NULL ON UPDATE CASCADE;
