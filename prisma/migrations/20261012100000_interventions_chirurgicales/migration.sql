-- Liste paramétrable des types d'intervention chirurgicale
-- (antécédents chirurgicaux de la fiche de consultation).
CREATE TABLE [dbo].[interventions_chirurgicales] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cliniqueId] INT NOT NULL,
    [libelle] NVARCHAR(1000) NOT NULL,
    [actif] BIT NOT NULL CONSTRAINT [interventions_chirurgicales_actif_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [interventions_chirurgicales_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [interventions_chirurgicales_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [interventions_chirurgicales_cliniqueId_libelle_key] UNIQUE NONCLUSTERED ([cliniqueId],[libelle])
);
ALTER TABLE [dbo].[interventions_chirurgicales] ADD CONSTRAINT [interventions_chirurgicales_cliniqueId_fkey]
    FOREIGN KEY ([cliniqueId]) REFERENCES [dbo].[cliniques]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;
