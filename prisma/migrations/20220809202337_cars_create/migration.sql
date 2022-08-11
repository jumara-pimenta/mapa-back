BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[cars] (
    [id] NVARCHAR(1000) NOT NULL,
    [plate] NVARCHAR(1000) NOT NULL,
    [company] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [lastSurvey] DATETIME2 NOT NULL,
    [expiration] DATETIME2 NOT NULL,
    [capacity] INT NOT NULL,
    [renavam] INT NOT NULL,
    [lastMaintenance] DATETIME2 NOT NULL,
    [note] NVARCHAR(1000) NOT NULL,
    [isAccessibility] BIT NOT NULL CONSTRAINT [cars_isAccessibility_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [cars_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [cars_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [cars_plate_key] UNIQUE NONCLUSTERED ([plate])
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
