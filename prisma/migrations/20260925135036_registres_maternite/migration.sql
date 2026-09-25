BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[accouchements] ADD [ageGrossessePremiereCpn] NVARCHAR(1000),
[antecedentsChirurgicaux] NVARCHAR(1000),
[antecedentsMedicaux] NVARCHAR(1000),
[avortements] INT,
[cesariennes] INT,
[contractions] NVARCHAR(1000),
[decedeMaternite] BIT,
[delivranceLe] DATETIME2,
[diabeteConnu] BIT,
[enTravail] BIT,
[enfantsDecedes] INT,
[enfantsVivants] INT,
[gemellite] INT,
[heureArrivee] DATETIME2,
[hppi] BIT,
[htaConnue] BIT,
[interventionMedecin] NVARCHAR(1000),
[liquideAspect] NVARCHAR(1000),
[modeEntree] NVARCHAR(1000),
[motifAdmission] NVARCHAR(1000),
[nombreCpn] INT,
[numeroAccouchement] INT,
[numeroPec] NVARCHAR(1000),
[offreTestVih] BIT,
[perimetreCranienEnfant] NVARCHAR(1000),
[pocheEauxIntacte] BIT,
[prematurite] INT,
[reanimationNn] BIT,
[resultatTestVih] NVARCHAR(1000),
[revisionUterine] BIT,
[ruptureHeures] INT,
[sortieMereLe] DATETIME2,
[sortieMereMode] NVARCHAR(1000),
[sousTarvCpn] BIT,
[statutVihAccueil] NVARCHAR(1000),
[toxemie] NVARCHAR(1000),
[ubt] BIT;

-- AlterTable
ALTER TABLE [dbo].[grossesses] ADD [antecedentsChirurgicaux] NVARCHAR(1000),
[antecedentsMedicaux] NVARCHAR(1000),
[avortements] INT,
[cesariennes] INT,
[enfantsDecedes] INT,
[enfantsVivants] INT,
[modeEntree] NVARCHAR(1000),
[numeroGestante] NVARCHAR(1000),
[statutVih] NVARCHAR(1000),
[toxemie] NVARCHAR(1000),
[vat1] DATE,
[vat2] DATE,
[vatRappel] DATE,
[vatStatut] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[passages] ADD [materniteTraiteLe] DATETIME2;

-- CreateTable
CREATE TABLE [dbo].[consultations_postnatales] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [passageId] INT NOT NULL,
    [patientId] INT NOT NULL,
    [grossesseId] INT,
    [date] DATE NOT NULL,
    [modeEntree] NVARCHAR(1000),
    [numeroGestanteReport] NVARCHAR(1000),
    [typeCpon] NVARCHAR(1000),
    [dateAccouchement] DATE,
    [lieuAccouchement] NVARCHAR(1000),
    [modeAccouchement] NVARCHAR(1000),
    [numeroDepistagePec] NVARCHAR(1000),
    [statutVih] NVARCHAR(1000),
    [examenMere] NVARCHAR(1000),
    [examenEnfant] NVARCHAR(1000),
    [conseils] NVARCHAR(1000),
    [observations] NVARCHAR(1000),
    [agentId] INT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [consultations_postnatales_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [consultations_postnatales_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[consultations_pf] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [passageId] INT NOT NULL,
    [patientId] INT NOT NULL,
    [date] DATE NOT NULL,
    [methode] NVARCHAR(1000) NOT NULL,
    [nouvelleUtilisatrice] BIT NOT NULL CONSTRAINT [consultations_pf_nouvelleUtilisatrice_df] DEFAULT 1,
    [protégée] BIT NOT NULL CONSTRAINT [consultations_pf_protégée_df] DEFAULT 0,
    [perdueDeVue] BIT NOT NULL CONSTRAINT [consultations_pf_perdueDeVue_df] DEFAULT 0,
    [abandon] BIT NOT NULL CONSTRAINT [consultations_pf_abandon_df] DEFAULT 0,
    [arretRetrait] BIT NOT NULL CONSTRAINT [consultations_pf_arretRetrait_df] DEFAULT 0,
    [conseilPostpartum] BIT NOT NULL CONSTRAINT [consultations_pf_conseilPostpartum_df] DEFAULT 0,
    [produitPostpartumImmediat] BIT NOT NULL CONSTRAINT [consultations_pf_produitPostpartumImmediat_df] DEFAULT 0,
    [produitPostAbortum] BIT NOT NULL CONSTRAINT [consultations_pf_produitPostAbortum_df] DEFAULT 0,
    [femmesFormeesAutoInjection] BIT NOT NULL CONSTRAINT [consultations_pf_femmesFormeesAutoInjection_df] DEFAULT 0,
    [istPresente] BIT NOT NULL CONSTRAINT [consultations_pf_istPresente_df] DEFAULT 0,
    [seropositive] BIT NOT NULL CONSTRAINT [consultations_pf_seropositive_df] DEFAULT 0,
    [nourrisson0_6] BIT NOT NULL CONSTRAINT [consultations_pf_nourrisson0_6_df] DEFAULT 0,
    [nourrisson6] BIT NOT NULL CONSTRAINT [consultations_pf_nourrisson6_df] DEFAULT 0,
    [observations] NVARCHAR(1000),
    [agentId] INT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [consultations_pf_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [consultations_pf_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[consultations_postnatales] ADD CONSTRAINT [consultations_postnatales_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[consultations_postnatales] ADD CONSTRAINT [consultations_postnatales_passageId_fkey] FOREIGN KEY ([passageId]) REFERENCES [dbo].[passages]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[consultations_postnatales] ADD CONSTRAINT [consultations_postnatales_patientId_fkey] FOREIGN KEY ([patientId]) REFERENCES [dbo].[patients]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[consultations_postnatales] ADD CONSTRAINT [consultations_postnatales_agentId_fkey] FOREIGN KEY ([agentId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[consultations_pf] ADD CONSTRAINT [consultations_pf_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[consultations_pf] ADD CONSTRAINT [consultations_pf_passageId_fkey] FOREIGN KEY ([passageId]) REFERENCES [dbo].[passages]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[consultations_pf] ADD CONSTRAINT [consultations_pf_patientId_fkey] FOREIGN KEY ([patientId]) REFERENCES [dbo].[patients]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[consultations_pf] ADD CONSTRAINT [consultations_pf_agentId_fkey] FOREIGN KEY ([agentId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
