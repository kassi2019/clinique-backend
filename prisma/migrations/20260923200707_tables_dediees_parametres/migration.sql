BEGIN TRY

BEGIN TRAN;

-- ============================================================
--  Tables dédiées par type de paramètre (remplace liste_parametres)
-- ============================================================

CREATE TABLE [dbo].[nationalites] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [libelle] NVARCHAR(1000) NOT NULL,
    [actif] BIT NOT NULL CONSTRAINT [nationalites_actif_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [nationalites_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [nationalites_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [nationalites_cliniqueId_libelle_key] UNIQUE NONCLUSTERED ([cliniqueId],[libelle])
);

ALTER TABLE [dbo].[nationalites] ADD CONSTRAINT [nationalites_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey

CREATE TABLE [dbo].[residences] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [libelle] NVARCHAR(1000) NOT NULL,
    [actif] BIT NOT NULL CONSTRAINT [residences_actif_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [residences_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [residences_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [residences_cliniqueId_libelle_key] UNIQUE NONCLUSTERED ([cliniqueId],[libelle])
);

ALTER TABLE [dbo].[residences] ADD CONSTRAINT [residences_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey

CREATE TABLE [dbo].[diagnostics] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [libelle] NVARCHAR(1000) NOT NULL,
    [actif] BIT NOT NULL CONSTRAINT [diagnostics_actif_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [diagnostics_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [diagnostics_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [diagnostics_cliniqueId_libelle_key] UNIQUE NONCLUSTERED ([cliniqueId],[libelle])
);

ALTER TABLE [dbo].[diagnostics] ADD CONSTRAINT [diagnostics_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey

CREATE TABLE [dbo].[pathologies] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [libelle] NVARCHAR(1000) NOT NULL,
    [actif] BIT NOT NULL CONSTRAINT [pathologies_actif_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [pathologies_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [pathologies_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [pathologies_cliniqueId_libelle_key] UNIQUE NONCLUSTERED ([cliniqueId],[libelle])
);

ALTER TABLE [dbo].[pathologies] ADD CONSTRAINT [pathologies_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey

CREATE TABLE [dbo].[fournisseurs] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [libelle] NVARCHAR(1000) NOT NULL,
    [actif] BIT NOT NULL CONSTRAINT [fournisseurs_actif_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [fournisseurs_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [fournisseurs_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [fournisseurs_cliniqueId_libelle_key] UNIQUE NONCLUSTERED ([cliniqueId],[libelle])
);

ALTER TABLE [dbo].[fournisseurs] ADD CONSTRAINT [fournisseurs_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey

CREATE TABLE [dbo].[fonctions] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [libelle] NVARCHAR(1000) NOT NULL,
    [actif] BIT NOT NULL CONSTRAINT [fonctions_actif_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [fonctions_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [fonctions_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [fonctions_cliniqueId_libelle_key] UNIQUE NONCLUSTERED ([cliniqueId],[libelle])
);

ALTER TABLE [dbo].[fonctions] ADD CONSTRAINT [fonctions_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey

CREATE TABLE [dbo].[posologies] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [libelle] NVARCHAR(1000) NOT NULL,
    [actif] BIT NOT NULL CONSTRAINT [posologies_actif_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [posologies_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [posologies_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [posologies_cliniqueId_libelle_key] UNIQUE NONCLUSTERED ([cliniqueId],[libelle])
);

ALTER TABLE [dbo].[posologies] ADD CONSTRAINT [posologies_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey

-- Copie des données existantes vers les tables dédiées
INSERT INTO [dbo].[nationalites] ([cliniqueId], [libelle], [actif], [createdAt], [updatedAt])
SELECT [cliniqueId], [libelle], [actif], [createdAt], [updatedAt] FROM [dbo].[liste_parametres] WHERE [code] = 'NATIONALITE';

INSERT INTO [dbo].[residences] ([cliniqueId], [libelle], [actif], [createdAt], [updatedAt])
SELECT [cliniqueId], [libelle], [actif], [createdAt], [updatedAt] FROM [dbo].[liste_parametres] WHERE [code] = 'RESIDENCE';

INSERT INTO [dbo].[diagnostics] ([cliniqueId], [libelle], [actif], [createdAt], [updatedAt])
SELECT [cliniqueId], [libelle], [actif], [createdAt], [updatedAt] FROM [dbo].[liste_parametres] WHERE [code] = 'DIAGNOSTIC';

INSERT INTO [dbo].[pathologies] ([cliniqueId], [libelle], [actif], [createdAt], [updatedAt])
SELECT [cliniqueId], [libelle], [actif], [createdAt], [updatedAt] FROM [dbo].[liste_parametres] WHERE [code] = 'PATHOLOGIE';

INSERT INTO [dbo].[fournisseurs] ([cliniqueId], [libelle], [actif], [createdAt], [updatedAt])
SELECT [cliniqueId], [libelle], [actif], [createdAt], [updatedAt] FROM [dbo].[liste_parametres] WHERE [code] = 'FOURNISSEUR';

INSERT INTO [dbo].[fonctions] ([cliniqueId], [libelle], [actif], [createdAt], [updatedAt])
SELECT [cliniqueId], [libelle], [actif], [createdAt], [updatedAt] FROM [dbo].[liste_parametres] WHERE [code] = 'FONCTION';

INSERT INTO [dbo].[posologies] ([cliniqueId], [libelle], [actif], [createdAt], [updatedAt])
SELECT [cliniqueId], [libelle], [actif], [createdAt], [updatedAt] FROM [dbo].[liste_parametres] WHERE [code] = 'POSOLOGIE';

-- L'ancienne table générique n'est plus utilisée
DROP TABLE [dbo].[liste_parametres];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
