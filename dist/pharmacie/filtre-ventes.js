"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utilisateurFiltre = void 0;
exports.bornesVentes = bornesVentes;
exports.vendeursPharmacie = vendeursPharmacie;
const filtre_periode_1 = require("../common/filtre-periode");
Object.defineProperty(exports, "utilisateurFiltre", { enumerable: true, get: function () { return filtre_periode_1.utilisateurFiltre; } });
const DATE = filtre_periode_1.DATE_RE;
const HEURE = filtre_periode_1.HEURE_RE;
function bornesVentes(f) {
    const d = f.debut && DATE.test(f.debut) ? f.debut : (0, filtre_periode_1.jourLocal)();
    const fi = f.fin && DATE.test(f.fin) ? f.fin : d;
    const hd = f.heureDebut && HEURE.test(f.heureDebut) ? f.heureDebut : null;
    const hf = f.heureFin && HEURE.test(f.heureFin) ? f.heureFin : null;
    const debut = new Date(`${d}T${hd ?? '00:00'}:00`);
    const fin = hf ? new Date(`${fi}T${hf}:59.999`) : new Date(`${fi}T23:59:59.999`);
    const jj = (s) => s.split('-').reverse().join('/');
    const libelleDates = d === fi ? jj(d) : `${jj(d)} au ${jj(fi)}`;
    const libelleHeures = hd || hf ? ` (${hd ?? '00:00'} → ${hf ?? '23:59'})` : '';
    return { debut, fin, libelle: `${libelleDates}${libelleHeures}` };
}
async function vendeursPharmacie(prisma, cliniqueId) {
    const utilisateurs = await prisma.utilisateur.findMany({
        where: {
            paiementsPharma: {
                some: {
                    dispensation: {
                        OR: [
                            { consultation: { passage: { cliniqueId } } },
                            { ordonnanceExterne: { cliniqueId } },
                        ],
                    },
                },
            },
        },
        select: { id: true, matricule: true, personnel: { select: { nom: true, prenom: true } } },
    });
    return utilisateurs
        .map((u) => ({
        id: u.id,
        nom: `${u.personnel.nom} ${u.personnel.prenom}`.trim() || u.matricule,
    }))
        .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
}
//# sourceMappingURL=filtre-ventes.js.map