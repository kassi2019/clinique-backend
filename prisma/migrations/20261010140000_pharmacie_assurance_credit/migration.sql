-- Pharmacie : prise en charge assurance, paiement à crédit et cas social.
-- Taux de couverture des médicaments, par formule d'assurance (0-100 %).
ALTER TABLE [assurance_formules] ADD [tauxPharmacie] INT NULL;

-- Détail du règlement d'une dispensation.
ALTER TABLE [pharmacie_paiements] ADD [type] NVARCHAR(1000) NOT NULL CONSTRAINT [pharmacie_paiements_type_df] DEFAULT N'COMPTANT';
ALTER TABLE [pharmacie_paiements] ADD [montantAssurance] DECIMAL(18,2) NOT NULL CONSTRAINT [pharmacie_paiements_montantAssurance_df] DEFAULT 0;
ALTER TABLE [pharmacie_paiements] ADD [montantPatient] DECIMAL(18,2) NULL;
ALTER TABLE [pharmacie_paiements] ADD [montantEncaisse] DECIMAL(18,2) NULL;
ALTER TABLE [pharmacie_paiements] ADD [assuranceId] INT NULL;
ALTER TABLE [pharmacie_paiements] ADD [formuleId] INT NULL;
ALTER TABLE [pharmacie_paiements] ADD [tauxAssurance] INT NULL;
ALTER TABLE [pharmacie_paiements] ADD [motif] NVARCHAR(1000) NULL;
ALTER TABLE [pharmacie_paiements] ADD [regleLe] DATETIME2 NULL;
ALTER TABLE [pharmacie_paiements] ADD CONSTRAINT [pharmacie_paiements_assuranceId_fkey]
    FOREIGN KEY ([assuranceId]) REFERENCES [assurances]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE [pharmacie_paiements] ADD CONSTRAINT [pharmacie_paiements_formuleId_fkey]
    FOREIGN KEY ([formuleId]) REFERENCES [assurance_formules]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Reprise de l'existant : tout a été payé comptant, sans assurance.
EXEC(N'UPDATE [pharmacie_paiements]
SET [montantPatient] = [montantTotal], [montantEncaisse] = [montantTotal], [regleLe] = [createdAt]');
