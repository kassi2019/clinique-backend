BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[parametres] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [loginImage] NVARCHAR(max),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [parametres_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [parametres_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [parametres_cliniqueId_key] UNIQUE NONCLUSTERED ([cliniqueId])
);

-- AddForeignKey
ALTER TABLE [dbo].[parametres] ADD CONSTRAINT [parametres_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
