BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[certificats_arret] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [consultationId] INT NOT NULL,
    [passageId] INT NOT NULL,
    [patientId] INT NOT NULL,
    [numero] NVARCHAR(1000) NOT NULL,
    [civilite] NVARCHAR(1000) NOT NULL,
    [nomPatient] NVARCHAR(1000) NOT NULL,
    [dateNaissance] NVARCHAR(1000),
    [profession] NVARCHAR(1000),
    [dureeJours] INT NOT NULL,
    [debut] DATE NOT NULL,
    [fin] DATE NOT NULL,
    [medecin] NVARCHAR(1000) NOT NULL,
    [lieu] NVARCHAR(1000),
    [medecinId] INT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [certificats_arret_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [certificats_arret_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [certificats_arret_numero_key] UNIQUE NONCLUSTERED ([numero])
);

-- AddForeignKey
ALTER TABLE [dbo].[certificats_arret] ADD CONSTRAINT [certificats_arret_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[certificats_arret] ADD CONSTRAINT [certificats_arret_consultationId_fkey] FOREIGN KEY ([consultationId]) REFERENCES [dbo].[consultations]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[certificats_arret] ADD CONSTRAINT [certificats_arret_passageId_fkey] FOREIGN KEY ([passageId]) REFERENCES [dbo].[passages]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[certificats_arret] ADD CONSTRAINT [certificats_arret_patientId_fkey] FOREIGN KEY ([patientId]) REFERENCES [dbo].[patients]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[certificats_arret] ADD CONSTRAINT [certificats_arret_medecinId_fkey] FOREIGN KEY ([medecinId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
