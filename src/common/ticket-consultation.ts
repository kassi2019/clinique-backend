import { PrismaService } from '../prisma/prisma.service';

/** Durée de validité du ticket de consultation : le patient qui revient dans ce délai ne repaie pas. */
export const JOURS_TICKET_VALABLE = 10;

export interface TicketValable {
  passageId: number;
  numeroOrdre: string;
  service: string | null;
  libelle: string;
  montant: number;
  /** Date de la consultation payée (début de validité). */
  payeLe: Date;
  /** Dernier jour où le ticket est valable. */
  valableJusquau: Date;
  joursRestants: number;
}

/**
 * Ticket de consultation encore valable pour ce patient : dernière consultation
 * RÉELLEMENT réglée (payée, crédit ou cas social — jamais une consultation
 * gratuite de contrôle) il y a moins de 10 jours, QUEL QUE SOIT le service.
 * Les 10 jours partent de cette consultation payée : un retour gratuit ne
 * prolonge pas la validité.
 */
export async function ticketConsultationValable(
  prisma: PrismaService,
  cliniqueId: number,
  patientId: number,
  exclurePassageId?: number,
): Promise<TicketValable | null> {
  const depuis = new Date(Date.now() - JOURS_TICKET_VALABLE * 24 * 3600 * 1000);
  const ligne = await prisma.passagePrestation.findFirst({
    where: {
      gratuit: false,
      statut: { in: ['PAYEE', 'CREDIT', 'CAS_SOCIAL'] },
      prestation: { type: 'CONSULTATION' },
      passage: {
        cliniqueId,
        patientId,
        createdAt: { gte: depuis },
        ...(exclurePassageId ? { id: { not: exclurePassageId } } : {}),
      },
    },
    orderBy: { passage: { createdAt: 'desc' } },
    select: {
      libelle: true,
      montant: true,
      passage: {
        select: {
          id: true,
          numeroOrdre: true,
          createdAt: true,
          service: { select: { nom: true } },
        },
      },
    },
  });
  if (!ligne) return null;

  const payeLe = ligne.passage.createdAt;
  const valableJusquau = new Date(
    payeLe.getTime() + JOURS_TICKET_VALABLE * 24 * 3600 * 1000,
  );
  const joursRestants = Math.max(
    0,
    Math.ceil((valableJusquau.getTime() - Date.now()) / (24 * 3600 * 1000)),
  );
  return {
    passageId: ligne.passage.id,
    numeroOrdre: ligne.passage.numeroOrdre,
    service: ligne.passage.service?.nom ?? null,
    libelle: ligne.libelle,
    montant: Number(ligne.montant),
    payeLe,
    valableJusquau,
    joursRestants,
  };
}
