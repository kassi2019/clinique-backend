BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[patients] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [numeroDossier] NVARCHAR(1000) NOT NULL,
    [nom] NVARCHAR(1000) NOT NULL,
    [prenom] NVARCHAR(1000) NOT NULL,
    [age] NVARCHAR(1000),
    [sexe] NVARCHAR(1000),
    [ville] NVARCHAR(1000),
    [quartier] NVARCHAR(1000),
    [profession] NVARCHAR(1000),
    [telephone] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [patients_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [patients_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [patients_cliniqueId_numeroDossier_key] UNIQUE NONCLUSTERED ([cliniqueId],[numeroDossier])
);

-- CreateTable
CREATE TABLE [dbo].[passages] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [patientId] INT NOT NULL,
    [numeroOrdre] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(1000) NOT NULL,
    [serviceId] INT NOT NULL,
    [typePatient] NVARCHAR(1000) NOT NULL CONSTRAINT [passages_typePatient_df] DEFAULT 'INTERNE',
    [motif] NVARCHAR(1000),
    [referent] NVARCHAR(1000),
    [prestationDemandee] NVARCHAR(1000),
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [passages_statut_df] DEFAULT 'EN_ATTENTE_PAIEMENT',
    [taille] NVARCHAR(1000),
    [temperature] DECIMAL(4,1),
    [pouls] INT,
    [tensionGauche] NVARCHAR(1000),
    [tensionDroite] NVARCHAR(1000),
    [poids] DECIMAL(5,1),
    [expireLe] DATETIME2 NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [passages_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [passages_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [passages_code_key] UNIQUE NONCLUSTERED ([code]),
    CONSTRAINT [passages_cliniqueId_numeroOrdre_key] UNIQUE NONCLUSTERED ([cliniqueId],[numeroOrdre])
);

-- AddForeignKey
ALTER TABLE [dbo].[patients] ADD CONSTRAINT [patients_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[passages] ADD CONSTRAINT [passages_patientId_fkey] FOREIGN KEY ([patientId]) REFERENCES [dbo].[patients]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[passages] ADD CONSTRAINT [passages_serviceId_fkey] FOREIGN KEY ([serviceId]) REFERENCES [dbo].[services]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[passages] ADD CONSTRAINT [passages_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
