-- Traçabilité des actions : identifiant de l'utilisateur sur les entités
-- cliniques + journal global des écritures (paramétrage compris).

-- Journal d'actions (chaque POST/PATCH/DELETE de l'API y est enregistré)
CREATE TABLE [journal_actions] (
    [id]            INT IDENTITY(1,1) NOT NULL,
    [cliniqueId]    INT,
    [utilisateurId] INT,
    [methode]       NVARCHAR(10) NOT NULL,
    [route]         NVARCHAR(300) NOT NULL,
    [entite]        NVARCHAR(100),
    [entiteId]      NVARCHAR(50),
    [details]       NVARCHAR(max),
    [createdAt]     DATETIME2 NOT NULL CONSTRAINT [journal_actions_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [journal_actions_pkey] PRIMARY KEY ([id]),
    CONSTRAINT [journal_actions_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [cliniques]([id]),
    CONSTRAINT [journal_actions_utilisateurId_fkey] FOREIGN KEY ([utilisateurId]) REFERENCES [utilisateurs]([id])
);
CREATE INDEX [journal_actions_utilisateurId_idx] ON [journal_actions]([utilisateurId]);
CREATE INDEX [journal_actions_createdAt_idx] ON [journal_actions]([createdAt]);

-- Patient : agent ayant créé le dossier
ALTER TABLE [patients] ADD [creeParId] INT NULL;
ALTER TABLE [patients] ADD CONSTRAINT [patients_creeParId_fkey] FOREIGN KEY ([creeParId]) REFERENCES [utilisateurs]([id]);

-- Passage : dernier agent d'accueil (création / constantes)
ALTER TABLE [passages] ADD [agentId] INT NULL;
ALTER TABLE [passages] ADD CONSTRAINT [passages_agentId_fkey] FOREIGN KEY ([agentId]) REFERENCES [utilisateurs]([id]);

-- Ligne de prestation : utilisateur ayant ajouté la ligne
ALTER TABLE [passages_prestations] ADD [agentId] INT NULL;
ALTER TABLE [passages_prestations] ADD CONSTRAINT [passages_prestations_agentId_fkey] FOREIGN KEY ([agentId]) REFERENCES [utilisateurs]([id]);

-- Hospitalisation : agent ayant admis (la sortie était déjà tracée via sortieParId)
ALTER TABLE [hospitalisations] ADD [agentId] INT NULL;
ALTER TABLE [hospitalisations] ADD CONSTRAINT [hospitalisations_agentId_fkey] FOREIGN KEY ([agentId]) REFERENCES [utilisateurs]([id]);

-- Compte rendu d'imagerie : utilisateur ayant saisi (la validation était déjà tracée)
ALTER TABLE [examens_imagerie] ADD [saisiParId] INT NULL;
ALTER TABLE [examens_imagerie] ADD CONSTRAINT [examens_imagerie_saisiParId_fkey] FOREIGN KEY ([saisiParId]) REFERENCES [utilisateurs]([id]);
