BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[fiches_echographie] ADD [champs] NVARCHAR(max);

-- AlterTable
ALTER TABLE [dbo].[fiches_examen_imagerie] ADD [valeurs] NVARCHAR(max);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
