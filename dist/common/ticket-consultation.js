"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JOURS_TICKET_VALABLE = void 0;
exports.ticketConsultationValable = ticketConsultationValable;
exports.JOURS_TICKET_VALABLE = 10;
async function ticketConsultationValable(prisma, cliniqueId, patientId, exclurePassageId) {
    const depuis = new Date(Date.now() - exports.JOURS_TICKET_VALABLE * 24 * 3600 * 1000);
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
    if (!ligne)
        return null;
    const payeLe = ligne.passage.createdAt;
    const valableJusquau = new Date(payeLe.getTime() + exports.JOURS_TICKET_VALABLE * 24 * 3600 * 1000);
    const joursRestants = Math.max(0, Math.ceil((valableJusquau.getTime() - Date.now()) / (24 * 3600 * 1000)));
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
//# sourceMappingURL=ticket-consultation.js.map