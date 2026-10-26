BEGIN TRY

BEGIN TRAN;

-- Autorisation par rôle du bouton « Ma signature » (signature et cachet sur les documents imprimés).
-- Aucun rôle n'est autorisé par défaut : l'administrateur coche les rôles dans la liste des rôles.
ALTER TABLE [dbo].[roles] ADD [signatureAutorisee] BIT NOT NULL CONSTRAINT [roles_signatureAutorisee_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
