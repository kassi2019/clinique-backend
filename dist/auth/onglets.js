"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleDeLOnglet = exports.CODES_ONGLETS = exports.ONGLETS = void 0;
exports.ongletAutorise = ongletAutorise;
exports.ONGLETS = [
    { module: 'ACCUEIL', code: 'ACCUEIL.FORMULAIRE', nom: 'Nouveau passage' },
    { module: 'ACCUEIL', code: 'ACCUEIL.ATTENTE', nom: 'En attente de constante' },
    { module: 'ACCUEIL', code: 'ACCUEIL.TERMINEE', nom: 'Constante terminée' },
    { module: 'ACCUEIL', code: 'ACCUEIL.HISTORIQUE', nom: 'Historique' },
    { module: 'CAISSE', code: 'CAISSE.ATTENTE', nom: 'En attente de paiement' },
    { module: 'CAISSE', code: 'CAISSE.PAYES', nom: 'Payés du jour' },
    { module: 'CAISSE', code: 'CAISSE.CREDITS', nom: 'Crédits / Cas sociaux' },
    { module: 'CAISSE', code: 'CAISSE.RECHERCHE', nom: 'Recherche par code' },
    { module: 'CONSULTATION', code: 'CONSULTATION.FICHE', nom: 'Fiche de consultation' },
    { module: 'CONSULTATION', code: 'CONSULTATION.MEDICAMENTS', nom: 'Prescription de médicaments' },
    { module: 'CONSULTATION', code: 'CONSULTATION.SOINS', nom: 'Soins' },
    { module: 'CONSULTATION', code: 'CONSULTATION.EXAMENS', nom: 'Examens (labo / imagerie)' },
    { module: 'CONSULTATION', code: 'CONSULTATION.CERTIFICAT', nom: "Certificat d'arrêt" },
    { module: 'CONSULTATION', code: 'CONSULTATION.HISTORIQUE', nom: 'Historique' },
    { module: 'CONSULTATION', code: 'CONSULTATION.REFERENCE', nom: 'Référence' },
    { module: 'PHARMACIE', code: 'PHARMACIE.ORDONNANCES', nom: 'Ordonnances' },
    { module: 'PHARMACIE', code: 'PHARMACIE.STOCKS', nom: 'Stocks' },
    { module: 'PHARMACIE', code: 'PHARMACIE.CREDITS', nom: 'Crédits & cas sociaux' },
    { module: 'PHARMACIE', code: 'PHARMACIE.FINANCIER', nom: 'Points financiers' },
    { module: 'PHARMACIE', code: 'PHARMACIE.EXTERNES', nom: 'Ordonnances externes' },
    { module: 'LABORATOIRE', code: 'LABORATOIRE.FILE', nom: "File d'attente" },
    { module: 'LABORATOIRE', code: 'LABORATOIRE.EXAMENS', nom: 'Recherche' },
    { module: 'LABORATOIRE', code: 'LABORATOIRE.HISTORIQUE', nom: 'Historique' },
    { module: 'IMAGERIE', code: 'IMAGERIE.FILE', nom: "File d'attente" },
    { module: 'IMAGERIE', code: 'IMAGERIE.EXAMENS', nom: 'Recherche' },
    { module: 'IMAGERIE', code: 'IMAGERIE.HISTORIQUE', nom: 'Historique' },
    { module: 'HOSPITALISATION', code: 'HOSPITALISATION.ADMISSIONS', nom: 'Admissions' },
    { module: 'HOSPITALISATION', code: 'HOSPITALISATION.OCCUPATION', nom: 'Occupation' },
    { module: 'HOSPITALISATION', code: 'HOSPITALISATION.HISTORIQUE', nom: 'Historique' },
    { module: 'MATERNITE', code: 'MATERNITE.CPN', nom: 'CPN' },
    { module: 'MATERNITE', code: 'MATERNITE.CPON', nom: 'CPON' },
    { module: 'MATERNITE', code: 'MATERNITE.ACCOUCHEMENT', nom: 'Accouchement' },
    { module: 'MATERNITE', code: 'MATERNITE.PF', nom: 'PF' },
    { module: 'MATERNITE', code: 'MATERNITE.ORDONNANCE', nom: 'Ordonnance' },
    { module: 'MATERNITE', code: 'MATERNITE.EXAMENS', nom: 'Examens' },
    { module: 'MATERNITE', code: 'MATERNITE.REFERENCE', nom: 'Référence' },
    { module: 'SOINS', code: 'SOINS.FILE', nom: "File d'attente" },
    { module: 'SOINS', code: 'SOINS.RECHERCHE', nom: 'Recherche' },
    { module: 'SOINS', code: 'SOINS.HISTORIQUE', nom: 'Historique' },
    { module: 'FINANCES', code: 'FINANCES.DIRECT', nom: 'En service maintenant' },
    { module: 'FINANCES', code: 'FINANCES.SERVICES', nom: 'Services du mois' },
    { module: 'FINANCES', code: 'FINANCES.TARIFS', nom: 'Tarifs des agents' },
    { module: 'FINANCES', code: 'FINANCES.FICHES', nom: 'Fiches de vacation' },
    { module: 'STATISTIQUES', code: 'STATISTIQUES.TABLEAU-BORD', nom: 'Tableau de bord' },
    { module: 'STATISTIQUES', code: 'STATISTIQUES.FREQUENTATION', nom: 'Fréquentation' },
    { module: 'STATISTIQUES', code: 'STATISTIQUES.RECETTES', nom: 'Recettes' },
    { module: 'STATISTIQUES', code: 'STATISTIQUES.LABORATOIRE', nom: 'Laboratoire' },
    { module: 'STATISTIQUES', code: 'STATISTIQUES.IMAGERIE', nom: 'Imagerie' },
    { module: 'STATISTIQUES', code: 'STATISTIQUES.HOSPITALISATION', nom: 'Hospitalisation' },
    { module: 'STATISTIQUES', code: 'STATISTIQUES.PHARMACIE', nom: 'Pharmacie' },
    { module: 'STATISTIQUES', code: 'STATISTIQUES.MATERNITE', nom: 'Maternité' },
];
exports.CODES_ONGLETS = new Set(exports.ONGLETS.map((o) => o.code));
const moduleDeLOnglet = (code) => code.split('.')[0];
exports.moduleDeLOnglet = moduleDeLOnglet;
function ongletAutorise(autorises, code) {
    const module = (0, exports.moduleDeLOnglet)(code);
    const duModule = autorises.filter((o) => (0, exports.moduleDeLOnglet)(o) === module);
    return duModule.length === 0 || duModule.includes(code);
}
//# sourceMappingURL=onglets.js.map