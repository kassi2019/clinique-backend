// ============================================================
//  Seed des fiches d'échographie (types paramétrés)
//  Exécution : node seed-fiches-echo.js
//  IDEMPOTENT : ajoute uniquement les types absents.
// ============================================================
const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const DONNEES = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'echographie', '_fiches_ocr.json'), 'utf8'),
)

// Titre imprimé de chaque fiche (comme sur les photos)
const TITRES = {
  'Echo abdominale': 'ECHOGRAPHIE ABDOMINALE',
  'Echo obstetricale 2 e et 3 e trimestre': 'ECHOGRAPHIE OBSTÉTRICALE',
  'Echo prostatique': 'ECHOGRAPHIE PROSTATIQUE',
  'Distrophie Ovarienne Bilatérale': 'EXAMEN GYNÉCOLOGIQUE',
  'Distrophie ovarienne gauche ou droite': 'EXAMEN GYNÉCOLOGIQUE',
  'Kyste Ovarien Bilatérale': 'EXAMEN GYNÉCOLOGIQUE',
  'Hematometrie': 'EXAMEN GYNÉCOLOGIQUE',
  'Pelvis ( reste d\'avortement)': 'EXAMEN ÉCHOGRAPHIQUE DU PELVIS',
  'Pelvis I ( kyste ovarien hétérogène)': 'EXAMEN ÉCHOGRAPHIQUE DU PELVIS',
  'Pelvis I( kyste ovarien cloisonné d\'allure organique)': 'EXAMEN ÉCHOGRAPHIQUE DU PELVIS',
  'Pelvis II ( grossesse extra utérine)': 'EXAMEN ÉCHOGRAPHIQUE DU PELVIS',
  'Pelvis II ( uterus polymyomateux)': 'EXAMEN ÉCHOGRAPHIQUE DU PELVIS',
  'Pelvis III ( uterus myomateux)': 'EXAMEN ÉCHOGRAPHIQUE DU PELVIS',
  'Pelvis III (avortement en cours)': 'EXAMEN ÉCHOGRAPHIQUE DU PELVIS',
  'Pelvis III (caillots sanguin)': 'EXAMEN ÉCHOGRAPHIQUE DU PELVIS',
  'Pelvis III (pertes blanches)': 'EXAMEN ÉCHOGRAPHIQUE DU PELVIS',
  'Pelvis III( myomes intra cavitaire)': 'EXAMEN ÉCHOGRAPHIQUE DU PELVIS',
  'Pelvis normal': 'EXAMEN ÉCHOGRAPHIQUE DU PELVIS',
  'Grossesse Arrete': 'ECHOGRAPHIE OBSTÉTRICALE (1ER TRIMESTRE)',
  'Grossesse arrête 1 er trimestre': 'ECHOGRAPHIE OBSTÉTRICALE (1ER TRIMESTRE)',
  'Grossesse gémellaire 1 er trimestre': 'ECHOGRAPHIE OBSTÉTRICALE (1ER TRIMESTRE)',
  'Grossesse monoembryonnaire evolutive 1 er trimestre': 'ECHOGRAPHIE OBSTÉTRICALE (1ER TRIMESTRE)',
  'Grossesse stationnaire 1 er trimestre': 'ECHOGRAPHIE OBSTÉTRICALE (1ER TRIMESTRE)',
  'Rédaction libre': '',
}

async function main() {
  const cliniques = await prisma.clinique.findMany({ select: { id: true } })
  for (const clinique of cliniques) {
    let ajoutes = 0
    for (const [libelle, texte] of Object.entries(DONNEES)) {
      const existant = await prisma.ficheEchographie.findUnique({
        where: { cliniqueId_libelle: { cliniqueId: clinique.id, libelle } },
      })
      if (existant) continue
      await prisma.ficheEchographie.create({
        data: {
          cliniqueId: clinique.id,
          libelle,
          titre: TITRES[libelle] ?? '',
          texte,
        },
      })
      ajoutes += 1
    }
    console.log(`Clinique #${clinique.id} : ${ajoutes} fiches ajoutées.`)
  }
  console.log('✅ Seed fiches échographie terminé.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
