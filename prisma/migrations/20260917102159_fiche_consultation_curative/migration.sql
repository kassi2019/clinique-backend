BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[consultations] ADD [alcool] BIT,
[antecedentsChirurgicaux] NVARCHAR(1000),
[antecedentsMedicaux] NVARCHAR(1000),
[autresExamens] NVARCHAR(1000),
[casPresumeTB] NVARCHAR(1000),
[cdipPropose] BIT,
[cdipRealise] BIT,
[codeDepistage] NVARCHAR(1000),
[conduiteTenir] NVARCHAR(1000),
[consultantType] NVARCHAR(1000),
[ddr] NVARCHAR(1000),
[diabete] BIT,
[frequenceRespiratoire] NVARCHAR(1000),
[glycemieAjeun] NVARCHAR(1000),
[glycemieNonAjeun] NVARCHAR(1000),
[goutteEpaisse] NVARCHAR(1000),
[grossesseEnCours] BIT,
[hta] BIT,
[imc] NVARCHAR(1000),
[issueSortie] NVARCHAR(1000),
[mildaEligible] NVARCHAR(1000),
[mildaRemise] NVARCHAR(1000),
[moDebut] DATETIME2,
[moDureeHeures] INT,
[moDureeMinutes] INT,
[moFin] DATETIME2,
[modeEntree] NVARCHAR(1000),
[modeEntreeAutre] NVARCHAR(1000),
[pathologiesAssociees] NVARCHAR(1000),
[perimetreBrachial] NVARCHAR(1000),
[perimetreCranien] NVARCHAR(1000),
[rechercheTB] NVARCHAR(1000),
[tabac] BIT,
[tdrPaludisme] NVARCHAR(1000),
[traitementAnterieur] NVARCHAR(1000),
[typeSuivi] NVARCHAR(1000),
[zscore] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[patients] ADD [nationalite] NVARCHAR(1000),
[populationsRisque] NVARCHAR(1000),
[protectionSociale] NVARCHAR(1000),
[residenceActuelle] NVARCHAR(1000),
[residenceHabituelle] NVARCHAR(1000),
[scolarisation] NVARCHAR(1000),
[statutConjugal] NVARCHAR(1000),
[typePopulation] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
