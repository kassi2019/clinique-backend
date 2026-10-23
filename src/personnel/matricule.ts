/**
 * Règle de matricule harmonisée : PRÉFIXE de la fonction + numéro sur
 * 3 chiffres (MED001, INF001, SFDE001…). Partagée par la création du
 * personnel et par le script de reprise des comptes existants
 * (deploy-vps/05_harmoniser_matricules.js, qui charge le fichier compilé).
 */

/** Mots-clés (sans accents, majuscules) → préfixe. Le premier trouvé gagne. */
const REGLES: [string[], string][] = [
  [['SAGE'], 'SFDE'], // avant « FEMME »/« GYNECO »
  [['MEDECIN', 'PEDIATRE', 'GYNECO', 'DOCTEUR', 'CHIRURGIEN'], 'MED'],
  [['INFIRM'], 'INF'],
  [['AIDE'], 'AID'],
  [['IMAGER', 'MANIPULATEUR', 'RADIO', 'ECHOGRAPH'], 'IMA'],
  [['LABO', 'BIOLOG'], 'LAB'],
  [['PHARMA'], 'PHA'],
  [['CAISS'], 'CAI'],
  [['ACCUEIL', 'ACCEUIL'], 'ACC'],
];

/** Codes de service reconnus quand la fonction ne suffit pas (ex. « AUXILIAIRE » à la pharmacie). */
const PREFIXES_SERVICE = ['MED', 'INF', 'IMA', 'LAB', 'PHA', 'CAI', 'ACC'];

/** Personnel administratif : tout ce qui n'est pas reconnu. */
export const PREFIXE_ADMINISTRATIF = 'PERA';

function normaliser(texte?: string | null): string {
  return (texte ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase();
}

export function prefixeMatricule(fonction?: string | null, codeService?: string | null): string {
  const f = normaliser(fonction);
  for (const [motsCles, prefixe] of REGLES) {
    if (motsCles.some((m) => f.includes(m))) return prefixe;
  }
  const s = normaliser(codeService).trim().slice(0, 3);
  if (PREFIXES_SERVICE.includes(s)) return s;
  return PREFIXE_ADMINISTRATIF;
}

/** Prochain numéro libre pour un préfixe, d'après les matricules déjà pris. */
export function prochainMatricule(prefixe: string, existants: string[]): string {
  const motif = new RegExp(`^${prefixe}(\\d+)$`);
  let max = 0;
  for (const m of existants) {
    const n = Number(motif.exec(m)?.[1]);
    if (n > max) max = n;
  }
  return `${prefixe}${String(max + 1).padStart(3, '0')}`;
}
