BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[accouchements] ADD [accouchementMultiple] BIT,
[declarationNaissanceComplete] BIT,
[declarationNaissanceRenseignee] BIT,
[evacueeApres] BIT,
[evacueeAvant] BIT,
[mortNeType] NVARCHAR(1000),
[nouveauNeEvacue] BIT,
[nouveauNeProtegeTetanos] BIT,
[vatStatut] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[visites_cpn] ADD [agHbsPositif] BIT,
[anemie] BIT,
[counselingPfppi] BIT,
[deparasitee] BIT,
[ferFolate] BIT,
[malnutrition] BIT,
[mildaRemise] BIT,
[risqueDepiste] BIT,
[spDose] INT,
[syphilisPositif] BIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
