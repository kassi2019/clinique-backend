BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[medicaments] ADD [consommable] BIT NOT NULL CONSTRAINT [medicaments_consommable_df] DEFAULT 0;

-- AlterTable
ALTER TABLE [dbo].[passages] ADD [perimetreBrachial] NVARCHAR(1000),
[perimetreCranien] NVARCHAR(1000);

-- CreateTable
CREATE TABLE [dbo].[liste_parametres] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [code] NVARCHAR(1000) NOT NULL,
    [libelle] NVARCHAR(1000) NOT NULL,
    [actif] BIT NOT NULL CONSTRAINT [liste_parametres_actif_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [liste_parametres_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [liste_parametres_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [liste_parametres_cliniqueId_code_libelle_key] UNIQUE NONCLUSTERED ([cliniqueId],[code],[libelle])
);

-- AddForeignKey
ALTER TABLE [dbo].[liste_parametres] ADD CONSTRAINT [liste_parametres_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
