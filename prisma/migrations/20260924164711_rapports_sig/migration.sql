BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[cliniques] ADD [districtCode] NVARCHAR(1000),
[districtNom] NVARCHAR(1000),
[immatriculation] NVARCHAR(1000),
[populationDesservie] INT,
[regionCode] NVARCHAR(1000),
[regionNom] NVARCHAR(1000),
[responsableRapportContact] NVARCHAR(1000),
[responsableRapportFonction] NVARCHAR(1000),
[responsableRapportNom] NVARCHAR(1000);

-- CreateTable
CREATE TABLE [dbo].[rapports_sig] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [mois] INT NOT NULL,
    [annee] INT NOT NULL,
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [rapports_sig_statut_df] DEFAULT 'BROUILLON',
    [etablissement] NVARCHAR(1000),
    [immatriculation] NVARCHAR(1000),
    [districtNom] NVARCHAR(1000),
    [districtCode] NVARCHAR(1000),
    [regionNom] NVARCHAR(1000),
    [regionCode] NVARCHAR(1000),
    [populationDesservie] INT,
    [realiseParNom] NVARCHAR(1000),
    [realiseParFonction] NVARCHAR(1000),
    [realiseParContact] NVARCHAR(1000),
    [observations] NVARCHAR(1000),
    [portes] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [rapports_sig_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [rapports_sig_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [rapports_sig_cliniqueId_mois_annee_key] UNIQUE NONCLUSTERED ([cliniqueId],[mois],[annee])
);

-- CreateTable
CREATE TABLE [dbo].[rapports_sig_valeurs] (
    [id] INT NOT NULL IDENTITY(1,1),
    [rapportId] INT NOT NULL,
    [tableau] NVARCHAR(1000) NOT NULL,
    [ligne] INT NOT NULL,
    [colonne] INT NOT NULL,
    [valeur] INT,
    CONSTRAINT [rapports_sig_valeurs_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [rapports_sig_valeurs_rapportId_tableau_ligne_colonne_key] UNIQUE NONCLUSTERED ([rapportId],[tableau],[ligne],[colonne])
);

-- AddForeignKey
ALTER TABLE [dbo].[rapports_sig] ADD CONSTRAINT [rapports_sig_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[rapports_sig_valeurs] ADD CONSTRAINT [rapports_sig_valeurs_rapportId_fkey] FOREIGN KEY ([rapportId]) REFERENCES [dbo].[rapports_sig]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
