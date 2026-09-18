BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[chambres] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [numero] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000),
    [actif] BIT NOT NULL CONSTRAINT [chambres_actif_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [chambres_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [chambres_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [chambres_cliniqueId_numero_key] UNIQUE NONCLUSTERED ([cliniqueId],[numero])
);

-- CreateTable
CREATE TABLE [dbo].[lits] (
    [id] INT NOT NULL IDENTITY(1,1),
    [chambreId] INT NOT NULL,
    [numero] NVARCHAR(1000) NOT NULL,
    [actif] BIT NOT NULL CONSTRAINT [lits_actif_df] DEFAULT 1,
    CONSTRAINT [lits_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [lits_chambreId_numero_key] UNIQUE NONCLUSTERED ([chambreId],[numero])
);

-- CreateTable
CREATE TABLE [dbo].[hospitalisations] (
    [id] INT NOT NULL IDENTITY(1,1),
    [passageId] INT NOT NULL,
    [cliniqueId] INT NOT NULL,
    [patientId] INT NOT NULL,
    [litId] INT NOT NULL,
    [dateEntree] DATETIME2 NOT NULL,
    [dateSortie] DATETIME2,
    [dureePrevue] NVARCHAR(1000),
    [motif] NVARCHAR(1000),
    [observations] NVARCHAR(1000),
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [hospitalisations_statut_df] DEFAULT 'EN_COURS',
    [sortieMotif] NVARCHAR(1000),
    [sortieParId] INT,
    [nbJoursFactures] INT,
    [montantJournalier] DECIMAL(18,2),
    [passagePrestationId] INT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [hospitalisations_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [hospitalisations_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [hospitalisations_passageId_key] UNIQUE NONCLUSTERED ([passageId]),
    CONSTRAINT [hospitalisations_passagePrestationId_key] UNIQUE NONCLUSTERED ([passagePrestationId])
);

-- AddForeignKey
ALTER TABLE [dbo].[chambres] ADD CONSTRAINT [chambres_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[lits] ADD CONSTRAINT [lits_chambreId_fkey] FOREIGN KEY ([chambreId]) REFERENCES [dbo].[chambres]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[hospitalisations] ADD CONSTRAINT [hospitalisations_passageId_fkey] FOREIGN KEY ([passageId]) REFERENCES [dbo].[passages]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[hospitalisations] ADD CONSTRAINT [hospitalisations_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[hospitalisations] ADD CONSTRAINT [hospitalisations_patientId_fkey] FOREIGN KEY ([patientId]) REFERENCES [dbo].[patients]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[hospitalisations] ADD CONSTRAINT [hospitalisations_litId_fkey] FOREIGN KEY ([litId]) REFERENCES [dbo].[lits]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[hospitalisations] ADD CONSTRAINT [hospitalisations_sortieParId_fkey] FOREIGN KEY ([sortieParId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[hospitalisations] ADD CONSTRAINT [hospitalisations_passagePrestationId_fkey] FOREIGN KEY ([passagePrestationId]) REFERENCES [dbo].[passages_prestations]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
