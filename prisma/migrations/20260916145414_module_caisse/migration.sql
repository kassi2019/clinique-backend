BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[passages_prestations] (
    [id] INT NOT NULL IDENTITY(1,1),
    [passageId] INT NOT NULL,
    [prestationId] INT,
    [libelle] NVARCHAR(1000) NOT NULL,
    [montant] DECIMAL(18,2) NOT NULL,
    [serviceId] INT,
    [source] NVARCHAR(1000) NOT NULL CONSTRAINT [passages_prestations_source_df] DEFAULT 'ACCUEIL',
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [passages_prestations_statut_df] DEFAULT 'EN_ATTENTE',
    [paiementId] INT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [passages_prestations_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [passages_prestations_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[paiements] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [passageId] INT NOT NULL,
    [caissierId] INT NOT NULL,
    [numeroRecu] NVARCHAR(1000) NOT NULL,
    [montantTotal] DECIMAL(18,2) NOT NULL,
    [modePaiement] NVARCHAR(1000) NOT NULL CONSTRAINT [paiements_modePaiement_df] DEFAULT 'ESPECES',
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [paiements_statut_df] DEFAULT 'VALIDE',
    [motifAnnulation] NVARCHAR(1000),
    [dateAnnulation] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [paiements_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [paiements_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [paiements_cliniqueId_numeroRecu_key] UNIQUE NONCLUSTERED ([cliniqueId],[numeroRecu])
);

-- AddForeignKey
ALTER TABLE [dbo].[passages_prestations] ADD CONSTRAINT [passages_prestations_passageId_fkey] FOREIGN KEY ([passageId]) REFERENCES [dbo].[passages]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[passages_prestations] ADD CONSTRAINT [passages_prestations_paiementId_fkey] FOREIGN KEY ([paiementId]) REFERENCES [dbo].[paiements]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[passages_prestations] ADD CONSTRAINT [passages_prestations_prestationId_fkey] FOREIGN KEY ([prestationId]) REFERENCES [dbo].[prestations]([id]) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[passages_prestations] ADD CONSTRAINT [passages_prestations_serviceId_fkey] FOREIGN KEY ([serviceId]) REFERENCES [dbo].[services]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[paiements] ADD CONSTRAINT [paiements_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[paiements] ADD CONSTRAINT [paiements_passageId_fkey] FOREIGN KEY ([passageId]) REFERENCES [dbo].[passages]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[paiements] ADD CONSTRAINT [paiements_caissierId_fkey] FOREIGN KEY ([caissierId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
