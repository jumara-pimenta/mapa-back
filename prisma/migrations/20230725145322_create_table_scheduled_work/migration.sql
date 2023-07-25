BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[ScheduledWork] (
    [id] NVARCHAR(1000) NOT NULL,
    [idEntity] NVARCHAR(1000) NOT NULL,
    [entity] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [scheduledDate] DATETIMEOFFSET NOT NULL,
    [createdAt] DATETIMEOFFSET NOT NULL CONSTRAINT [ScheduledWork_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIMEOFFSET,
    CONSTRAINT [ScheduledWork_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ScheduledWork_id_key] UNIQUE NONCLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
