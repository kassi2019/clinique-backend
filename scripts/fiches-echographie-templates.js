// ============================================================
//  Modèles des fiches d'échographie (24 types paramétrés)
//  Source : dossier « echographie/ » (fiches papier scannées)
//
//  Chaque fiche = texte du format avec marqueurs {code} + champs
//  de saisie structurés :
//    type: 'nombre' (avec unité), 'texte' (multiligne optionnel),
//          'choix' (liste déroulante), 'date' (JJ/MM/AAAA)
//    defaut : texte affiché quand le champ est vide (souvent
//          « ...... » ou la liste des options du papier)
//  À l'impression : les valeurs saisies remplacent les {code},
//  le reste du texte du format est conservé tel quel.
// ============================================================

const GY = 'EXAMEN ÉCHOGRAPHIQUE GYNÉCOLOGIQUE';
const OBS = 'ÉCHOGRAPHIE OBSTÉTRALE';
const ECHO = 'EXAMEN ÉCHOGRAPHIQUE';

/** Champs communs des fiches gynéco (pelvis). */
const champsPelvis = [
  { code: 'hauteur', libelle: 'Hauteur utérus', type: 'nombre', unite: 'mm' },
  { code: 'largeur', libelle: 'Largeur utérus', type: 'nombre', unite: 'mm' },
  { code: 'epaisseur', libelle: 'Épaisseur utérus', type: 'nombre', unite: 'mm' },
  { code: 'echostructure', libelle: 'Échostructure', type: 'choix', options: ['homogène', 'inhomogène'] },
  { code: 'contour', libelle: 'Contour', type: 'choix', options: ['régulier', 'irrégulier'] },
  { code: 'ovaireDroit', libelle: 'Ovaire droit', type: 'nombre', unite: 'mm' },
  { code: 'ovaireGauche', libelle: 'Ovaire gauche', type: 'nombre', unite: 'mm' },
];

/** Corps commun des fiches gynéco (pelvis). */
function pelvis({ particulier, conclusion, conclusionChamps }) {
  return {
    texte: [
      `L'étude réalisée ce jour montre :`,
      ``,
      `1/ Un utérus vide dont les dimensions sont :`,
      `{hauteur} mm de hauteur, {largeur} mm de largeur, {epaisseur} mm d'épaisseur.`,
      `L'échostructure est {echostructure} et le contour est {contour}.`,
      `La ligne cavitaire est fine et régulière.`,
      ...(particulier ?? []),
      ``,
      `2/ L'ovaire droit vu, mesure {ovaireDroit} mm.`,
      `L'ovaire gauche vu, mesure {ovaireGauche} mm.`,
      ``,
      `3/ Pas de collection dans le Douglas.`,
      ``,
      `CONCLUSION :`,
      `{conclusion}`,
    ].join('\n'),
    champs: [
      ...champsPelvis,
      ...(conclusionChamps ?? []),
      {
        code: 'conclusion',
        libelle: 'Conclusion',
        type: 'texte',
        multiligne: true,
        defaut: conclusion,
      },
    ],
  };
}

