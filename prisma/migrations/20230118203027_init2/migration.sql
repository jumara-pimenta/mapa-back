/*
  Warnings:

  - Added the required column `Itinerary` to the `RouteHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleId` to the `RouteHistory` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[RouteHistory] ADD [Itinerary] NVARCHAR(1000) NOT NULL,
[vehicleId] NVARCHAR(1000) NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[RouteHistory] ADD CONSTRAINT [RouteHistory_vehicleId_fkey] FOREIGN KEY ([vehicleId]) REFERENCES [dbo].[Vehicle]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
