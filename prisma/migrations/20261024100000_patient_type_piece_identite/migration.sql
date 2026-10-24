BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[patients] ADD [typePieceIdentite] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

-- Les numéros déjà saisis étaient des N° CNI
EXEC('UPDATE [dbo].[patients] SET [typePieceIdentite] = ''CNI'' WHERE [numeroCni] IS NOT NULL AND [numeroCni] <> ''''');
