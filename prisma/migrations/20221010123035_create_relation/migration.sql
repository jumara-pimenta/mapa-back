/*
  Warnings:

  - You are about to alter the column `cep` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `Decimal(32,16)` to `Int`.
  - You are about to alter the column `number` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `Decimal(32,16)` to `Int`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[addresses] ALTER COLUMN [cep] INT NOT NULL;
ALTER TABLE [dbo].[addresses] ALTER COLUMN [number] INT NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[__RoutesToEmployee] (
    [A] NVARCHAR(1000) NOT NULL,
    [B] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [__RoutesToEmployee_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [__RoutesToEmployee_B_index] ON [dbo].[__RoutesToEmployee]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[addresses] ADD CONSTRAINT [addresses_employeeId_fkey] FOREIGN KEY ([employeeId]) REFERENCES [dbo].[employees]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[routes] ADD CONSTRAINT [routes_carId_fkey] FOREIGN KEY ([carId]) REFERENCES [dbo].[cars]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[routes] ADD CONSTRAINT [routes_driverId_fkey] FOREIGN KEY ([driverId]) REFERENCES [dbo].[drivers]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[__RoutesToEmployee] ADD CONSTRAINT [__RoutesToEmployee_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[employees]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[__RoutesToEmployee] ADD CONSTRAINT [__RoutesToEmployee_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[routes]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
