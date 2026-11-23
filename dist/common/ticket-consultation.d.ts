import { PrismaService } from '../prisma/prisma.service';
export declare const JOURS_TICKET_VALABLE = 10;
export interface TicketValable {
    passageId: number;
    numeroOrdre: string;
    service: string | null;
    libelle: string;
    montant: number;
    payeLe: Date;
    valableJusquau: Date;
    joursRestants: number;
}
export declare function ticketConsultationValable(prisma: PrismaService, cliniqueId: number, patientId: number, exclurePassageId?: number): Promise<TicketValable | null>;
