BEGIN TRY

BEGIN TRAN;

-- Ordonnance remise au patient qui achète ses médicaments hors de la clinique :
-- elle n'apparaît plus dans la liste « en attente » de la pharmacie.
ALTER TABLE [dbo].[ordonnances] ADD [horsClinique] BIT NOT NULL CONSTRAINT [ordonnances_horsClinique_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
