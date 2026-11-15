import { PrismaService } from '../prisma/prisma.service';
import { DATE_RE, HEURE_RE, jourLocal as aujourdHui, utilisateurFiltre } from '../common/filtre-periode';

/**
 * Filtres communs des rapports de ventes pharmacie (Statistiques → Pharmacie
 * et Pharmacie → Ordonnances externes), pour que les deux écrans donnent
 * toujours les mêmes chiffres.
 *
 * Chaque filtre est facultatif et ils se combinent :
 *  - dates : vide = aujourd'hui (fin vide = même jour que le début) ;
 *  - heures (HH:MM) : l'heure de début s'applique à la date de début, l'heure
 *    de fin à la date de fin (période continue : du 13/11 18:00 au 14/11 08:00) ;
 *    vides = 00:00 et 23:59 ;
 *  - utilisateur : celui qui a encaissé la vente (vide = tous).
 */
export interface FiltreVentes {
  debut?: string;
  fin?: string;
  heureDebut?: string;
  heureFin?: string;
  utilisateurId?: number;
}

const DATE = DATE_RE;
const HEURE = HEURE_RE;

export function bornesVentes(f: FiltreVentes) {
  const d = f.debut && DATE.test(f.debut) ? f.debut : aujourdHui();
  const fi = f.fin && DATE.test(f.fin) ? f.fin : d;
  const hd = f.heureDebut && HEURE.test(f.heureDebut) ? f.heureDebut : null;
  const hf = f.heureFin && HEURE.test(f.heureFin) ? f.heureFin : null;

  const debut = new Date(`${d}T${hd ?? '00:00'}:00`);
  const fin = hf ? new Date(`${fi}T${hf}:59.999`) : new Date(`${fi}T23:59:59.999`);

  const jj = (s: string) => s.split('-').reverse().join('/');
  const libelleDates = d === fi ? jj(d) : `${jj(d)} au ${jj(fi)}`;
  const libelleHeures = hd || hf ? ` (${hd ?? '00:00'} → ${hf ?? '23:59'})` : '';

  return { debut, fin, libelle: `${libelleDates}${libelleHeures}` };
}

export { utilisateurFiltre };

/** Utilisateurs ayant déjà encaissé une vente pharmacie dans la clinique (liste du filtre). */
export async function vendeursPharmacie(prisma: PrismaService, cliniqueId: number) {
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
