-- Ordonnances multiples : une consultation peut porter plusieurs ordonnances
-- indépendantes (chacune avec son numéro, son statut pharmacie et ses médicaments).
CREATE TABLE [ordonnances] (
    [id]             INT IDENTITY(1,1) NOT NULL,
    [cliniqueId]     INT NOT NULL,
    [consultationId] INT NOT NULL,
    [numero]         NVARCHAR(100) NOT NULL,
    [statut]         NVARCHAR(1000) NOT NULL CONSTRAINT [ordonnances_statut_df] DEFAULT N'EN_ATTENTE',
    [sauveeLe]       DATETIME2,
    [createdAt]      DATETIME2 NOT NULL CONSTRAINT [ordonnances_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt]      DATETIME2 NOT NULL CONSTRAINT [ordonnances_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ordonnances_pkey] PRIMARY KEY ([id]),
    CONSTRAINT [ordonnances_consultationId_fkey] FOREIGN KEY ([consultationId]) REFERENCES [consultations]([id]) ON DELETE CASCADE
);
CREATE INDEX [ordonnances_consultationId_idx] ON [ordonnances]([consultationId]);
CREATE INDEX [ordonnances_cliniqueId_numero_idx] ON [ordonnances]([cliniqueId], [numero]);

ALTER TABLE [prescriptions] ADD [ordonnanceId] INT NULL;
ALTER TABLE [prescriptions] ADD CONSTRAINT [prescriptions_ordonnanceId_fkey]
    FOREIGN KEY ([ordonnanceId]) REFERENCES [ordonnances]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX [prescriptions_ordonnanceId_idx] ON [prescriptions]([ordonnanceId]);

ALTER TABLE [dispensations] ADD [ordonnanceId] INT NULL;
ALTER TABLE [dispensations] ADD CONSTRAINT [dispensations_ordonnanceId_fkey]
    FOREIGN KEY ([ordonnanceId]) REFERENCES [ordonnances]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX [dispensations_ordonnanceId_idx] ON [dispensations]([ordonnanceId]);

-- Reprise de l'existant : une ordonnance par consultation qui a déjà un numéro
-- ou des médicaments prescrits (même numéro, même statut qu'avant).
EXEC(N'
INSERT INTO [ordonnances] ([cliniqueId], [consultationId], [numero], [statut], [sauveeLe], [createdAt], [updatedAt])
SELECT p.[cliniqueId], c.[id],
       ISNULL(c.[numeroOrdonnance], N''ORD-C'' + CAST(c.[id] AS NVARCHAR(20))),
       c.[ordonnanceStatut], c.[ordonnanceSauveeLe], c.[createdAt], c.[updatedAt]
FROM [consultations] c
JOIN [passages] p ON p.[id] = c.[passageId]
WHERE c.[numeroOrdonnance] IS NOT NULL
   OR EXISTS (SELECT 1 FROM [prescriptions] pr WHERE pr.[consultationId] = c.[id]);

UPDATE pr SET pr.[ordonnanceId] = o.[id]
FROM [prescriptions] pr JOIN [ordonnances] o ON o.[consultationId] = pr.[consultationId];

UPDATE d SET d.[ordonnanceId] = o.[id]
FROM [dispensations] d JOIN [ordonnances] o ON o.[consultationId] = d.[consultationId];
');
