BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[parametres] ADD [logoRapportDroit] NVARCHAR(max),
[logoRapportGauche] NVARCHAR(max),
[sigVersion] NVARCHAR(1000) CONSTRAINT [parametres_sigVersion_df] DEFAULT 'A';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
