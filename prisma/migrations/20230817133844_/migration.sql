/*
  Warnings:

  - You are about to alter the column `startedAt` on the `Path` table. The data in that column could be lost. The data in that column will be cast from `DateTimeOffset` to `Date`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Path] ALTER COLUMN [startedAt] DATE NULL;

-- AlterTable
ALTER TABLE [dbo].[RouteHistory] ADD [employeesNotPresent] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
