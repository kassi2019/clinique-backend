BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[grossesses] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [patientId] INT NOT NULL,
    [numero] NVARCHAR(1000) NOT NULL,
    [ddr] DATE NOT NULL,
    [dpa] DATE NOT NULL,
    [gravidite] INT,
    [parite] INT,
    [antecedentsObstetricaux] NVARCHAR(1000),
    [facteursRisque] NVARCHAR(1000),
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [grossesses_statut_df] DEFAULT 'EN_COURS',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [grossesses_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [grossesses_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [grossesses_numero_key] UNIQUE NONCLUSTERED ([numero])
);

-- CreateTable
CREATE TABLE [dbo].[visites_cpn] (
    [id] INT NOT NULL IDENTITY(1,1),
    [grossesseId] INT NOT NULL,
    [numero] INT NOT NULL,
    [date] DATE NOT NULL,
    [ageGestationnelSA] NVARCHAR(1000),
    [poids] DECIMAL(5,1),
    [tensionGauche] NVARCHAR(1000),
    [tensionDroite] NVARCHAR(1000),
    [hauteurUterine] NVARCHAR(1000),
    [bcf] NVARCHAR(1000),
    [mouvementsActifs] NVARCHAR(1000),
    [oedemes] NVARCHAR(1000),
    [albumine] NVARCHAR(1000),
    [sucre] NVARCHAR(1000),
    [presentation] NVARCHAR(1000),
    [tv] NVARCHAR(1000),
    [conseils] NVARCHAR(1000),
    [prochaineVisite] DATE,
    [agentId] INT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [visites_cpn_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [visites_cpn_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[accouchements] (
    [id] INT NOT NULL IDENTITY(1,1),
    [grossesseId] INT NOT NULL,
    [dateHeure] DATETIME2 NOT NULL,
    [voie] NVARCHAR(1000) NOT NULL CONSTRAINT [accouchements_voie_df] DEFAULT 'VOIE_BASSE',
    [termeSA] NVARCHAR(1000),
    [sexeEnfant] NVARCHAR(1000),
    [poidsEnfant] DECIMAL(5,2),
    [apgar] NVARCHAR(1000),
    [issueMere] NVARCHAR(1000),
    [issueEnfant] NVARCHAR(1000),
    [complications] NVARCHAR(1000),
    [lieu] NVARCHAR(1000),
    [agentId] INT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [accouchements_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [accouchements_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [accouchements_grossesseId_key] UNIQUE NONCLUSTERED ([grossesseId])
);

-- AddForeignKey
ALTER TABLE [dbo].[grossesses] ADD CONSTRAINT [grossesses_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[grossesses] ADD CONSTRAINT [grossesses_patientId_fkey] FOREIGN KEY ([patientId]) REFERENCES [dbo].[patients]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[visites_cpn] ADD CONSTRAINT [visites_cpn_grossesseId_fkey] FOREIGN KEY ([grossesseId]) REFERENCES [dbo].[grossesses]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[visites_cpn] ADD CONSTRAINT [visites_cpn_agentId_fkey] FOREIGN KEY ([agentId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[accouchements] ADD CONSTRAINT [accouchements_grossesseId_fkey] FOREIGN KEY ([grossesseId]) REFERENCES [dbo].[grossesses]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[accouchements] ADD CONSTRAINT [accouchements_agentId_fkey] FOREIGN KEY ([agentId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
