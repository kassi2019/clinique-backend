-- Le code unique devient PERMANENT et attaché au PATIENT
-- (clé de recherche à vie). Le N° d'ordre reste propre au passage et expire (10 jours).

-- 1. Ajouter la colonne code sur les patients (nullable d'abord)
ALTER TABLE [patients] ADD [code] NVARCHAR(1000) NULL;

-- 2. Reprise : le code du premier passage de chaque patient devient son code permanent.
-- EXEC dynamique : dans un batch unique, SQL Server compile le DML contre le schéma
-- d'AVANT le batch — la colonne ajoutée ci-dessus serait invisible.
EXEC(N'UPDATE p SET p.[code] = sub.[code] FROM [patients] p JOIN (SELECT patientId, MIN(id) AS id FROM [passages] GROUP BY patientId) prem ON prem.patientId = p.id JOIN [passages] sub ON sub.id = prem.id');

-- 3. Contrainte unique sur patients.code
CREATE UNIQUE NONCLUSTERED INDEX [patients_code_key] ON [patients]([code]);

-- 4. Supprimer la contrainte unique et la colonne code des passages
ALTER TABLE [passages] DROP CONSTRAINT [passages_code_key];
ALTER TABLE [passages] DROP COLUMN [code];

-- 5. Le code patient est obligatoire (conforme au schéma : String @unique)
DROP INDEX [patients_code_key] ON [patients];
ALTER TABLE [patients] ALTER COLUMN [code] NVARCHAR(1000) NOT NULL;
CREATE UNIQUE NONCLUSTERED INDEX [patients_code_key] ON [patients]([code]);
