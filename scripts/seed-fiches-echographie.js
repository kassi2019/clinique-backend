// ============================================================
//  seed-fiches-echographie.js — Types de fiches d'échographie
//
//  Insère les 24 modèles de fiches (fiches_echographie) pour
//  TOUTES les cliniques de la base. IDEMPOTENT : on peut le
//  relancer sans risque.
//    - si le libellé n'existe pas  → création (actif = true)
//    - si le texte/titre diffèrent → mise à jour (l'actif
//      n'est jamais touché, pour respecter les désactivations
//      faites dans l'application)
//
//  Exécution locale (dossier clinique-backend) :
//      node scripts/seed-fiches-echographie.js
//  Sur le VPS (après déploiement) :
//      cd /opt/clinique/backend
//      node /root/seed-fiches-echographie.js
// ============================================================
const { PrismaClient } = require('@prisma/client');
const TEMPLATES = require('./fiches-echographie-templates');

const prisma = new PrismaClient();

// Valeur par défaut de titre2 à la CRÉATION (l'utilisateur gère ensuite
// titre2 à la main en base : le seed ne le modifie jamais après création).
const TITRE2_DEFAUT = 'RÉSULTAT';

// Anciens libellés bruts (import OCR du 29/09, textes illisibles) : remplacés
// par les modèles nettoyés ci-dessus. Suppression idempotente (par libellé).
// NB : « Distrophie Ovarienne Bilatérale » en est absent — la collation de la
// base (insensible à la casse) le confond avec le modèle propre du même nom ;
// la mise à jour ci-dessous en reprend alors le texte et l'orthographe.
const ANCIENS_LIBELLES = [
  'Echo abdominale',
  'Echo obstetricale 2 e et 3 e trimestre',
  'Echo prostatique',
  'Grossesse Arrete',
  'Grossesse arrête 1 er trimestre',
  'Grossesse gémellaire 1 er trimestre',
  'Grossesse monoembryonnaire evolutive 1 er trimestre',
  'Grossesse stationnaire 1 er trimestre',
  'Hematometrie',
  'Kyste Ovarien Bilatérale',
  'Pelvis ( reste d\'avortement)',
  'Pelvis I ( kyste ovarien hétérogène)',
  'Pelvis I( kyste ovarien cloisonné d\'allure organique)',
  'Pelvis II ( grossesse extra utérine)',
  'Pelvis II ( uterus polymyomateux)',
  'Pelvis III ( uterus myomateux)',
  'Pelvis III (avortement en cours)',
  'Pelvis III (caillots sanguin)',
  'Pelvis III (pertes blanches)',
  'Pelvis III( myomes intra cavitaire)',
];

async function main() {
  const cliniques = await prisma.clinique.findMany({ select: { id: true, nom: true } });
  if (cliniques.length === 0) {
    console.log('→ Aucune clinique en base : rien à faire.');
    return;
  }

  // 0. Nettoyage des anciens modèles bruts (remplacés par les modèles propres)
  let supprimes = 0;
  for (const clinique of cliniques) {
    for (const libelle of ANCIENS_LIBELLES) {
      const ancien = await prisma.ficheEchographie.findUnique({
        where: { cliniqueId_libelle: { cliniqueId: clinique.id, libelle } },
      });
      if (ancien) {
        await prisma.ficheEchographie.delete({ where: { id: ancien.id } });
        supprimes += 1;
      }
    }
  }
  if (supprimes > 0) console.log(`→ ${supprimes} ancien(s) modèle(s) brut(s) supprimé(s).`);

  let crees = 0;
  let maj = 0;
  let identiques = 0;

  for (const clinique of cliniques) {
    for (const t of TEMPLATES) {
      const existant = await prisma.ficheEchographie.findUnique({
        where: { cliniqueId_libelle: { cliniqueId: clinique.id, libelle: t.libelle } },
      });
      if (!existant) {
        await prisma.ficheEchographie.create({
          data: {
            cliniqueId: clinique.id,
            libelle: t.libelle,
            titre: t.titre,
            titre2: t.titre2 ?? TITRE2_DEFAUT,
            texte: t.texte,
            champs: JSON.stringify(t.champs ?? []),
          },
        });
        crees += 1;
      } else if (
        existant.texte !== t.texte ||
        (existant.titre ?? '') !== (t.titre ?? '') ||
        existant.libelle !== t.libelle ||
        (existant.champs ?? '') !== JSON.stringify(t.champs ?? [])
      ) {
        await prisma.ficheEchographie.update({
          where: { id: existant.id },
          data: {
            libelle: t.libelle,
            titre: t.titre,
            texte: t.texte,
            champs: JSON.stringify(t.champs ?? []), // actif non touché
          },
        });
        maj += 1;
      } else {
        identiques += 1;
      }
    }
    console.log(`→ Clinique « ${clinique.nom} » (id ${clinique.id}) : ${TEMPLATES.length} types traités.`);
  }

  console.log('');
  console.log(`Terminé : ${supprimes} supprimés (anciens), ${crees} créés, ${maj} mis à jour, ${identiques} inchangés.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
