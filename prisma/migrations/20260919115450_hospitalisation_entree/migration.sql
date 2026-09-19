BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[consultations] ADD [hospitalisationDureeJours] INT,
[litId] INT,
[typeHospitalisation] NVARCHAR(1000);

-- AddForeignKey
ALTER TABLE [dbo].[consultations] ADD CONSTRAINT [consultations_litId_fkey] FOREIGN KEY ([litId]) REFERENCES [dbo].[lits]([id]) ON DELETE SET NULL ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