module.exports = [
  // ─────────── GYNÉCO (pelvis) ───────────
  {
    libelle: 'Pelvis normal',
    titre: GY,
    ...pelvis({
      conclusion: `- Utérus vide et homogène.\n- Ovaires d'aspect normal.`,
    }),
  },
  {
    libelle: 'Distrophie ovarienne bilatérale',
    titre: GY,
    ...pelvis({
      particulier: [`Ils renferment des microfollicules.`],
      conclusion: `- Utérus vide et homogène.\n- Dystrophie ovarienne bilatérale microfolliculaire.`,
    }),
  },
  {
    libelle: 'Distrophie ovarienne gauche ou droite',
    titre: GY,
    ...pelvis({
      particulier: [`L'ovaire {cote} renferme des microfollicules.`],
      conclusion: `- Utérus vide et homogène.\n- Dystrophie ovarienne {cote} microfolliculaire.\n- Ovaire controlatéral d'aspect normal.`,
      conclusionChamps: [
        { code: 'cote', libelle: 'Côté atteint', type: 'choix', options: ['droite', 'gauche'] },
      ],
    }),
  },
  {
    libelle: 'Kyste ovarien bilatéral',
    titre: GY,
    ...pelvis({
      particulier: [`Leur contenu kystique : {contenuKystique}`],
      conclusion: `- Utérus vide et homogène.\n- Kyste ovarien bilatéral d'allure fonctionnelle.`,
      conclusionChamps: [
        { code: 'contenuKystique', libelle: 'Contenu kystique', type: 'texte', defaut: '......' },
      ],
    }),
  },
  {
    libelle: 'Pelvis I — kyste ovarien hétérogène',
    titre: GY,
    ...pelvis({
      conclusion: `- Utérus vide et homogène.\n- Kyste ovarien {kyste} hétérogène d'allure organique.\n- Ovaire controlatéral d'aspect normal.`,
      conclusionChamps: [
        { code: 'kyste', libelle: 'Kyste (description)', type: 'texte', defaut: '......' },
      ],
    }),
  },
  {
    libelle: 'Pelvis I — kyste ovarien cloisonné d\'allure organique',
    titre: GY,
    ...pelvis({
      conclusion: `- Utérus vide et homogène.\n- Kyste ovarien {kyste} cloisonné d'allure organique.\n- Ovaire controlatéral d'aspect normal.`,
      conclusionChamps: [
        { code: 'kyste', libelle: 'Kyste (description)', type: 'texte', defaut: '......' },
      ],
    }),
  },
  {
    libelle: 'Pelvis II — grossesse extra-utérine',
    titre: GY,
    texte: [
      `L'étude réalisée ce jour montre :`,
      ``,
      `1/ Un utérus vide dont les dimensions sont :`,
      `{hauteur} mm de hauteur, {largeur} mm de largeur, {epaisseur} mm d'épaisseur.`,
      `L'échostructure est homogène et le contour est régulier.`,
      `La ligne cavitaire est fine et régulière.`,
      `On note dans la région latéro-utérine {cote} une formation sacculaire`,
      `d'échostructure hétérogène évoquant une grossesse extra-utérine.`,
      ``,
      `2/ L'ovaire droit vu, mesure {ovaireDroit} mm.`,
      `L'ovaire gauche vu, mesure {ovaireGauche} mm.`,
      ``,
      `3/ Collection dans le Douglas, dans les gouttières pariéto-coliques : {abondance}.`,
      ``,
      `CONCLUSION :`,
      `- Aspect échographique en faveur d'une grossesse extra-utérine {rompue}.`,
      `(À confirmer par une ponction exploratrice et le dosage des B.H.C.G).`,
      `- Ovaires normaux.`,
    ].join('\n'),
    champs: [
      { code: 'hauteur', libelle: 'Hauteur utérus', type: 'nombre', unite: 'mm' },
      { code: 'largeur', libelle: 'Largeur utérus', type: 'nombre', unite: 'mm' },
      { code: 'epaisseur', libelle: 'Épaisseur utérus', type: 'nombre', unite: 'mm' },
      { code: 'cote', libelle: 'Région latéro-utérine', type: 'choix', options: ['droite', 'gauche'], defaut: 'droite / gauche' },
      { code: 'ovaireDroit', libelle: 'Ovaire droit', type: 'nombre', unite: 'mm' },
      { code: 'ovaireGauche', libelle: 'Ovaire gauche', type: 'nombre', unite: 'mm' },
      { code: 'abondance', libelle: 'Abondance de la collection', type: 'choix', options: ['De faible abondance', 'De grande abondance'], defaut: 'De faible abondance [ ]  De grande abondance [ ]' },
      { code: 'rompue', libelle: 'Grossesse', type: 'choix', options: ['rompue', 'non rompue'], defaut: 'rompue / non rompue' },
    ],
  },
  {
    libelle: 'Pelvis II — utérus polymyomateux',
    titre: GY,
    ...pelvis({
      particulier: [
        `L'échostructure est inhomogène et le contour est irrégulier.`,
        `Présence de plusieurs myomes dont les significatifs sont {myomes}.`,
      ],
      conclusion: `- Utérus polymyomateux vide sans retentissement sur les cavités rénales.`,
      conclusionChamps: [
        { code: 'myomes', libelle: 'Myomes significatifs', type: 'texte', defaut: '......' },
      ],
    }),
  },
  {
    libelle: 'Pelvis III — utérus myomateux',
    titre: GY,
    ...pelvis({
      particulier: [
        `L'échostructure est inhomogène et le contour est irrégulier.`,
        `Présence d'un myome {myome}.`,
      ],
      conclusion: `- Utérus myomateux vide sans retentissement sur les cavités rénales.`,
      conclusionChamps: [
        { code: 'myome', libelle: 'Myome (description)', type: 'texte', defaut: '......' },
      ],
    }),
  },
  {
    libelle: 'Pelvis III — myome intra-cavitaire',
    titre: GY,
    ...pelvis({
      particulier: [
        `L'échostructure est inhomogène et le contour est irrégulier.`,
        `Présence d'un myome intra-cavitaire mesurant {tailleMyome} mm.`,
      ],
      conclusion: `- Aspect échographique évocateur d'un myome intra-cavitaire.`,
      conclusionChamps: [
        { code: 'tailleMyome', libelle: 'Taille du myome', type: 'nombre', unite: 'mm' },
      ],
    }),
  },
  {
    libelle: 'Pelvis III — caillots sanguins',
    titre: GY,
    ...pelvis({
      particulier: [
        `L'échostructure est homogène et le contour est régulier.`,
        `La cavité utérine est le siège d'une formation hyperéchogène hétérogène en rapport avec des caillots sanguins.`,
      ],
      conclusion: `- Utérus de taille et d'échostructure normales renfermant une formation hyperéchogène hétérogène en rapport avec des caillots sanguins.\n- Ovaires normaux.`,
    }),
  },
  {
    libelle: 'Pelvis III — pertes blanches',
    titre: GY,
    ...pelvis({
      particulier: [
        `L'échostructure est homogène et le contour est régulier.`,
        `La cavité utérine est le siège d'une formation hyperéchogène hétérogène en rapport avec des pertes blanches.`,
      ],
      conclusion: `- Utérus de taille et d'échostructure normales renfermant une formation hyperéchogène hétérogène en rapport avec des pertes blanches.\n- Ovaires normaux.`,
    }),
  },
  {
    libelle: 'Pelvis III — avortement en cours',
    titre: GY,
    ...pelvis({
      particulier: [
        `L'échostructure est homogène et le contour est régulier.`,
        `La cavité utérine est le siège d'une formation hyperéchogène hétérogène en rapport avec un avortement en cours.`,
      ],
      conclusion: `- Aspect échographique en faveur d'un avortement en cours.\n- Ovaires normaux.`,
    }),
  },
  {
    libelle: 'Pelvis — reste d\'avortement',
    titre: GY,
    ...pelvis({
      particulier: [
        `L'échostructure est homogène et le contour est régulier.`,
        `La cavité utérine est le siège d'une formation échogène hétérogène en rapport avec des débris ovulaires.`,
      ],
      conclusion: `- Aspect évocateur d'un reste d'avortement.\n- Ovaires normaux.`,
    }),
  },
  {
    libelle: 'Hématométrie',
    titre: GY,
    ...pelvis({
      particulier: [
        `L'échostructure est homogène et le contour est régulier.`,
        `La cavité utérine est le siège d'une collection {collection} en rapport avec une hématométrie.`,
      ],
      conclusion: `- Aspect échographique en faveur d'une hématométrie.\n- Ovaires normaux.`,
      conclusionChamps: [
        { code: 'collection', libelle: 'Collection (description)', type: 'texte', defaut: '......' },
      ],
    }),
  },

  // ─────────── OBSTÉTRICAL 1er trimestre ───────────
  {
    libelle: 'Grossesse monoembryonnaire évolutive 1er trimestre',
    titre: OBS,
    texte: [
      `Demande : Écho obstétricale (1er trimestre)`,
      ``,
      `SAC OVULAIRE`,
      `Nombre : 01 (un)`,
      `Diamètre du sac : {diametreSac} mm`,
      `Réaction trophoblastique : {tropho}.`,
      ``,
      `EMBRYON`,
      `Nombre : 01 (un)`,
      `Activité cardiaque : présente.`,
      `Longueur cranio-caudale : {lcc} mm, soit {lccSemaines} semaine(s) d'âge échographique.`,
      `La réaction trophoblastique est : {tropho}`,
      `Le myomètre : {myometre}`,
      ``,
      `UTÉRUS & ANNEXES : {uterusAnnexes}`,
      ``,
      `CONCLUSION :`,
      `Grossesse monoembryonnaire intra-utérine vivante et évolutive de {semaines} semaine(s) + {jours} jour(s) d'âge échographique.`,
      `Terme probable échographique autour du {terme} ± 15 jours.`,
    ].join('\n'),
    champs: [
      { code: 'diametreSac', libelle: 'Diamètre du sac', type: 'nombre', unite: 'mm' },
      { code: 'tropho', libelle: 'Réaction trophoblastique', type: 'choix', options: ['bonne', 'mauvaise'], defaut: 'bonne' },
      { code: 'lcc', libelle: 'Longueur cranio-caudale', type: 'nombre', unite: 'mm' },
      { code: 'lccSemaines', libelle: 'Âge échographique (LCC)', type: 'nombre', unite: 'semaine(s)' },
      { code: 'myometre', libelle: 'Myomètre', type: 'texte', defaut: '......' },
      { code: 'uterusAnnexes', libelle: 'Utérus & annexes', type: 'texte', defaut: '......' },
      { code: 'semaines', libelle: 'Âge (semaines)', type: 'nombre', unite: 'semaine(s)' },
      { code: 'jours', libelle: 'Âge (jours)', type: 'nombre', unite: 'jour(s)' },
      { code: 'terme', libelle: 'Terme probable', type: 'date' },
    ],
  },
  {
    libelle: 'Grossesse gémellaire 1er trimestre',
    titre: OBS,
    texte: [
      `Demande : Écho obstétricale (1er trimestre)`,
      ``,
      `SAC OVULAIRE`,
      `Nombre : 02 (deux)`,
      `Diamètre du sac : {diametreSac} mm`,
      `Réaction trophoblastique : {tropho}.`,
      ``,
      `EMBRYONS`,
      `Nombre : 02 (deux)`,
      `Activité cardiaque : perceptible.`,
      `Longueur cranio-caudale : {lcc} mm, soit {lccSemaines} semaine(s) d'âge échographique.`,
      ``,
      `UTÉRUS & ANNEXES : {uterusAnnexes}`,
      ``,
      `CONCLUSION :`,
      `Grossesse gémellaire intra-utérine évolutive de {semaines} semaine(s) + {jours} jour(s) d'âge échographique.`,
    ].join('\n'),
    champs: [
      { code: 'diametreSac', libelle: 'Diamètre du sac', type: 'nombre', unite: 'mm' },
      { code: 'tropho', libelle: 'Réaction trophoblastique', type: 'choix', options: ['bonne', 'mauvaise'], defaut: 'bonne' },
      { code: 'lcc', libelle: 'Longueur cranio-caudale', type: 'nombre', unite: 'mm' },
      { code: 'lccSemaines', libelle: 'Âge échographique (LCC)', type: 'nombre', unite: 'semaine(s)' },
      { code: 'uterusAnnexes', libelle: 'Utérus & annexes', type: 'texte', defaut: '......' },
      { code: 'semaines', libelle: 'Âge (semaines)', type: 'nombre', unite: 'semaine(s)' },
      { code: 'jours', libelle: 'Âge (jours)', type: 'nombre', unite: 'jour(s)' },
    ],
  },
  {
    libelle: 'Grossesse arrêtée 1er trimestre',
    titre: OBS,
    texte: [
      `Demande : Écho obstétricale (1er trimestre)`,
      ``,
      `SAC OVULAIRE`,
      `Nombre : 01 (un)`,
      `Diamètre du sac : {diametreSac} mm`,
      `Réaction trophoblastique : {tropho}.`,
      ``,
      `EMBRYON`,
      `Nombre : 01 (un)`,
      `Activité cardiaque : absente.`,
      `Longueur cranio-caudale : {lcc} mm, soit {lccSemaines} semaine(s) d'âge échographique.`,
      ``,
      `UTÉRUS & ANNEXES : {uterusAnnexes}`,
      ``,
      `CONCLUSION :`,
      `Grossesse monoembryonnaire intra-utérine involutive de {semaines} semaine(s) + {jours} jour(s) d'âge échographique (grossesse arrêtée).`,
    ].join('\n'),
    champs: [
      { code: 'diametreSac', libelle: 'Diamètre du sac', type: 'nombre', unite: 'mm' },
      { code: 'tropho', libelle: 'Réaction trophoblastique', type: 'choix', options: ['bonne', 'mauvaise'], defaut: 'mauvaise' },
      { code: 'lcc', libelle: 'Longueur cranio-caudale', type: 'nombre', unite: 'mm' },
      { code: 'lccSemaines', libelle: 'Âge échographique (LCC)', type: 'nombre', unite: 'semaine(s)' },
      { code: 'uterusAnnexes', libelle: 'Utérus & annexes', type: 'texte', defaut: '......' },
      { code: 'semaines', libelle: 'Âge (semaines)', type: 'nombre', unite: 'semaine(s)' },
      { code: 'jours', libelle: 'Âge (jours)', type: 'nombre', unite: 'jour(s)' },
    ],
  },
  {
    libelle: 'Grossesse stationnaire 1er trimestre (œuf clair)',
    titre: OBS,
    texte: [
      `Demande : Écho obstétricale (1er trimestre)`,
      ``,
      `SAC OVULAIRE`,
      `Nombre : 01 (un)`,
      `Diamètre du sac : {diametreSac} mm`,
      `Réaction trophoblastique : mauvaise.`,
      ``,
      `EMBRYON`,
      `Nombre : néant.`,
      `Activité cardiaque : néant.`,
      `Longueur cranio-caudale : non mesurable.`,
      ``,
      `UTÉRUS & ANNEXES : {uterusAnnexes}`,
      ``,
      `CONCLUSION :`,
      `Sac gestationnel intra-utérin non embryonné de {semaines} semaine(s) + {jours} jour(s) d'âge échographique avec une mauvaise réaction trophoblastique évoquant un œuf clair (grossesse involutive).`,
    ].join('\n'),
    champs: [
      { code: 'diametreSac', libelle: 'Diamètre du sac', type: 'nombre', unite: 'mm' },
      { code: 'uterusAnnexes', libelle: 'Utérus & annexes', type: 'texte', defaut: '......' },
      { code: 'semaines', libelle: 'Âge (semaines)', type: 'nombre', unite: 'semaine(s)' },
      { code: 'jours', libelle: 'Âge (jours)', type: 'nombre', unite: 'jour(s)' },
    ],
  },

  // ─────────── OBSTÉTRICAL 2e / 3e trimestre ───────────
  {
    libelle: 'Échographie obstétricale 2e et 3e trimestre',
    titre: OBS,
    texte: [
      `La grossesse est monofœtale (activité cardiaque perçue, mouvements actifs), de sexe {sexe},`,
      `en présentation {presentation}, dont la biométrie est :`,
      `- Diamètre bipariétal (BIP) : {bip} mm`,
      `- Longueur fémorale (LF) : {lf} mm`,
      `- Circonférence abdominale (CA) : {ca} mm`,
      `Ces mesures correspondent à un âge échographique de {semaines} semaine(s) + {jours} jour(s)`,
      `et un terme probable autour du {terme}.`,
      ``,
      `Le placenta est de siège {placentaSiege}, insertion {placentaInsertion}, grade {grade},`,
      `d'épaisseur {epaisseurPlacenta} mm ; distance col-placenta : {placentaCol}.`,
      `Le liquide amniotique est de quantité : {liquideQuantite}.`,
      `Qualité : {liquideQualite}.`,
      `Le cordon ombilical est libre.`,
      `Absence d'anomalie organique fœtale décelable ce jour.`,
      `Morphologie fœtale normale.`,
      ``,
      `CONCLUSION :`,
      `Grossesse monofœtale intra-utérine évolutive de {semaines} semaine(s) + {jours} jour(s) d'âge échographique.`,
      `Terme probable autour du {terme} ± 15 jours.`,
      `Poids fœtal estimé : {poids} grammes ; sexe {sexe}.`,
    ].join('\n'),
    champs: [
      { code: 'sexe', libelle: 'Sexe du fœtus', type: 'choix', options: ['masculin', 'féminin'], defaut: 'masculin / féminin' },
      { code: 'presentation', libelle: 'Présentation', type: 'choix', options: ['céphalique', 'siège', 'transverse'], defaut: 'céphalique / siège / transverse' },
      { code: 'bip', libelle: 'Diamètre bipariétal (BIP)', type: 'nombre', unite: 'mm' },
      { code: 'lf', libelle: 'Longueur fémorale (LF)', type: 'nombre', unite: 'mm' },
      { code: 'ca', libelle: 'Circonférence abdominale (CA)', type: 'nombre', unite: 'mm' },
      { code: 'semaines', libelle: 'Âge (semaines)', type: 'nombre', unite: 'semaine(s)' },
      { code: 'jours', libelle: 'Âge (jours)', type: 'nombre', unite: 'jour(s)' },
      { code: 'terme', libelle: 'Terme probable', type: 'date' },
      { code: 'placentaSiege', libelle: 'Siège du placenta', type: 'texte', defaut: '......' },
      { code: 'placentaInsertion', libelle: 'Insertion', type: 'texte', defaut: '......' },
      { code: 'grade', libelle: 'Grade', type: 'choix', options: ['0', 'I', 'II', 'III'], defaut: '0 / I / II / III' },
      { code: 'epaisseurPlacenta', libelle: 'Épaisseur du placenta', type: 'nombre', unite: 'mm' },
      { code: 'placentaCol', libelle: 'Distance col-placenta', type: 'choix', options: ['loin du col', 'près du col'], defaut: 'loin du col / près du col' },
      { code: 'liquideQuantite', libelle: 'Quantité du liquide amniotique', type: 'choix', options: ['normale', 'diminuée', 'augmentée'], defaut: 'normale / diminuée / augmentée' },
      { code: 'liquideQualite', libelle: 'Qualité', type: 'choix', options: ['claire', 'chargée'], defaut: 'claire / chargée' },
      { code: 'poids', libelle: 'Poids fœtal estimé', type: 'nombre', unite: 'grammes' },
    ],
  },
  {
    libelle: 'Grossesse arrêtée (2e/3e trimestre)',
    titre: OBS,
    texte: [
      `Grossesse monofœtale de {semaines} semaine(s) + {jours} jour(s) d'âge échographique.`,
      `Présentation : {presentation}.`,
      `Biométrie : BIP {bip} mm, Fémur {femur} mm, CA {ca} mm, soit {semaines} semaine(s).`,
      ``,
      `Battements cardiaques : absents.`,
      `Mouvements actifs : {mouvements}.`,
      `Morphologie :`,
      `- {morphoCrane}`,
      `- {morphoAbdomen}`,
      `- Organes : {organes}`,
      ``,
      `PLACENTA`,
      `Position : {placentaPosition}.`,
      `Situation par rapport au col : {placentaCol}.`,
      `Grade {grade}.`,
      ``,
      `LIQUIDE AMNIOTIQUE : quantité {liquide}`,
      `ANNEXES : {annexes}`,
      ``,
      `CONCLUSION :`,
      `Grossesse monofœtale intra-utérine involutive de {semaines} semaine(s) + {jours} jour(s) d'âge échographique avec fœtus en présentation {presentation} (grossesse arrêtée).`,
    ].join('\n'),
    champs: [
      { code: 'semaines', libelle: 'Âge (semaines)', type: 'nombre', unite: 'semaine(s)' },
      { code: 'jours', libelle: 'Âge (jours)', type: 'nombre', unite: 'jour(s)' },
      { code: 'presentation', libelle: 'Présentation', type: 'choix', options: ['céphalique', 'siège', 'transverse'], defaut: 'céphalique / siège / transverse' },
      { code: 'bip', libelle: 'BIP', type: 'nombre', unite: 'mm' },
      { code: 'femur', libelle: 'Fémur', type: 'nombre', unite: 'mm' },
      { code: 'ca', libelle: 'CA', type: 'nombre', unite: 'mm' },
      { code: 'mouvements', libelle: 'Mouvements actifs', type: 'choix', options: ['présents', 'absents'], defaut: 'présents / absents' },
      { code: 'morphoCrane', libelle: 'Rachis / crâne', type: 'texte', defaut: 'Chevauchement des os du crâne.' },
      { code: 'morphoAbdomen', libelle: 'Structures intra-abdominales', type: 'texte', defaut: 'Désorganisation des structures intra-abdominales.' },
      { code: 'organes', libelle: 'Organes', type: 'texte', defaut: '......' },
      { code: 'placentaPosition', libelle: 'Position du placenta', type: 'choix', options: ['antérieur', 'postérieur', 'fundique'], defaut: 'antérieur / postérieur / fundique' },
      { code: 'placentaCol', libelle: 'Situation par rapport au col', type: 'choix', options: ['loin du col', 'près du col'], defaut: 'loin du col / près du col' },
      { code: 'grade', libelle: 'Grade', type: 'choix', options: ['0', 'I', 'II', 'III'], defaut: '0 / I / II / III' },
      { code: 'liquide', libelle: 'Quantité du liquide amniotique', type: 'texte', defaut: '......' },
      { code: 'annexes', libelle: 'Annexes', type: 'texte', defaut: '......' },
    ],
  },

  // ─────────── ABDOMINALE / PROSTATE / LIBRE ───────────
  {
    libelle: 'Échographie abdominale',
    titre: 'ÉCHOGRAPHIE ABDOMINALE',
    texte: [
      `L'étude réalisée ce jour montre :`,
      ``,
      `Le foie est de taille normale, d'échostructure homogène et présentant des contours réguliers.`,
      `Tronc porte et veines sus-hépatiques perméables, de calibre normal.`,
      `La vésicule biliaire est {vesicule}`,
      `Absence de dilatation des voies intra et extra hépatiques.`,
      `La rate est homogène, contours réguliers et mesure {rate} mm.`,
      `Le pancréas est {pancreas}`,
      `Les reins sont {reins}`,
      `La vessie : {vessie} ; résidu post-mictionnel : {residu} ml.`,
      `Pas d'épanchement intra-abdominal.`,
      ``,
      `CONCLUSION :`,
      `{conclusion}`,
    ].join('\n'),
    champs: [
      { code: 'vesicule', libelle: 'Vésicule biliaire', type: 'texte', defaut: 'alithiasique, paroi fine' },
      { code: 'rate', libelle: 'Rate (longueur)', type: 'nombre', unite: 'mm' },
      { code: 'pancreas', libelle: 'Pancréas', type: 'texte', defaut: 'homogène, de taille normale ; le Wirsung n\'est pas dilaté' },
      { code: 'reins', libelle: 'Reins', type: 'texte', defaut: 'de taille et d\'échostructure normales, sans dilatation des cavités pyélocalicielles' },
      { code: 'vessie', libelle: 'Vessie', type: 'texte', defaut: '......' },
      { code: 'residu', libelle: 'Résidu post-mictionnel', type: 'nombre', unite: 'ml' },
      { code: 'conclusion', libelle: 'Conclusion', type: 'texte', multiligne: true, defaut: '......' },
    ],
  },
  {
    libelle: 'Échographie prostatique',
    titre: 'ÉCHOGRAPHIE PROSTATIQUE',
    texte: [
      `L'étude réalisée ce jour montre :`,
      ``,
      `PROSTATE :`,
      `Poids : {poids} g.`,
      `Dimensions : {dim1} x {dim2} x {dim3} mm.`,
      `Contours : {contours}.`,
      `Échostructure : {echostructure}.`,
      `Adénome : {adenome}.`,
      ``,
      `VESSIE :`,
      `Paroi : {paroiVessie} ; contenu : {contenuVessie}`,
      `Résidu post-mictionnel : {residu} ml.`,
      ``,
      `CONCLUSION :`,
      `{conclusion}`,
    ].join('\n'),
    champs: [
      { code: 'poids', libelle: 'Poids de la prostate', type: 'nombre', unite: 'g' },
      { code: 'dim1', libelle: 'Dimension 1', type: 'nombre', unite: 'mm' },
      { code: 'dim2', libelle: 'Dimension 2', type: 'nombre', unite: 'mm' },
      { code: 'dim3', libelle: 'Dimension 3', type: 'nombre', unite: 'mm' },
      { code: 'contours', libelle: 'Contours', type: 'choix', options: ['réguliers', 'irréguliers'], defaut: 'réguliers / irréguliers' },
      { code: 'echostructure', libelle: 'Échostructure', type: 'choix', options: ['homogène', 'hétérogène'], defaut: 'homogène / hétérogène' },
      { code: 'adenome', libelle: 'Adénome', type: 'choix', options: ['absent', 'médian', 'latéral'], defaut: 'absent / médian / latéral' },
      { code: 'paroiVessie', libelle: 'Paroi de la vessie', type: 'texte', defaut: '......' },
      { code: 'contenuVessie', libelle: 'Contenu de la vessie', type: 'texte', defaut: '......' },
      { code: 'residu', libelle: 'Résidu post-mictionnel', type: 'nombre', unite: 'ml' },
      { code: 'conclusion', libelle: 'Conclusion', type: 'texte', multiligne: true, defaut: '......' },
    ],
  },
  {
    libelle: 'Rédaction libre',
    titre: ECHO,
    texte: [
      `RESULTATS`,
      `{resultats}`,
      ``,
      `CONCLUSION :`,
      `{conclusion}`,
    ].join('\n'),
    champs: [
      { code: 'resultats', libelle: 'Résultats', type: 'texte', multiligne: true, defaut: '......' },
      { code: 'conclusion', libelle: 'Conclusion', type: 'texte', multiligne: true, defaut: '......' },
    ],
  },
];
