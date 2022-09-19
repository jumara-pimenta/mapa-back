BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[addresses] (
    [id] NVARCHAR(1000) NOT NULL,
    [employeeId] NVARCHAR(1000) NOT NULL,
    [cep] DECIMAL(32,16) NOT NULL,
    [number] DECIMAL(32,16) NOT NULL,
    [complement] NVARCHAR(1000) NOT NULL,
    [neighborhood] NVARCHAR(1000) NOT NULL,
    [city] NVARCHAR(1000) NOT NULL,
    [state] NVARCHAR(1000) NOT NULL,
    [latitude] DECIMAL(32,16) NOT NULL,
    [longitude] DECIMAL(32,16) NOT NULL,
    [type] BIT NOT NULL CONSTRAINT [addresses_type_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [addresses_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [addresses_pkey] PRIMARY KEY CLUSTERED ([id])
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
