-- Tests de la fiche de consultation : taux d'hémoglobine, syphilis, hépatite.
-- Cochés, ils s'inscrivent automatiquement sur l'ordonnance (comme TDR et CDIP).
ALTER TABLE [consultations] ADD [tauxHemoglobine] NVARCHAR(1000) NULL,
  [testSyphilis] NVARCHAR(1000) NULL,
  [testHepatite] NVARCHAR(1000) NULL;
