-- Recouvrement : règlements reçus des compagnies d'assurance.
-- Reste à recouvrer = part assurance facturée - règlements reçus.
CREATE TABLE [reglements_assurance] (
    [id]             INT IDENTITY(1,1) NOT NULL,
    [cliniqueId]     INT NOT NULL,
    [assuranceId]    INT NOT NULL,
    [dateReglement]  DATE NOT NULL,
    [montant]        DECIMAL(18,2) NOT NULL,
    [modeReglement]  NVARCHAR(1000),
    [reference]      NVARCHAR(1000),
    [commentaire]    NVARCHAR(1000),
    [utilisateurId]  INT,
    [createdAt]      DATETIME2 NOT NULL CONSTRAINT [reglements_assurance_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [reglements_assurance_pkey] PRIMARY KEY ([id]),
    CONSTRAINT [reglements_assurance_assuranceId_fkey] FOREIGN KEY ([assuranceId]) REFERENCES [assurances]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION
);
CREATE INDEX [reglements_assurance_cliniqueId_assuranceId_idx] ON [reglements_assurance]([cliniqueId], [assuranceId]);
