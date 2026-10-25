BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ordonnances] ADD [type] NVARCHAR(1000) NOT NULL CONSTRAINT [ordonnances_type_df] DEFAULT 'MEDICAMENTS';

-- CreateTable
CREATE TABLE [dbo].[types_soins] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [libelle] NVARCHAR(1000) NOT NULL,
    [actif] BIT NOT NULL CONSTRAINT [types_soins_actif_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [types_soins_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [types_soins_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [types_soins_cliniqueId_libelle_key] UNIQUE NONCLUSTERED ([cliniqueId],[libelle])
);

-- CreateTable
CREATE TABLE [dbo].[prescriptions_soins] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [consultationId] INT NOT NULL,
    [passageId] INT NOT NULL,
    [patientId] INT NOT NULL,
    [medecinId] INT NOT NULL,
    [ordonnanceId] INT,
    [typeSoinId] INT,
    [typeSoin] NVARCHAR(1000) NOT NULL,
    [foisParJour] INT NOT NULL CONSTRAINT [prescriptions_soins_foisParJour_df] DEFAULT 1,
    [dureeJours] INT NOT NULL CONSTRAINT [prescriptions_soins_dureeJours_df] DEFAULT 1,
    [nbAdministrations] INT NOT NULL CONSTRAINT [prescriptions_soins_nbAdministrations_df] DEFAULT 1,
    [instructions] NVARCHAR(1000),
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [prescriptions_soins_statut_df] DEFAULT 'EN_COURS',
    [arreteLe] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [prescriptions_soins_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [prescriptions_soins_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[lignes_soins] (
    [id] INT NOT NULL IDENTITY(1,1),
    [prescriptionSoinId] INT NOT NULL,
    [medicamentId] INT,
    [medicamentNom] NVARCHAR(1000) NOT NULL,
    [forme] NVARCHAR(1000),
    [dose] NVARCHAR(1000) NOT NULL,
    [unite] NVARCHAR(1000),
    [voie] NVARCHAR(1000),
    [posologie] NVARCHAR(1000),
    [quantitePharmacie] INT NOT NULL CONSTRAINT [lignes_soins_quantitePharmacie_df] DEFAULT 1,
    [prescriptionId] INT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [lignes_soins_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [lignes_soins_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[administrations_soins] (
    [id] INT NOT NULL IDENTITY(1,1),
    [prescriptionSoinId] INT NOT NULL,
    [date] DATETIME2 NOT NULL,
    [observations] NVARCHAR(1000),
    [agentId] INT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [administrations_soins_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [administrations_soins_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [prescriptions_soins_passageId_idx] ON [dbo].[prescriptions_soins]([passageId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [prescriptions_soins_cliniqueId_statut_idx] ON [dbo].[prescriptions_soins]([cliniqueId], [statut]);

-- AddForeignKey
ALTER TABLE [dbo].[types_soins] ADD CONSTRAINT [types_soins_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[prescriptions_soins] ADD CONSTRAINT [prescriptions_soins_consultationId_fkey] FOREIGN KEY ([consultationId]) REFERENCES [dbo].[consultations]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[prescriptions_soins] ADD CONSTRAINT [prescriptions_soins_passageId_fkey] FOREIGN KEY ([passageId]) REFERENCES [dbo].[passages]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[prescriptions_soins] ADD CONSTRAINT [prescriptions_soins_patientId_fkey] FOREIGN KEY ([patientId]) REFERENCES [dbo].[patients]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[prescriptions_soins] ADD CONSTRAINT [prescriptions_soins_medecinId_fkey] FOREIGN KEY ([medecinId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[prescriptions_soins] ADD CONSTRAINT [prescriptions_soins_ordonnanceId_fkey] FOREIGN KEY ([ordonnanceId]) REFERENCES [dbo].[ordonnances]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[prescriptions_soins] ADD CONSTRAINT [prescriptions_soins_typeSoinId_fkey] FOREIGN KEY ([typeSoinId]) REFERENCES [dbo].[types_soins]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[lignes_soins] ADD CONSTRAINT [lignes_soins_prescriptionSoinId_fkey] FOREIGN KEY ([prescriptionSoinId]) REFERENCES [dbo].[prescriptions_soins]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[lignes_soins] ADD CONSTRAINT [lignes_soins_medicamentId_fkey] FOREIGN KEY ([medicamentId]) REFERENCES [dbo].[medicaments]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[lignes_soins] ADD CONSTRAINT [lignes_soins_prescriptionId_fkey] FOREIGN KEY ([prescriptionId]) REFERENCES [dbo].[prescriptions]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[administrations_soins] ADD CONSTRAINT [administrations_soins_prescriptionSoinId_fkey] FOREIGN KEY ([prescriptionSoinId]) REFERENCES [dbo].[prescriptions_soins]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[administrations_soins] ADD CONSTRAINT [administrations_soins_agentId_fkey] FOREIGN KEY ([agentId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- CreateIndex (unique filtré : plusieurs lignes sans ordonnance restent possibles)
CREATE UNIQUE NONCLUSTERED INDEX [lignes_soins_prescriptionId_key] ON [dbo].[lignes_soins]([prescriptionId]) WHERE [prescriptionId] IS NOT NULL;

-- Types de soins par défaut pour chaque clinique
INSERT INTO [dbo].[types_soins] ([cliniqueId], [libelle], [updatedAt])
SELECT c.[id], t.[libelle], CURRENT_TIMESTAMP
FROM [dbo].[cliniques] c
CROSS JOIN (VALUES (N'Injection'), (N'Pansement'), (N'Perfusion')) t([libelle]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
