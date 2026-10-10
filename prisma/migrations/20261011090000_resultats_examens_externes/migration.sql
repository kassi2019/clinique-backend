-- Résultat scanné d'un examen réalisé HORS clinique, joint par le médecin
-- à la ligne d'examen prescrite (un document par examen).
CREATE TABLE [resultats_examens_externes] (
    [id]                  INT IDENTITY(1,1) NOT NULL,
    [passagePrestationId] INT NOT NULL,
    [nomFichier]          NVARCHAR(1000) NOT NULL,
    [typeMime]            NVARCHAR(1000) NOT NULL,
    [contenu]             NVARCHAR(MAX) NOT NULL,
    [tailleOctets]        INT NOT NULL CONSTRAINT [resultats_examens_externes_tailleOctets_df] DEFAULT 0,
    [dateExamen]          DATE,
    [lieu]                NVARCHAR(1000),
    [conclusion]          NVARCHAR(MAX),
    [utilisateurId]       INT,
    [createdAt]           DATETIME2 NOT NULL CONSTRAINT [resultats_examens_externes_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt]           DATETIME2 NOT NULL CONSTRAINT [resultats_examens_externes_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [resultats_examens_externes_pkey] PRIMARY KEY ([id]),
    CONSTRAINT [resultats_examens_externes_passagePrestationId_key] UNIQUE ([passagePrestationId]),
    CONSTRAINT [resultats_examens_externes_passagePrestationId_fkey] FOREIGN KEY ([passagePrestationId])
        REFERENCES [passages_prestations]([id]) ON DELETE CASCADE ON UPDATE CASCADE
);
