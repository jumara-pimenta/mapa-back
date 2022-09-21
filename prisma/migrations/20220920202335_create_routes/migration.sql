BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[routes] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [vehicle] NVARCHAR(1000) NOT NULL,
    [driver] NVARCHAR(1000) NOT NULL,
    [employee] NVARCHAR(1000) NOT NULL,
    [totalDist] NVARCHAR(1000) NOT NULL,
    [typeOfRoutes] NVARCHAR(1000) NOT NULL,
    [startTime] NVARCHAR(1000) NOT NULL,
    [duration] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [routes_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [routes_pkey] PRIMARY KEY CLUSTERED ([id])
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