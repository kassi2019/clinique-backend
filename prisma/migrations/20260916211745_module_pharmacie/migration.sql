BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[medicaments] ADD [prixVente] DECIMAL(18,2),
[seuilAlerte] INT NOT NULL CONSTRAINT [medicaments_seuilAlerte_df] DEFAULT 0;

-- CreateTable
CREATE TABLE [dbo].[lots] (
    [id] INT NOT NULL IDENTITY(1,1),
    [medicamentId] INT NOT NULL,
    [numeroLot] NVARCHAR(1000) NOT NULL,
    [quantiteInitiale] INT NOT NULL,
    [quantiteRestante] INT NOT NULL,
    [datePeremption] DATE NOT NULL,
    [prixAchat] DECIMAL(18,2),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [lots_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [lots_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[mouvements_stock] (
    [id] INT NOT NULL IDENTITY(1,1),
    [medicamentId] INT NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [quantite] INT NOT NULL,
    [lotId] INT,
    [reference] NVARCHAR(1000),
    [utilisateurId] INT,
    [commentaire] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [mouvements_stock_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [mouvements_stock_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[dispensations] (
    [id] INT NOT NULL IDENTITY(1,1),
    [consultationId] INT NOT NULL,
    [pharmacienId] INT NOT NULL,
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [dispensations_statut_df] DEFAULT 'EN_COURS',
    [montantTotal] DECIMAL(18,2) NOT NULL CONSTRAINT [dispensations_montantTotal_df] DEFAULT 0,
    [clotureeLe] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [dispensations_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [dispensations_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[dispensations_lignes] (
    [id] INT NOT NULL IDENTITY(1,1),
    [dispensationId] INT NOT NULL,
    [prescriptionId] INT,
    [medicamentId] INT,
    [medicamentNom] NVARCHAR(1000) NOT NULL,
    [quantitePrescrite] NVARCHAR(1000),
    [quantiteDelivree] INT NOT NULL,
    [prixUnitaire] DECIMAL(18,2) NOT NULL,
    [montant] DECIMAL(18,2) NOT NULL,
    CONSTRAINT [dispensations_lignes_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[pharmacie_paiements] (
    [id] INT NOT NULL IDENTITY(1,1),
    [dispensationId] INT NOT NULL,
    [caissierId] INT NOT NULL,
    [numeroRecu] NVARCHAR(1000) NOT NULL,
    [montantTotal] DECIMAL(18,2) NOT NULL,
    [modePaiement] NVARCHAR(1000) NOT NULL CONSTRAINT [pharmacie_paiements_modePaiement_df] DEFAULT 'ESPECES',
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [pharmacie_paiements_statut_df] DEFAULT 'VALIDE',
    [motifAnnulation] NVARCHAR(1000),
    [dateAnnulation] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [pharmacie_paiements_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [pharmacie_paiements_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [pharmacie_paiements_dispensationId_key] UNIQUE NONCLUSTERED ([dispensationId])
);

-- CreateTable
CREATE TABLE [dbo].[consommables] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [nom] NVARCHAR(1000) NOT NULL,
    [unite] NVARCHAR(1000),
    [quantite] INT NOT NULL CONSTRAINT [consommables_quantite_df] DEFAULT 0,
    [seuilAlerte] INT NOT NULL CONSTRAINT [consommables_seuilAlerte_df] DEFAULT 0,
    [actif] BIT NOT NULL CONSTRAINT [consommables_actif_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [consommables_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [consommables_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [consommables_cliniqueId_nom_key] UNIQUE NONCLUSTERED ([cliniqueId],[nom])
);

-- CreateTable
CREATE TABLE [dbo].[mouvements_consommables] (
    [id] INT NOT NULL IDENTITY(1,1),
    [consommableId] INT NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [quantite] INT NOT NULL,
    [reference] NVARCHAR(1000),
    [utilisateurId] INT,
    [commentaire] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [mouvements_consommables_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [mouvements_consommables_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[lots] ADD CONSTRAINT [lots_medicamentId_fkey] FOREIGN KEY ([medicamentId]) REFERENCES [dbo].[medicaments]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mouvements_stock] ADD CONSTRAINT [mouvements_stock_medicamentId_fkey] FOREIGN KEY ([medicamentId]) REFERENCES [dbo].[medicaments]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mouvements_stock] ADD CONSTRAINT [mouvements_stock_lotId_fkey] FOREIGN KEY ([lotId]) REFERENCES [dbo].[lots]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[mouvements_stock] ADD CONSTRAINT [mouvements_stock_utilisateurId_fkey] FOREIGN KEY ([utilisateurId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[dispensations] ADD CONSTRAINT [dispensations_consultationId_fkey] FOREIGN KEY ([consultationId]) REFERENCES [dbo].[consultations]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[dispensations] ADD CONSTRAINT [dispensations_pharmacienId_fkey] FOREIGN KEY ([pharmacienId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[dispensations_lignes] ADD CONSTRAINT [dispensations_lignes_dispensationId_fkey] FOREIGN KEY ([dispensationId]) REFERENCES [dbo].[dispensations]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[dispensations_lignes] ADD CONSTRAINT [dispensations_lignes_prescriptionId_fkey] FOREIGN KEY ([prescriptionId]) REFERENCES [dbo].[prescriptions]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[dispensations_lignes] ADD CONSTRAINT [dispensations_lignes_medicamentId_fkey] FOREIGN KEY ([medicamentId]) REFERENCES [dbo].[medicaments]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[pharmacie_paiements] ADD CONSTRAINT [pharmacie_paiements_dispensationId_fkey] FOREIGN KEY ([dispensationId]) REFERENCES [dbo].[dispensations]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[pharmacie_paiements] ADD CONSTRAINT [pharmacie_paiements_caissierId_fkey] FOREIGN KEY ([caissierId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[consommables] ADD CONSTRAINT [consommables_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[mouvements_consommables] ADD CONSTRAINT [mouvements_consommables_consommableId_fkey] FOREIGN KEY ([consommableId]) REFERENCES [dbo].[consommables]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mouvements_consommables] ADD CONSTRAINT [mouvements_consommables_utilisateurId_fkey] FOREIGN KEY ([utilisateurId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
