/*
  Warnings:

  - A unique constraint covering the columns `[renavam]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[Vehicle] ADD CONSTRAINT [Vehicle_renavam_key] UNIQUE NONCLUSTERED ([renavam]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
