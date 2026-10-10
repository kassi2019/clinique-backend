"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.critereNomPrenoms = critereNomPrenoms;
function critereNomPrenoms(saisie) {
    const mots = saisie.trim().split(/\s+/).filter(Boolean);
    return {
        AND: mots.map((m) => ({
            OR: [{ nom: { contains: m } }, { prenom: { contains: m } }],
        })),
    };
}
//# sourceMappingURL=recherche-patient.js.map