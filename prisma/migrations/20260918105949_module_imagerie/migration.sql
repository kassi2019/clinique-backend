BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[examens_imagerie] (
    [id] INT NOT NULL IDENTITY(1,1),
    [passageId] INT NOT NULL,
    [passagePrestationId] INT NOT NULL,
    [cliniqueId] INT NOT NULL,
    [patientId] INT NOT NULL,
    [libelle] NVARCHAR(1000) NOT NULL,
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [examens_imagerie_statut_df] DEFAULT 'RESULTATS',
    [indication] NVARCHAR(1000),
    [technique] NVARCHAR(1000),
    [resultat] NVARCHAR(1000),
    [conclusion] NVARCHAR(1000),
    [valideParId] INT,
    [valideLe] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [examens_imagerie_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [examens_imagerie_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [examens_imagerie_passagePrestationId_key] UNIQUE NONCLUSTERED ([passagePrestationId])
);

-- AddForeignKey
ALTER TABLE [dbo].[examens_imagerie] ADD CONSTRAINT [examens_imagerie_passageId_fkey] FOREIGN KEY ([passageId]) REFERENCES [dbo].[passages]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[examens_imagerie] ADD CONSTRAINT [examens_imagerie_passagePrestationId_fkey] FOREIGN KEY ([passagePrestationId]) REFERENCES [dbo].[passages_prestations]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[examens_imagerie] ADD CONSTRAINT [examens_imagerie_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[examens_imagerie] ADD CONSTRAINT [examens_imagerie_patientId_fkey] FOREIGN KEY ([patientId]) REFERENCES [dbo].[patients]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[examens_imagerie] ADD CONSTRAINT [examens_imagerie_valideParId_fkey] FOREIGN KEY ([valideParId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
