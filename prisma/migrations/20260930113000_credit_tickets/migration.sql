-- Ticket de crédit / cas social : prestations prises en charge sans paiement
-- immédiat (crédit remboursable ou cas social non remboursable).
CREATE TABLE [credit_tickets] (
    [id]            INT IDENTITY(1,1) NOT NULL,
    [cliniqueId]    INT NOT NULL,
    [passageId]     INT NOT NULL,
    [numero]        NVARCHAR(100) NOT NULL,
    [type]          NVARCHAR(1000) NOT NULL,
    [motif]         NVARCHAR(1000),
    [montantTotal]  DECIMAL(18,2) NOT NULL,
    [statut]        NVARCHAR(1000) NOT NULL CONSTRAINT [credit_tickets_statut_df] DEFAULT N'EN_COURS',
    [agentId]       INT,
    [createdAt]     DATETIME2 NOT NULL CONSTRAINT [credit_tickets_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt]     DATETIME2 NOT NULL CONSTRAINT [credit_tickets_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [credit_tickets_pkey] PRIMARY KEY ([id]),
    CONSTRAINT [credit_tickets_numero_key] UNIQUE ([numero]),
    CONSTRAINT [credit_tickets_cliniqueId_fkey] FOREIGN KEY ([cliniqueId]) REFERENCES [cliniques]([id]),
    CONSTRAINT [credit_tickets_passageId_fkey] FOREIGN KEY ([passageId]) REFERENCES [passages]([id]),
    CONSTRAINT [credit_tickets_agentId_fkey] FOREIGN KEY ([agentId]) REFERENCES [utilisateurs]([id])
);

-- Ligne de prestation rattachée au ticket (statut CREDIT ou CAS_SOCIAL)
ALTER TABLE [passages_prestations] ADD [creditId] INT NULL;
ALTER TABLE [passages_prestations] ADD CONSTRAINT [passages_prestations_creditId_fkey]
    FOREIGN KEY ([creditId]) REFERENCES [credit_tickets]([id]);

CREATE INDEX [credit_tickets_cliniqueId_idx] ON [credit_tickets]([cliniqueId]);
CREATE INDEX [passages_prestations_creditId_idx] ON [passages_prestations]([creditId]);
