BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[quartiers] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [libelle] NVARCHAR(1000) NOT NULL,
    [actif] BIT NOT NULL CONSTRAINT [quartiers_actif_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [quartiers_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [quartiers_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [quartiers_cliniqueId_libelle_key] UNIQUE NONCLUSTERED ([cliniqueId],[libelle])
);

-- AddForeignKey
ALTER TABLE [dbo].[quartiers] ADD CONSTRAINT [quartiers_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
