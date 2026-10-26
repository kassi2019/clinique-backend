BEGIN TRY

BEGIN TRAN;

-- Signature et cachet du prescripteur (images data URL, fond transparent),
-- apposés au choix sur les documents imprimés (ordonnance, fiche, certificat, référence…).
ALTER TABLE [dbo].[personnel] ADD [signature] NVARCHAR(max) NULL;
ALTER TABLE [dbo].[personnel] ADD [cachet] NVARCHAR(max) NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
