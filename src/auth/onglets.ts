/**
 * Catalogue des onglets protégeables, par module.
 * Les droits sont donnés par utilisateur (table utilisateurs_onglets) :
 * aucun onglet coché pour un module = tous les onglets de ce module.
 * Les codes doivent rester identiques à ceux utilisés dans le frontend.
 */
export const ONGLETS: { module: string; code: string; nom: string }[] = [
  // ACCUEIL
  { module: 'ACCUEIL', code: 'ACCUEIL.FORMULAIRE', nom: 'Nouveau passage' },
  { module: 'ACCUEIL', code: 'ACCUEIL.ATTENTE', nom: 'En attente de constante' },
  { module: 'ACCUEIL', code: 'ACCUEIL.TERMINEE', nom: 'Constante terminée' },
  { module: 'ACCUEIL', code: 'ACCUEIL.HISTORIQUE', nom: 'Historique' },
  // CAISSE
  { module: 'CAISSE', code: 'CAISSE.ATTENTE', nom: 'En attente de paiement' },
  { module: 'CAISSE', code: 'CAISSE.PAYES', nom: 'Payés du jour' },
  { module: 'CAISSE', code: 'CAISSE.CREDITS', nom: 'Crédits / Cas sociaux' },
  { module: 'CAISSE', code: 'CAISSE.RECHERCHE', nom: 'Recherche par code' },
  // CONSULTATION
  { module: 'CONSULTATION', code: 'CONSULTATION.FICHE', nom: 'Fiche de consultation' },
  { module: 'CONSULTATION', code: 'CONSULTATION.MEDICAMENTS', nom: 'Prescription de médicaments' },
  { module: 'CONSULTATION', code: 'CONSULTATION.SOINS', nom: 'Soins' },
  { module: 'CONSULTATION', code: 'CONSULTATION.EXAMENS', nom: 'Examens (labo / imagerie)' },
  { module: 'CONSULTATION', code: 'CONSULTATION.CERTIFICAT', nom: "Certificat d'arrêt" },
  { module: 'CONSULTATION', code: 'CONSULTATION.HISTORIQUE', nom: 'Historique' },
  { module: 'CONSULTATION', code: 'CONSULTATION.REFERENCE', nom: 'Référence' },
  // PHARMACIE
  { module: 'PHARMACIE', code: 'PHARMACIE.ORDONNANCES', nom: 'Ordonnances' },
  { module: 'PHARMACIE', code: 'PHARMACIE.STOCKS', nom: 'Stocks' },
  { module: 'PHARMACIE', code: 'PHARMACIE.CREDITS', nom: 'Crédits & cas sociaux' },
  { module: 'PHARMACIE', code: 'PHARMACIE.FINANCIER', nom: 'Points financiers' },
  { module: 'PHARMACIE', code: 'PHARMACIE.EXTERNES', nom: 'Ordonnances externes' },
  // LABORATOIRE
  { module: 'LABORATOIRE', code: 'LABORATOIRE.FILE', nom: "File d'attente" },
  { module: 'LABORATOIRE', code: 'LABORATOIRE.EXAMENS', nom: 'Recherche' },
  { module: 'LABORATOIRE', code: 'LABORATOIRE.HISTORIQUE', nom: 'Historique' },
  // IMAGERIE
  { module: 'IMAGERIE', code: 'IMAGERIE.FILE', nom: "File d'attente" },
  { module: 'IMAGERIE', code: 'IMAGERIE.EXAMENS', nom: 'Recherche' },
  { module: 'IMAGERIE', code: 'IMAGERIE.HISTORIQUE', nom: 'Historique' },
  // HOSPITALISATION
  { module: 'HOSPITALISATION', code: 'HOSPITALISATION.ADMISSIONS', nom: 'Admissions' },
  { module: 'HOSPITALISATION', code: 'HOSPITALISATION.OCCUPATION', nom: 'Occupation' },
  { module: 'HOSPITALISATION', code: 'HOSPITALISATION.HISTORIQUE', nom: 'Historique' },
  // MATERNITE
  { module: 'MATERNITE', code: 'MATERNITE.CPN', nom: 'CPN' },
  { module: 'MATERNITE', code: 'MATERNITE.CPON', nom: 'CPON' },
  { module: 'MATERNITE', code: 'MATERNITE.ACCOUCHEMENT', nom: 'Accouchement' },
  { module: 'MATERNITE', code: 'MATERNITE.PF', nom: 'PF' },
  { module: 'MATERNITE', code: 'MATERNITE.ORDONNANCE', nom: 'Ordonnance' },
  { module: 'MATERNITE', code: 'MATERNITE.EXAMENS', nom: 'Examens' },
  { module: 'MATERNITE', code: 'MATERNITE.REFERENCE', nom: 'Référence' },
  // SOINS
  { module: 'SOINS', code: 'SOINS.FILE', nom: "File d'attente" },
  { module: 'SOINS', code: 'SOINS.RECHERCHE', nom: 'Recherche' },
  { module: 'SOINS', code: 'SOINS.HISTORIQUE', nom: 'Historique' },
  // FINANCES
  { module: 'FINANCES', code: 'FINANCES.DIRECT', nom: 'En service maintenant' },
  { module: 'FINANCES', code: 'FINANCES.SERVICES', nom: 'Services du mois' },
  { module: 'FINANCES', code: 'FINANCES.TARIFS', nom: 'Tarifs des agents' },
  { module: 'FINANCES', code: 'FINANCES.FICHES', nom: 'Fiches de vacation' },
  // STATISTIQUES
  { module: 'STATISTIQUES', code: 'STATISTIQUES.TABLEAU-BORD', nom: 'Tableau de bord' },
  { module: 'STATISTIQUES', code: 'STATISTIQUES.FREQUENTATION', nom: 'Fréquentation' },
  { module: 'STATISTIQUES', code: 'STATISTIQUES.RECETTES', nom: 'Recettes' },
  { module: 'STATISTIQUES', code: 'STATISTIQUES.LABORATOIRE', nom: 'Laboratoire' },
  { module: 'STATISTIQUES', code: 'STATISTIQUES.IMAGERIE', nom: 'Imagerie' },
  { module: 'STATISTIQUES', code: 'STATISTIQUES.HOSPITALISATION', nom: 'Hospitalisation' },
  { module: 'STATISTIQUES', code: 'STATISTIQUES.PHARMACIE', nom: 'Pharmacie' },
  { module: 'STATISTIQUES', code: 'STATISTIQUES.MATERNITE', nom: 'Maternité' },
];

export const CODES_ONGLETS = new Set(ONGLETS.map((o) => o.code));

/** Module d'un code d'onglet (« PHARMACIE.STOCKS » → « PHARMACIE »). */
export const moduleDeLOnglet = (code: string) => code.split('.')[0];

/**
 * L'utilisateur a-t-il accès à l'onglet ? `autorises` = ses onglets cochés (tous modules).
 * Aucun onglet coché pour le module concerné = accès à tous ses onglets.
 */
export function ongletAutorise(autorises: string[], code: string): boolean {
  const module = moduleDeLOnglet(code);
  const duModule = autorises.filter((o) => moduleDeLOnglet(o) === module);
  return duModule.length === 0 || duModule.includes(code);
}
