BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[dispensations_lignes] ADD [uniteVente] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[medicaments] ADD [uniteVente] NVARCHAR(1000) NOT NULL CONSTRAINT [medicaments_uniteVente_df] DEFAULT 'BOITE';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
