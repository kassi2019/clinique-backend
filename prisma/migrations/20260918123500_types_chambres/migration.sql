BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[types_chambres] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [libelle] NVARCHAR(1000) NOT NULL,
    [actif] BIT NOT NULL CONSTRAINT [types_chambres_actif_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [types_chambres_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [types_chambres_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [types_chambres_cliniqueId_libelle_key] UNIQUE NONCLUSTERED ([cliniqueId],[libelle])
);

-- AddColumn
ALTER TABLE [dbo].[chambres] ADD [typeChambreId] INT;

-- Migrer les types existants (Simple, Double, Suite…) vers le référentiel
INSERT INTO [dbo].[types_chambres] ([cliniqueId], [libelle], [actif], [createdAt], [updatedAt])
SELECT DISTINCT [cliniqueId], [type], 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM [dbo].[chambres] WHERE [type] IS NOT NULL;

UPDATE c
SET c.[typeChambreId] = t.[id]
FROM [dbo].[chambres] c
INNER JOIN [dbo].[types_chambres] t ON t.[cliniqueId] = c.[cliniqueId] AND t.[libelle] = c.[type];

-- DropColumn
ALTER TABLE [dbo].[chambres] DROP COLUMN [type];

-- AddForeignKey
ALTER TABLE [dbo].[types_chambres] ADD CONSTRAINT [types_chambres_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[chambres] ADD CONSTRAINT [chambres_typeChambreId_fkey] FOREIGN KEY ([typeChambreId]) REFERENCES [dbo].[types_chambres]([id]) ON DELETE SET NULL ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
