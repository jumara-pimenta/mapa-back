/*
  Warnings:

  - You are about to drop the `addresses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `employees` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `routes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `routesdetails` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[addresses] DROP CONSTRAINT [addresses_employeeId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[routes] DROP CONSTRAINT [routes_carId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[routes] DROP CONSTRAINT [routes_driverId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[routesdetails] DROP CONSTRAINT [routesdetails_employeeId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[routesdetails] DROP CONSTRAINT [routesdetails_routesId_fkey];

-- DropTable
DROP TABLE [dbo].[addresses];

-- DropTable
DROP TABLE [dbo].[employees];

-- DropTable
DROP TABLE [dbo].[routes];

-- DropTable
DROP TABLE [dbo].[routesdetails];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
