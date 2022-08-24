BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[employees] (
    [id] NVARCHAR(1000) NOT NULL,
    [registration] DECIMAL(32,16) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [cpf] DECIMAL(32,16) NOT NULL,
    [rg] DECIMAL(32,16) NOT NULL,
    [admission] DATETIME2 NOT NULL,
    [role] NVARCHAR(1000) NOT NULL,
    [shift] NVARCHAR(1000) NOT NULL,
    [costCenter] DECIMAL(32,16) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [employees_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [employees_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [employees_registration_key] UNIQUE NONCLUSTERED ([registration]),
    CONSTRAINT [employees_cpf_key] UNIQUE NONCLUSTERED ([cpf]),
    CONSTRAINT [employees_rg_key] UNIQUE NONCLUSTERED ([rg])
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
