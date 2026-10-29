BEGIN TRY

BEGIN TRAN;

-- Onglets autorisés par utilisateur (aucun onglet coché pour un module = tous ses onglets).
CREATE TABLE [dbo].[utilisateurs_onglets] (
    [utilisateurId] INT NOT NULL,
    [onglet] NVARCHAR(100) NOT NULL,
    CONSTRAINT [utilisateurs_onglets_pkey] PRIMARY KEY CLUSTERED ([utilisateurId],[onglet])
);

ALTER TABLE [dbo].[utilisateurs_onglets] ADD CONSTRAINT [utilisateurs_onglets_utilisateurId_fkey] FOREIGN KEY ([utilisateurId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
