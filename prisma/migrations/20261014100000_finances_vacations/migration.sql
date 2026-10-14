-- Module Finances : pointage de service des agents, tarifs et fiches de vacation.

-- Tarif de chaque agent rémunéré (à la vacation ou à l'heure)
CREATE TABLE [dbo].[remunerations_agents] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [personnelId] INT NOT NULL,
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [remunerations_agents_statut_df] DEFAULT N'VACATAIRE',
    [mode] NVARCHAR(1000) NOT NULL CONSTRAINT [remunerations_agents_mode_df] DEFAULT N'VACATION',
    [tarif] DECIMAL(18,2) NOT NULL CONSTRAINT [remunerations_agents_tarif_df] DEFAULT 0,
    [dureeVacationHeures] INT NOT NULL CONSTRAINT [remunerations_agents_duree_df] DEFAULT 24,
    [actif] BIT NOT NULL CONSTRAINT [remunerations_agents_actif_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [remunerations_agents_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [remunerations_agents_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [remunerations_agents_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [remunerations_agents_personnelId_key] UNIQUE NONCLUSTERED ([personnelId])
);

-- Services pointés (« Prendre / Terminer mon service »)
CREATE TABLE [dbo].[services_agents] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [utilisateurId] INT NOT NULL,
    [personnelId] INT NOT NULL,
    [debut] DATETIME2 NOT NULL,
    [fin] DATETIME2,
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [services_agents_statut_df] DEFAULT N'EN_COURS',
    [fermetureAuto] BIT NOT NULL CONSTRAINT [services_agents_fermetureAuto_df] DEFAULT 0,
    [derniereActivite] DATETIME2,
    [minutesPresence] INT NOT NULL CONSTRAINT [services_agents_minutesPresence_df] DEFAULT 0,
    [heuresRetenues] DECIMAL(10,2),
    [vacationsRetenues] DECIMAL(10,2),
    [motifCorrection] NVARCHAR(1000),
    [valideParId] INT,
    [valideLe] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [services_agents_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [services_agents_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [services_agents_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [services_agents_utilisateurId_fkey] FOREIGN KEY ([utilisateurId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [services_agents_valideParId_fkey] FOREIGN KEY ([valideParId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION
);
CREATE INDEX [services_agents_cliniqueId_statut_idx] ON [dbo].[services_agents]([cliniqueId], [statut]);
CREATE INDEX [services_agents_personnelId_debut_idx] ON [dbo].[services_agents]([personnelId], [debut]);

-- Fiche de vacation mensuelle d'un agent (brouillon → validée → payée)
CREATE TABLE [dbo].[fiches_vacation] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [personnelId] INT NOT NULL,
    [mois] NVARCHAR(7) NOT NULL,
    [nbServices] INT NOT NULL CONSTRAINT [fiches_vacation_nbServices_df] DEFAULT 0,
    [nbAVerifier] INT NOT NULL CONSTRAINT [fiches_vacation_nbAVerifier_df] DEFAULT 0,
    [heures] DECIMAL(10,2) NOT NULL CONSTRAINT [fiches_vacation_heures_df] DEFAULT 0,
    [vacations] DECIMAL(10,2) NOT NULL CONSTRAINT [fiches_vacation_vacations_df] DEFAULT 0,
    [mode] NVARCHAR(1000) NOT NULL,
    [tarif] DECIMAL(18,2) NOT NULL,
    [dureeVacationHeures] INT NOT NULL CONSTRAINT [fiches_vacation_duree_df] DEFAULT 24,
    [montantBase] DECIMAL(18,2) NOT NULL CONSTRAINT [fiches_vacation_montantBase_df] DEFAULT 0,
    [primes] DECIMAL(18,2) NOT NULL CONSTRAINT [fiches_vacation_primes_df] DEFAULT 0,
    [retenues] DECIMAL(18,2) NOT NULL CONSTRAINT [fiches_vacation_retenues_df] DEFAULT 0,
    [montantTotal] DECIMAL(18,2) NOT NULL CONSTRAINT [fiches_vacation_montantTotal_df] DEFAULT 0,
    [commentaire] NVARCHAR(1000),
    [statut] NVARCHAR(1000) NOT NULL CONSTRAINT [fiches_vacation_statut_df] DEFAULT N'BROUILLON',
    [valideParId] INT,
    [valideLe] DATETIME2,
    [payeLe] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [fiches_vacation_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [fiches_vacation_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [fiches_vacation_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [fiches_vacation_personnelId_mois_key] UNIQUE NONCLUSTERED ([personnelId], [mois]),
    CONSTRAINT [fiches_vacation_personnelId_fkey] FOREIGN KEY ([personnelId]) REFERENCES [dbo].[personnel]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [fiches_vacation_valideParId_fkey] FOREIGN KEY ([valideParId]) REFERENCES [dbo].[utilisateurs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION
);
CREATE INDEX [fiches_vacation_cliniqueId_mois_idx] ON [dbo].[fiches_vacation]([cliniqueId], [mois]);
