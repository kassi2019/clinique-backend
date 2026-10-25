BEGIN TRY

BEGIN TRAN;

-- Une dispensation peut désormais servir une ordonnance externe (sans consultation).
-- La clé étrangère est retirée le temps de rendre la colonne facultative.
ALTER TABLE [dbo].[dispensations] DROP CONSTRAINT [dispensations_consultationId_fkey];
ALTER TABLE [dbo].[dispensations] ALTER COLUMN [consultationId] INT NULL;
ALTER TABLE [dbo].[dispensations] ADD CONSTRAINT [dispensations_consultationId_fkey] FOREIGN KEY ([consultationId]) REFERENCES [dbo].[consultations]([id]) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE [dbo].[dispensations] ADD [ordonnanceExterneId] INT;

-- CreateTable
CREATE TABLE [dbo].[ordonnances_externes] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [numero] NVARCHAR(50) NOT NULL,
    [patientId] INT,
    [clientNom] NVARCHAR(1000),
    [prescripteur] NVARCHAR(1000),
    [etablissement] NVARCHAR(1000),
    [dateOrdonnance] DATE,
    [creeParId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [ordonnances_externes_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ordonnances_externes_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ordonnances_externes_cliniqueId_numero_key] UNIQUE NONCLUSTERED ([cliniqueId],[numero])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ordonnances_externes_cliniqueId_createdAt_idx] ON [dbo].[ordonnances_externes]([cliniqueId], [createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [dispensations_ordonnanceExterneId_idx] ON [dbo].[dispensations]([ordonnanceExterneId]);

-- AddForeignKey
ALTER TABLE [dbo].[dispensations] ADD CONSTRAINT [dispensations_ordonnanceExterneId_fkey] FOREIGN KEY ([ordonnanceExterneId]) REFERENCES [dbo].[ordonnances_externes]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ordonnances_externes] ADD CONSTRAINT [ordonnances_externes_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ordonnances_externes] ADD CONSTRAINT [ordonnances_externes_patientId_fkey] FOREIGN KEY ([patientId]) REFERENCES [dbo].[patients]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ordonnances_externes] ADD CONSTRAINT [ordonnances_externes_creeParId_fkey] FOREIGN KEY ([creeParId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
