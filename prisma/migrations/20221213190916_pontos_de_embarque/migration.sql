/*
  Warnings:

  - You are about to drop the column `description` on the `Pin` table. All the data in the column will be lost.
  - You are about to drop the column `long` on the `Pin` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `Pin` table. All the data in the column will be lost.
  - Added the required column `details` to the `Pin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `Pin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `local` to the `Pin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Pin` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Pin] DROP COLUMN [description],
[long],
[street];
ALTER TABLE [dbo].[Pin] ADD [details] VARCHAR(255) NOT NULL,
[lng] VARCHAR(255) NOT NULL,
[local] VARCHAR(255) NOT NULL,
[title] VARCHAR(255) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
