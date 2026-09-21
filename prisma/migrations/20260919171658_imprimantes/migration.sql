BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[imprimantes] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [poste] NVARCHAR(1000) NOT NULL,
    [libelle] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL CONSTRAINT [imprimantes_type_df] DEFAULT 'WINDOWS',
    [nom] NVARCHAR(1000),
    [ip] NVARCHAR(1000),
    [port] INT NOT NULL CONSTRAINT [imprimantes_port_df] DEFAULT 9100,
    [largeur] INT NOT NULL CONSTRAINT [imprimantes_largeur_df] DEFAULT 42,
    [autoPrint] BIT NOT NULL CONSTRAINT [imprimantes_autoPrint_df] DEFAULT 1,
    [actif] BIT NOT NULL CONSTRAINT [imprimantes_actif_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [imprimantes_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [imprimantes_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [imprimantes_cliniqueId_poste_key] UNIQUE NONCLUSTERED ([cliniqueId],[poste])
);

-- AddForeignKey
ALTER TABLE [dbo].[imprimantes] ADD CONSTRAINT [imprimantes_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
