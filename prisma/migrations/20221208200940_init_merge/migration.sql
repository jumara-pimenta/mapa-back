/*
  Warnings:

  - You are about to alter the column `admission` on the `Employee` table. The data in that column could be lost. The data in that column will be cast from `DateTimeOffset` to `DateTime2`.
  - You are about to alter the column `lastSurvey` on the `Vehicle` table. The data in that column could be lost. The data in that column will be cast from `DateTimeOffset` to `DateTime2`.
  - You are about to alter the column `expiration` on the `Vehicle` table. The data in that column could be lost. The data in that column will be cast from `DateTimeOffset` to `DateTime2`.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Vehicle] DROP CONSTRAINT [Vehicle_renavam_key];

-- AlterTable
ALTER TABLE [dbo].[Employee] ALTER COLUMN [admission] DATETIME2 NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[Vehicle] ALTER COLUMN [lastSurvey] DATETIME2 NOT NULL;
ALTER TABLE [dbo].[Vehicle] ALTER COLUMN [expiration] DATETIME2 NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
