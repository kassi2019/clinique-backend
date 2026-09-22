BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[paiements] ADD [assuranceId] INT,
[formuleLibelle] NVARCHAR(1000),
[motifTaux] NVARCHAR(1000),
[partAssurance] DECIMAL(18,2),
[partPatient] DECIMAL(18,2),
[tauxApplique] INT,
[tauxParametre] INT;

-- CreateTable
CREATE TABLE [dbo].[assurances] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [code] NVARCHAR(1000) NOT NULL,
    [libelle] NVARCHAR(1000) NOT NULL,
    [telephone] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [adresse] NVARCHAR(1000),
    [numeroAgrement] NVARCHAR(1000),
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [assurances_statut_df] DEFAULT 'ACTIF',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [assurances_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [assurances_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [assurances_cliniqueId_code_key] UNIQUE NONCLUSTERED ([cliniqueId],[code])
);

-- CreateTable
CREATE TABLE [dbo].[assurance_formules] (
    [id] INT NOT NULL IDENTITY(1,1),
    [assuranceId] INT NOT NULL,
    [code] NVARCHAR(1000) NOT NULL,
    [libelle] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [dateDebut] DATE,
    [dateFin] DATE,
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [assurance_formules_statut_df] DEFAULT 'ACTIF',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [assurance_formules_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [assurance_formules_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [assurance_formules_assuranceId_code_key] UNIQUE NONCLUSTERED ([assuranceId],[code])
);

-- CreateTable
CREATE TABLE [dbo].[assurance_formule_prestations] (
    [id] INT NOT NULL IDENTITY(1,1),
    [formuleId] INT NOT NULL,
    [prestationId] INT NOT NULL,
    [tauxCouverture] INT NOT NULL,
    [plafond] DECIMAL(18,2),
    [dateDebut] DATE,
    [dateFin] DATE,
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [assurance_formule_prestations_statut_df] DEFAULT 'ACTIF',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [assurance_formule_prestations_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [assurance_formule_prestations_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [assurance_formule_prestations_formuleId_prestationId_key] UNIQUE NONCLUSTERED ([formuleId],[prestationId])
);

-- CreateTable
CREATE TABLE [dbo].[patient_assurances] (
    [id] INT NOT NULL IDENTITY(1,1),
    [patientId] INT NOT NULL,
    [assuranceId] INT NOT NULL,
    [formuleId] INT NOT NULL,
    [numeroAssure] NVARCHAR(1000),
    [numeroCarte] NVARCHAR(1000),
    [nomAssurePrincipal] NVARCHAR(1000),
    [typeBeneficiaire] NVARCHAR(1000),
    [dateDebut] DATE,
    [dateFin] DATE,
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [patient_assurances_statut_df] DEFAULT 'ACTIF',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [patient_assurances_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [patient_assurances_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[prise_en_charges] (
    [id] INT NOT NULL IDENTITY(1,1),
    [paiementId] INT NOT NULL,
    [ligneId] INT NOT NULL,
    [assuranceId] INT,
    [formuleId] INT,
    [tauxParametre] INT NOT NULL,
    [tauxApplique] INT NOT NULL,
    [montantTotal] DECIMAL(18,2) NOT NULL,
    [montantAssurance] DECIMAL(18,2) NOT NULL,
    [montantPatient] DECIMAL(18,2) NOT NULL,
    [motifModification] NVARCHAR(1000),
    [utilisateurId] INT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [prise_en_charges_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [prise_en_charges_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[paiements] ADD CONSTRAINT [paiements_assuranceId_fkey] FOREIGN KEY ([assuranceId]) REFERENCES [dbo].[assurances]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[assurances] ADD CONSTRAINT [assurances_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[assurance_formules] ADD CONSTRAINT [assurance_formules_assuranceId_fkey] FOREIGN KEY ([assuranceId]) REFERENCES [dbo].[assurances]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[assurance_formule_prestations] ADD CONSTRAINT [assurance_formule_prestations_formuleId_fkey] FOREIGN KEY ([formuleId]) REFERENCES [dbo].[assurance_formules]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[assurance_formule_prestations] ADD CONSTRAINT [assurance_formule_prestations_prestationId_fkey] FOREIGN KEY ([prestationId]) REFERENCES [dbo].[prestations]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[patient_assurances] ADD CONSTRAINT [patient_assurances_patientId_fkey] FOREIGN KEY ([patientId]) REFERENCES [dbo].[patients]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[patient_assurances] ADD CONSTRAINT [patient_assurances_assuranceId_fkey] FOREIGN KEY ([assuranceId]) REFERENCES [dbo].[assurances]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[patient_assurances] ADD CONSTRAINT [patient_assurances_formuleId_fkey] FOREIGN KEY ([formuleId]) REFERENCES [dbo].[assurance_formules]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[prise_en_charges] ADD CONSTRAINT [prise_en_charges_paiementId_fkey] FOREIGN KEY ([paiementId]) REFERENCES [dbo].[paiements]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[prise_en_charges] ADD CONSTRAINT [prise_en_charges_assuranceId_fkey] FOREIGN KEY ([assuranceId]) REFERENCES [dbo].[assurances]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[prise_en_charges] ADD CONSTRAINT [prise_en_charges_formuleId_fkey] FOREIGN KEY ([formuleId]) REFERENCES [dbo].[assurance_formules]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
