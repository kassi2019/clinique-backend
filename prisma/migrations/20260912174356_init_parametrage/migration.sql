BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[cliniques] (
    [id] INT NOT NULL IDENTITY(1,1),
    [code] NVARCHAR(1000) NOT NULL,
    [nom] NVARCHAR(1000) NOT NULL,
    [adresse] NVARCHAR(1000),
    [telephone] NVARCHAR(1000),
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [cliniques_statut_df] DEFAULT 'ACTIF',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [cliniques_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [cliniques_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [cliniques_code_key] UNIQUE NONCLUSTERED ([code])
);

-- CreateTable
CREATE TABLE [dbo].[services] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [code] NVARCHAR(1000) NOT NULL,
    [nom] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [actif] BIT NOT NULL CONSTRAINT [services_actif_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [services_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [services_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [services_cliniqueId_code_key] UNIQUE NONCLUSTERED ([cliniqueId],[code])
);

-- CreateTable
CREATE TABLE [dbo].[personnel] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [matricule] NVARCHAR(1000) NOT NULL,
    [nom] NVARCHAR(1000) NOT NULL,
    [prenom] NVARCHAR(1000) NOT NULL,
    [sexe] NVARCHAR(1000),
    [fonction] NVARCHAR(1000) NOT NULL,
    [serviceId] INT,
    [telephone] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [personnel_statut_df] DEFAULT 'ACTIF',
    [dateEmbauche] DATE,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [personnel_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [personnel_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [personnel_cliniqueId_matricule_key] UNIQUE NONCLUSTERED ([cliniqueId],[matricule])
);

-- CreateTable
CREATE TABLE [dbo].[utilisateurs] (
    [id] INT NOT NULL IDENTITY(1,1),
    [personnelId] INT NOT NULL,
    [matricule] NVARCHAR(1000) NOT NULL,
    [motDePasse] NVARCHAR(1000) NOT NULL,
    [roleId] INT NOT NULL,
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [utilisateurs_statut_df] DEFAULT 'ACTIF',
    [derniereConnexion] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [utilisateurs_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [utilisateurs_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [utilisateurs_personnelId_key] UNIQUE NONCLUSTERED ([personnelId]),
    CONSTRAINT [utilisateurs_matricule_key] UNIQUE NONCLUSTERED ([matricule])
);

-- CreateTable
CREATE TABLE [dbo].[roles] (
    [id] INT NOT NULL IDENTITY(1,1),
    [code] NVARCHAR(1000) NOT NULL,
    [nom] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [roles_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [roles_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [roles_code_key] UNIQUE NONCLUSTERED ([code])
);

-- CreateTable
CREATE TABLE [dbo].[modules] (
    [id] INT NOT NULL IDENTITY(1,1),
    [code] NVARCHAR(1000) NOT NULL,
    [nom] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    CONSTRAINT [modules_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [modules_code_key] UNIQUE NONCLUSTERED ([code])
);

-- CreateTable
CREATE TABLE [dbo].[roles_modules] (
    [roleId] INT NOT NULL,
    [moduleId] INT NOT NULL,
    [lecture] BIT NOT NULL CONSTRAINT [roles_modules_lecture_df] DEFAULT 1,
    [ecriture] BIT NOT NULL CONSTRAINT [roles_modules_ecriture_df] DEFAULT 1,
    [validation] BIT NOT NULL CONSTRAINT [roles_modules_validation_df] DEFAULT 0,
    CONSTRAINT [roles_modules_pkey] PRIMARY KEY CLUSTERED ([roleId],[moduleId])
);

-- CreateTable
CREATE TABLE [dbo].[prestations] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [serviceId] INT NOT NULL,
    [code] NVARCHAR(1000) NOT NULL,
    [libelle] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [montant] DECIMAL(18,2) NOT NULL,
    [actif] BIT NOT NULL CONSTRAINT [prestations_actif_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [prestations_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [prestations_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [prestations_cliniqueId_code_key] UNIQUE NONCLUSTERED ([cliniqueId],[code])
);

-- AddForeignKey
ALTER TABLE [dbo].[services] ADD CONSTRAINT [services_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[personnel] ADD CONSTRAINT [personnel_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[personnel] ADD CONSTRAINT [personnel_serviceId_fkey] FOREIGN KEY ([serviceId]) REFERENCES [dbo].[services]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[utilisateurs] ADD CONSTRAINT [utilisateurs_personnelId_fkey] FOREIGN KEY ([personnelId]) REFERENCES [dbo].[personnel]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[utilisateurs] ADD CONSTRAINT [utilisateurs_roleId_fkey] FOREIGN KEY ([roleId]) REFERENCES [dbo].[roles]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[roles_modules] ADD CONSTRAINT [roles_modules_roleId_fkey] FOREIGN KEY ([roleId]) REFERENCES [dbo].[roles]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[roles_modules] ADD CONSTRAINT [roles_modules_moduleId_fkey] FOREIGN KEY ([moduleId]) REFERENCES [dbo].[modules]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[prestations] ADD CONSTRAINT [prestations_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[prestations] ADD CONSTRAINT [prestations_serviceId_fkey] FOREIGN KEY ([serviceId]) REFERENCES [dbo].[services]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
