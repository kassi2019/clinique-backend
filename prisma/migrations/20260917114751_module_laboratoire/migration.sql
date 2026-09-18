BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[examens_labo] (
    [id] INT NOT NULL IDENTITY(1,1),
    [passageId] INT NOT NULL,
    [passagePrestationId] INT NOT NULL,
    [cliniqueId] INT NOT NULL,
    [patientId] INT NOT NULL,
    [libelle] NVARCHAR(1000) NOT NULL,
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [examens_labo_statut_df] DEFAULT 'PRELEVE',
    [preleveParId] INT,
    [preleveLe] DATETIME2,
    [conclusion] NVARCHAR(1000),
    [valideParId] INT,
    [valideLe] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [examens_labo_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [examens_labo_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [examens_labo_passagePrestationId_key] UNIQUE NONCLUSTERED ([passagePrestationId])
);

-- CreateTable
CREATE TABLE [dbo].[examens_labo_lignes] (
    [id] INT NOT NULL IDENTITY(1,1),
    [examenLaboId] INT NOT NULL,
    [parametre] NVARCHAR(1000) NOT NULL,
    [valeur] NVARCHAR(1000),
    [unite] NVARCHAR(1000),
    [normes] NVARCHAR(1000),
    CONSTRAINT [examens_labo_lignes_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[examens_labo] ADD CONSTRAINT [examens_labo_passageId_fkey] FOREIGN KEY ([passageId]) REFERENCES [dbo].[passages]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[examens_labo] ADD CONSTRAINT [examens_labo_passagePrestationId_fkey] FOREIGN KEY ([passagePrestationId]) REFERENCES [dbo].[passages_prestations]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[examens_labo] ADD CONSTRAINT [examens_labo_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[examens_labo] ADD CONSTRAINT [examens_labo_patientId_fkey] FOREIGN KEY ([patientId]) REFERENCES [dbo].[patients]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[examens_labo] ADD CONSTRAINT [examens_labo_preleveParId_fkey] FOREIGN KEY ([preleveParId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[examens_labo] ADD CONSTRAINT [examens_labo_valideParId_fkey] FOREIGN KEY ([valideParId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[examens_labo_lignes] ADD CONSTRAINT [examens_labo_lignes_examenLaboId_fkey] FOREIGN KEY ([examenLaboId]) REFERENCES [dbo].[examens_labo]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
