/**
 * Filtres communs des listes et rapports : dates, heures, utilisateur.
 * Chaque filtre est facultatif et ils se combinent.
 *
 * Heures (HH:MM) : l'heure de début s'applique au jour de début, l'heure de
 * fin au jour de fin (période continue, ex. garde du 13/11 18:00 au 14/11 08:00).
 * Heure vide = 00:00 (début) / 23:59 (fin).
 */
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const HEURE_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Date du jour (heure locale du serveur) au format AAAA-MM-JJ. */
export function jourLocal() {
  const n = new Date();
  const p = (x: number) => String(x).padStart(2, '0');
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`;
}

export function heureValide(h?: string) {
  return h && HEURE_RE.test(h) ? h : undefined;
}

/** Identifiant d'utilisateur valide, sinon undefined (= tous). */
export function utilisateurFiltre(v?: string | number | null) {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : undefined;
}

/** Vrai si une heure est renseignée (le filtre doit alors s'appliquer même sans date). */
export function aDesHeures(heureDebut?: string, heureFin?: string) {
  return !!(heureValide(heureDebut) || heureValide(heureFin));
}

/**
 * Bornes { gte, lte } d'une période de jours avec heures facultatives.
 * jourFin vide = même jour que jourDebut.
 */
export function bornesPeriode(
  jourDebut: string,
  jourFin?: string,
  heureDebut?: string,
  heureFin?: string,
) {
  const d = DATE_RE.test(jourDebut) ? jourDebut : jourLocal();
  const f = jourFin && DATE_RE.test(jourFin) ? jourFin : d;
  const hd = heureValide(heureDebut);
  const hf = heureValide(heureFin);
  return {
    gte: new Date(`${d}T${hd ?? '00:00'}:00`),
    lte: hf ? new Date(`${f}T${hf}:59.999`) : new Date(`${f}T23:59:59.999`),
  };
}

/**
 * Pour les listes où « jour vide = tous les jours » : renvoie les bornes si un
 * jour OU une heure est donné (heure seule = aujourd'hui), sinon undefined.
 */
export function bornesJourOptionnel(jour?: string, heureDebut?: string, heureFin?: string) {
  const j = jour && DATE_RE.test(jour) ? jour : undefined;
  if (!j && !aDesHeures(heureDebut, heureFin)) return undefined;
  return bornesPeriode(j ?? jourLocal(), j ?? jourLocal(), heureDebut, heureFin);
}
