BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[consultations] ADD [numeroOrdonnance] NVARCHAR(1000),
[ordonnanceStatut] NVARCHAR(1000) NOT NULL CONSTRAINT [consultations_ordonnanceStatut_df] DEFAULT 'EN_ATTENTE';

-- AlterTable
ALTER TABLE [dbo].[utilisateurs] ADD [disponibilite] NVARCHAR(1000) NOT NULL CONSTRAINT [utilisateurs_disponibilite_df] DEFAULT 'INDISPONIBLE';

-- CreateTable
CREATE TABLE [dbo].[affectations] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [passageId] INT NOT NULL,
    [medecinId] INT,
    [dateAffectation] DATETIME2 NOT NULL CONSTRAINT [affectations_dateAffectation_df] DEFAULT CURRENT_TIMESTAMP,
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [affectations_statut_df] DEFAULT 'EN_ATTENTE',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [affectations_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [affectations_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [affectations_passageId_key] UNIQUE NONCLUSTERED ([passageId])
);

-- AddForeignKey
ALTER TABLE [dbo].[affectations] ADD CONSTRAINT [affectations_passageId_fkey] FOREIGN KEY ([passageId]) REFERENCES [dbo].[passages]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[affectations] ADD CONSTRAINT [affectations_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[affectations] ADD CONSTRAINT [affectations_medecinId_fkey] FOREIGN KEY ([medecinId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
