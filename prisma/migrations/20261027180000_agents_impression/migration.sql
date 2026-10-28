BEGIN TRY

BEGIN TRAN;

-- Agents d'impression : postes gérés par chaque PC, réglables depuis le Paramétrage.
CREATE TABLE [dbo].[agents_impression] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nom] NVARCHAR(1000) NOT NULL,
    [postes] NVARCHAR(1000) NOT NULL,
    [dernierContact] DATETIME2 NOT NULL CONSTRAINT [agents_impression_dernierContact_df] DEFAULT CURRENT_TIMESTAMP,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [agents_impression_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [agents_impression_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [agents_impression_nom_key] UNIQUE NONCLUSTERED ([nom])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
