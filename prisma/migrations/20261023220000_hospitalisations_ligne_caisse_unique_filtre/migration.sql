-- SQL Server n'accepte qu'un seul NULL dans une contrainte UNIQUE : le premier séjour sans
-- ligne de caisse (passagePrestationId NULL) bloquait toutes les admissions suivantes (erreur 500).
-- On remplace la contrainte par un index unique filtré, qui ignore les NULL.
ALTER TABLE [dbo].[hospitalisations] DROP CONSTRAINT [hospitalisations_passagePrestationId_key];

CREATE UNIQUE NONCLUSTERED INDEX [hospitalisations_passagePrestationId_key]
    ON [dbo].[hospitalisations]([passagePrestationId])
    WHERE [passagePrestationId] IS NOT NULL;
