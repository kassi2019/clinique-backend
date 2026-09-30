BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[fiches_echographie] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [libelle] NVARCHAR(1000) NOT NULL,
    [texte] NVARCHAR(max) NOT NULL,
    [actif] BIT NOT NULL CONSTRAINT [fiches_echographie_actif_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [fiches_echographie_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [fiches_echographie_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [fiches_echographie_cliniqueId_libelle_key] UNIQUE NONCLUSTERED ([cliniqueId],[libelle])
);

-- CreateTable
CREATE TABLE [dbo].[fiches_examen_imagerie] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [passageId] INT NOT NULL,
    [patientId] INT NOT NULL,
    [typeFicheId] INT NOT NULL,
    [libelleType] NVARCHAR(1000) NOT NULL,
    [texte] NVARCHAR(max) NOT NULL,
    [indication] NVARCHAR(1000),
    [prescripteur] NVARCHAR(1000),
    [medecinId] INT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [fiches_examen_imagerie_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [fiches_examen_imagerie_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[fiches_echographie] ADD CONSTRAINT [fiches_echographie_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[fiches_examen_imagerie] ADD CONSTRAINT [fiches_examen_imagerie_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[fiches_examen_imagerie] ADD CONSTRAINT [fiches_examen_imagerie_passageId_fkey] FOREIGN KEY ([passageId]) REFERENCES [dbo].[passages]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[fiches_examen_imagerie] ADD CONSTRAINT [fiches_examen_imagerie_patientId_fkey] FOREIGN KEY ([patientId]) REFERENCES [dbo].[patients]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[fiches_examen_imagerie] ADD CONSTRAINT [fiches_examen_imagerie_typeFicheId_fkey] FOREIGN KEY ([typeFicheId]) REFERENCES [dbo].[fiches_echographie]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[fiches_examen_imagerie] ADD CONSTRAINT [fiches_examen_imagerie_medecinId_fkey] FOREIGN KEY ([medecinId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
