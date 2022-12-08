BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[EmployeesOnPath] DROP CONSTRAINT [EmployeesOnPath_confirmation_df];
ALTER TABLE [dbo].[EmployeesOnPath] ADD CONSTRAINT [EmployeesOnPath_confirmation_df] DEFAULT 1 FOR [confirmation];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
