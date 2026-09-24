BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[soins] (
    [id] INT NOT NULL IDENTITY(1,1),
    [passageId] INT NOT NULL,
    [passagePrestationId] INT NOT NULL,
    [cliniqueId] INT NOT NULL,
    [patientId] INT NOT NULL,
    [libelle] NVARCHAR(1000) NOT NULL,
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [soins_statut_df] DEFAULT 'EN_ATTENTE',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [soins_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [soins_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [soins_passagePrestationId_key] UNIQUE NONCLUSTERED ([passagePrestationId])
);

-- CreateTable
CREATE TABLE [dbo].[realisations_soins] (
    [id] INT NOT NULL IDENTITY(1,1),
    [soinId] INT NOT NULL,
    [date] DATETIME2 NOT NULL,
    [observations] NVARCHAR(1000),
    [agentId] INT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [realisations_soins_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [realisations_soins_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[soins] ADD CONSTRAINT [soins_passageId_fkey] FOREIGN KEY ([passageId]) REFERENCES [dbo].[passages]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[soins] ADD CONSTRAINT [soins_passagePrestationId_fkey] FOREIGN KEY ([passagePrestationId]) REFERENCES [dbo].[passages_prestations]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[soins] ADD CONSTRAINT [soins_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[soins] ADD CONSTRAINT [soins_patientId_fkey] FOREIGN KEY ([patientId]) REFERENCES [dbo].[patients]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[realisations_soins] ADD CONSTRAINT [realisations_soins_soinId_fkey] FOREIGN KEY ([soinId]) REFERENCES [dbo].[soins]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[realisations_soins] ADD CONSTRAINT [realisations_soins_agentId_fkey] FOREIGN KEY ([agentId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
