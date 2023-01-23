BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Driver] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] VARCHAR(255) NOT NULL,
    [cpf] VARCHAR(11) NOT NULL,
    [cnh] VARCHAR(11) NOT NULL,
    [validation] DATETIMEOFFSET NOT NULL,
    [category] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIMEOFFSET NOT NULL CONSTRAINT [Driver_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIMEOFFSET,
    CONSTRAINT [Driver_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Driver_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [Driver_cpf_key] UNIQUE NONCLUSTERED ([cpf]),
    CONSTRAINT [Driver_cnh_key] UNIQUE NONCLUSTERED ([cnh])
);

-- CreateTable
CREATE TABLE [dbo].[Route] (
    [id] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [distance] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [driverId] NVARCHAR(1000) NOT NULL,
    [vehicleId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIMEOFFSET NOT NULL CONSTRAINT [Route_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIMEOFFSET,
    [deletedAt] DATETIMEOFFSET,
    CONSTRAINT [Route_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Route_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Path] (
    [id] NVARCHAR(1000) NOT NULL,
    [duration] VARCHAR(10) NOT NULL,
    [startsAt] VARCHAR(10) NOT NULL,
    [startedAt] DATETIMEOFFSET,
    [finishedAt] DATETIMEOFFSET,
    [type] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [routeId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIMEOFFSET NOT NULL CONSTRAINT [Path_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIMEOFFSET,
    CONSTRAINT [Path_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Path_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[EmployeesOnPath] (
    [id] NVARCHAR(1000) NOT NULL,
    [pathId] NVARCHAR(1000) NOT NULL,
    [employeeId] NVARCHAR(1000) NOT NULL,
    [confirmation] BIT NOT NULL,
    [present] BIT,
    [position] INT NOT NULL,
    [description] VARCHAR(50),
    [boardingAt] DATETIMEOFFSET,
    [disembarkAt] DATETIMEOFFSET,
    [createdAt] DATETIMEOFFSET NOT NULL CONSTRAINT [EmployeesOnPath_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIMEOFFSET,
    CONSTRAINT [EmployeesOnPath_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [EmployeesOnPath_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[RouteHistory] (
    [id] NVARCHAR(1000) NOT NULL,
    [employeeIds] NVARCHAR(1000) NOT NULL,
    [routeId] NVARCHAR(1000) NOT NULL,
    [startedAt] DATETIMEOFFSET NOT NULL,
    [finishedAt] DATETIMEOFFSET NOT NULL,
    [createdAt] DATETIMEOFFSET NOT NULL CONSTRAINT [RouteHistory_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIMEOFFSET,
    CONSTRAINT [RouteHistory_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RouteHistory_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Vehicle] (
    [id] NVARCHAR(1000) NOT NULL,
    [plate] NVARCHAR(1000) NOT NULL,
    [company] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [lastSurvey] DATETIME2 NOT NULL,
    [expiration] DATETIME2 NOT NULL,
    [capacity] INT NOT NULL,
    [renavam] VARCHAR(11) NOT NULL,
    [lastMaintenance] DATETIMEOFFSET NOT NULL,
    [note] NVARCHAR(1000) NOT NULL,
    [isAccessibility] BIT NOT NULL CONSTRAINT [Vehicle_isAccessibility_df] DEFAULT 0,
    [createdAt] DATETIMEOFFSET NOT NULL CONSTRAINT [Vehicle_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIMEOFFSET,
    CONSTRAINT [Vehicle_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Vehicle_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [Vehicle_plate_key] UNIQUE NONCLUSTERED ([plate]),
    CONSTRAINT [Vehicle_renavam_key] UNIQUE NONCLUSTERED ([renavam])
);

-- CreateTable
CREATE TABLE [dbo].[Employee] (
    [id] NVARCHAR(1000) NOT NULL,
    [registration] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [admission] DATETIMEOFFSET NOT NULL,
    [role] NVARCHAR(1000) NOT NULL,
    [shift] NVARCHAR(1000) NOT NULL,
    [costCenter] NVARCHAR(1000) NOT NULL,
    [address] VARCHAR(255) NOT NULL,
    [createdAt] DATETIMEOFFSET NOT NULL CONSTRAINT [Employee_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIMEOFFSET,
    CONSTRAINT [Employee_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Employee_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [Employee_registration_key] UNIQUE NONCLUSTERED ([registration])
);

-- CreateTable
CREATE TABLE [dbo].[Pin] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] VARCHAR(255) NOT NULL,
    [local] VARCHAR(255) NOT NULL,
    [details] VARCHAR(255) NOT NULL,
    [lat] VARCHAR(255) NOT NULL,
    [lng] VARCHAR(255) NOT NULL,
    [createdAt] DATETIMEOFFSET NOT NULL,
    [updatedAt] DATETIMEOFFSET,
    CONSTRAINT [Pin_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Pin_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[EmployeesOnPin] (
    [employeeId] NVARCHAR(1000) NOT NULL,
    [pinId] NVARCHAR(1000) NOT NULL,
    [type] VARCHAR(50) NOT NULL,
    [createdAt] DATETIMEOFFSET NOT NULL CONSTRAINT [EmployeesOnPin_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIMEOFFSET,
    CONSTRAINT [EmployeesOnPin_pkey] PRIMARY KEY CLUSTERED ([employeeId],[pinId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Route] ADD CONSTRAINT [Route_driverId_fkey] FOREIGN KEY ([driverId]) REFERENCES [dbo].[Driver]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Route] ADD CONSTRAINT [Route_vehicleId_fkey] FOREIGN KEY ([vehicleId]) REFERENCES [dbo].[Vehicle]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Path] ADD CONSTRAINT [Path_routeId_fkey] FOREIGN KEY ([routeId]) REFERENCES [dbo].[Route]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[EmployeesOnPath] ADD CONSTRAINT [EmployeesOnPath_pathId_fkey] FOREIGN KEY ([pathId]) REFERENCES [dbo].[Path]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[EmployeesOnPath] ADD CONSTRAINT [EmployeesOnPath_employeeId_fkey] FOREIGN KEY ([employeeId]) REFERENCES [dbo].[Employee]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RouteHistory] ADD CONSTRAINT [RouteHistory_routeId_fkey] FOREIGN KEY ([routeId]) REFERENCES [dbo].[Route]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[EmployeesOnPin] ADD CONSTRAINT [EmployeesOnPin_employeeId_fkey] FOREIGN KEY ([employeeId]) REFERENCES [dbo].[Employee]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[EmployeesOnPin] ADD CONSTRAINT [EmployeesOnPin_pinId_fkey] FOREIGN KEY ([pinId]) REFERENCES [dbo].[Pin]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
