BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[professions] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [libelle] NVARCHAR(1000) NOT NULL,
    [actif] BIT NOT NULL CONSTRAINT [professions_actif_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [professions_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [professions_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [professions_cliniqueId_libelle_key] UNIQUE NONCLUSTERED ([cliniqueId],[libelle])
);

-- CreateTable
CREATE TABLE [dbo].[motifs_consultation] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [libelle] NVARCHAR(1000) NOT NULL,
    [actif] BIT NOT NULL CONSTRAINT [motifs_consultation_actif_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [motifs_consultation_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [motifs_consultation_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [motifs_consultation_cliniqueId_libelle_key] UNIQUE NONCLUSTERED ([cliniqueId],[libelle])
);

-- AddForeignKey
ALTER TABLE [dbo].[professions] ADD CONSTRAINT [professions_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[motifs_consultation] ADD CONSTRAINT [motifs_consultation_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
