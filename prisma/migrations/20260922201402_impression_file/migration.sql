BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[impression_file] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [poste] NVARCHAR(1000) NOT NULL,
    [libelle] NVARCHAR(1000),
    [contenu] NVARCHAR(max) NOT NULL,
    [partage] NVARCHAR(1000),
    [nom] NVARCHAR(1000),
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [impression_file_statut_df] DEFAULT 'EN_ATTENTE',
    [erreur] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [impression_file_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [printedAt] DATETIME2,
    CONSTRAINT [impression_file_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [impression_file_cliniqueId_poste_statut_idx] ON [dbo].[impression_file]([cliniqueId], [poste], [statut]);

-- AddForeignKey
ALTER TABLE [dbo].[impression_file] ADD CONSTRAINT [impression_file_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
