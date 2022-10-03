BEGIN TRY

BEGIN TRAN;

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
