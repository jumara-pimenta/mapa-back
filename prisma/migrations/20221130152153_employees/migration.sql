/*
  Warnings:

  - You are about to alter the column `validation` on the `Driver` table. The data in that column could be lost. The data in that column will be cast from `DateTimeOffset` to `DateTime2`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Driver] ALTER COLUMN [validation] DATETIME2 NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
