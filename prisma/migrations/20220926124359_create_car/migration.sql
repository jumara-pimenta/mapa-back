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

-- CreateTable
CREATE TABLE [dbo].[drivers] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [cpf] NVARCHAR(1000) NOT NULL,
    [cnh] NVARCHAR(1000) NOT NULL,
    [validation] DATETIME2 NOT NULL,
    [category] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [drivers_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [drivers_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [drivers_cpf_key] UNIQUE NONCLUSTERED ([cpf]),
    CONSTRAINT [drivers_cnh_key] UNIQUE NONCLUSTERED ([cnh])
);

-- CreateTable
CREATE TABLE [dbo].[employees] (
    [id] NVARCHAR(1000) NOT NULL,
    [registration] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [cpf] NVARCHAR(1000) NOT NULL,
    [rg] NVARCHAR(1000) NOT NULL,
    [admission] DATETIME2 NOT NULL,
    [role] NVARCHAR(1000) NOT NULL,
    [shift] NVARCHAR(1000) NOT NULL,
    [costCenter] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [employees_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [employees_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [employees_registration_key] UNIQUE NONCLUSTERED ([registration]),
    CONSTRAINT [employees_cpf_key] UNIQUE NONCLUSTERED ([cpf]),
    CONSTRAINT [employees_rg_key] UNIQUE NONCLUSTERED ([rg])
);

-- CreateTable
CREATE TABLE [dbo].[addresses] (
    [id] NVARCHAR(1000) NOT NULL,
    [employeeId] NVARCHAR(1000) NOT NULL,
    [street] NVARCHAR(1000) NOT NULL,
    [cep] DECIMAL(32,16) NOT NULL,
    [number] DECIMAL(32,16) NOT NULL,
    [complement] NVARCHAR(1000) NOT NULL,
    [neighborhood] NVARCHAR(1000) NOT NULL,
    [city] NVARCHAR(1000) NOT NULL,
    [state] NVARCHAR(1000) NOT NULL,
    [latitude] NVARCHAR(1000) NOT NULL,
    [longitude] NVARCHAR(1000) NOT NULL,
    [type] BIT NOT NULL CONSTRAINT [addresses_type_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [addresses_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [addresses_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[routes] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [carId] NVARCHAR(1000) NOT NULL,
    [driverId] NVARCHAR(1000) NOT NULL,
    [totalDist] NVARCHAR(1000) NOT NULL,
    [typeOfRoutes] NVARCHAR(1000) NOT NULL,
    [startTime] NVARCHAR(1000) NOT NULL,
    [duration] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [routes_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [routes_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [routes_carId_key] UNIQUE NONCLUSTERED ([carId]),
    CONSTRAINT [routes_driverId_key] UNIQUE NONCLUSTERED ([driverId])
);

-- CreateTable
CREATE TABLE [dbo].[routesdetails] (
    [id] NVARCHAR(1000) NOT NULL,
    [routesId] NVARCHAR(1000) NOT NULL,
    [employeeId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [routesdetails_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [routesdetails_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[addresses] ADD CONSTRAINT [addresses_employeeId_fkey] FOREIGN KEY ([employeeId]) REFERENCES [dbo].[employees]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[routes] ADD CONSTRAINT [routes_carId_fkey] FOREIGN KEY ([carId]) REFERENCES [dbo].[cars]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[routes] ADD CONSTRAINT [routes_driverId_fkey] FOREIGN KEY ([driverId]) REFERENCES [dbo].[drivers]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[routesdetails] ADD CONSTRAINT [routesdetails_employeeId_fkey] FOREIGN KEY ([employeeId]) REFERENCES [dbo].[employees]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[routesdetails] ADD CONSTRAINT [routesdetails_routesId_fkey] FOREIGN KEY ([routesId]) REFERENCES [dbo].[routes]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
