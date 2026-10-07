-- Fiche de consultation v2 : listes « Antécédents médicaux » et « Autres examens »,
-- antécédents chirurgicaux Oui/Non, prescription de médicaments Oui/Non,
-- prix des tests automatiques sur l'ordonnance.
BEGIN TRY
BEGIN TRAN;
CREATE TABLE [dbo].[antecedents_medicaux] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [libelle] NVARCHAR(1000) NOT NULL,
    [actif] BIT NOT NULL CONSTRAINT [antecedents_medicaux_actif_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [antecedents_medicaux_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [antecedents_medicaux_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [antecedents_medicaux_cliniqueId_libelle_key] UNIQUE NONCLUSTERED ([cliniqueId],[libelle])
);
ALTER TABLE [dbo].[antecedents_medicaux] ADD CONSTRAINT [antecedents_medicaux_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE TABLE [dbo].[autres_examens] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [libelle] NVARCHAR(1000) NOT NULL,
    [actif] BIT NOT NULL CONSTRAINT [autres_examens_actif_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [autres_examens_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [autres_examens_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [autres_examens_cliniqueId_libelle_key] UNIQUE NONCLUSTERED ([cliniqueId],[libelle])
);
ALTER TABLE [dbo].[autres_examens] ADD CONSTRAINT [autres_examens_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE [dbo].[consultations] ADD [chirurgie] BIT NULL, [prescriptionMedicaments] BIT NULL;
ALTER TABLE [dbo].[prescriptions] ADD [prixUnitaire] DECIMAL(18,2) NULL;
COMMIT TRAN;
END TRY
BEGIN CATCH
IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW
END CATCH
