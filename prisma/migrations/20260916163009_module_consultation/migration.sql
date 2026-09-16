BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[medicaments] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [nom] NVARCHAR(1000) NOT NULL,
    [forme] NVARCHAR(1000),
    [dosage] NVARCHAR(1000),
    [actif] BIT NOT NULL CONSTRAINT [medicaments_actif_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [medicaments_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [medicaments_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [medicaments_cliniqueId_nom_key] UNIQUE NONCLUSTERED ([cliniqueId],[nom])
);

-- CreateTable
CREATE TABLE [dbo].[consultations] (
    [id] INT NOT NULL IDENTITY(1,1),
    [passageId] INT NOT NULL,
    [patientId] INT NOT NULL,
    [medecinId] INT NOT NULL,
    [motif] NVARCHAR(1000),
    [observation] NVARCHAR(1000),
    [diagnostic] NVARCHAR(1000),
    [hospitalisation] BIT NOT NULL CONSTRAINT [consultations_hospitalisation_df] DEFAULT 0,
    [hospitalisationDuree] NVARCHAR(1000),
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [consultations_statut_df] DEFAULT 'EN_COURS',
    [valideeLe] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [consultations_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [consultations_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [consultations_passageId_key] UNIQUE NONCLUSTERED ([passageId])
);

-- CreateTable
CREATE TABLE [dbo].[prescriptions] (
    [id] INT NOT NULL IDENTITY(1,1),
    [consultationId] INT NOT NULL,
    [medicamentId] INT,
    [medicamentNom] NVARCHAR(1000) NOT NULL,
    [forme] NVARCHAR(1000),
    [posologie] NVARCHAR(1000),
    [quantite] NVARCHAR(1000),
    [duree] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [prescriptions_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [prescriptions_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[medicaments] ADD CONSTRAINT [medicaments_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[consultations] ADD CONSTRAINT [consultations_passageId_fkey] FOREIGN KEY ([passageId]) REFERENCES [dbo].[passages]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[consultations] ADD CONSTRAINT [consultations_patientId_fkey] FOREIGN KEY ([patientId]) REFERENCES [dbo].[patients]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[consultations] ADD CONSTRAINT [consultations_medecinId_fkey] FOREIGN KEY ([medecinId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[prescriptions] ADD CONSTRAINT [prescriptions_consultationId_fkey] FOREIGN KEY ([consultationId]) REFERENCES [dbo].[consultations]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[prescriptions] ADD CONSTRAINT [prescriptions_medicamentId_fkey] FOREIGN KEY ([medicamentId]) REFERENCES [dbo].[medicaments]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
