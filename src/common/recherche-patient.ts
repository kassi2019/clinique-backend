import { Prisma } from '@prisma/client';

/**
 * Critère « nom et/ou prénoms » d'un patient.
 * Chaque mot saisi doit se retrouver dans le nom OU dans les prénoms :
 * « KOUASSI », « JEAN », « KOUASSI JEAN » ou « JEAN KOUASSI » trouvent
 * tous le patient KOUASSI Jean Marc.
 */
export function critereNomPrenoms(saisie: string): Prisma.PatientWhereInput {
  const mots = saisie.trim().split(/\s+/).filter(Boolean);
  return {
    AND: mots.map((m) => ({
      OR: [{ nom: { contains: m } }, { prenom: { contains: m } }],
    })),
  };
}
