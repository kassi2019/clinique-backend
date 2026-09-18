// ============================================================
//  Seed — données initiales du module Paramétrage
//  Exécution : npx prisma db seed
// ============================================================
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Modules applicatifs (cf. écran de sélection §16.1)
const MODULES = [
  { code: 'ACCUEIL', nom: 'Accueil', description: 'Enregistrement des patients et des passages' },
  { code: 'CAISSE', nom: 'Caisse', description: 'Paiements, reçus et activation des actes' },
  { code: 'CONSULTATION', nom: 'Consultation', description: 'Dossiers médicaux, diagnostics et prescriptions' },
  { code: 'PHARMACIE', nom: 'Pharmacie', description: 'Ordonnances, stocks et consommables' },
  { code: 'LABORATOIRE', nom: 'Laboratoire', description: 'Examens, prélèvements et résultats' },
  { code: 'IMAGERIE', nom: 'Imagerie', description: 'Échographies et comptes rendus' },
  { code: 'MATERNITE', nom: 'Maternité', description: 'CPN, accouchements et suivi' },
  { code: 'HOSPITALISATION', nom: 'Hospitalisation', description: 'Chambres, lits et séjours' },
  { code: 'SOINS', nom: 'Soins', description: 'Prescriptions et réalisation des soins' },
  { code: 'STATISTIQUES', nom: 'Statistiques', description: 'Tableaux de bord et rapports' },
  { code: 'PARAMETRAGE', nom: 'Paramétrage', description: 'Personnel, utilisateurs, rôles et référentiels' },
];

async function main() {
  // ---------- 1. Clinique ----------
  const clinique = await prisma.clinique.upsert({
    where: { code: 'CLI001' },
    update: {},
    create: {
      code: 'CLI001',
      nom: 'Clinique Centrale',
      adresse: 'Abidjan, Côte d\'Ivoire',
    },
  });

  // ---------- 2. Modules ----------
  for (const m of MODULES) {
    await prisma.module.upsert({
      where: { code: m.code },
      update: { nom: m.nom, description: m.description },
      create: m,
    });
  }
  const modules = await prisma.module.findMany();

  // ---------- 3. Services de la clinique ----------
  const servicesData = [
    { code: 'ACC', nom: 'Accueil' },
    { code: 'CAI', nom: 'Caisse' },
    { code: 'MED', nom: 'Médecine générale' },
    { code: 'MAT', nom: 'Maternité' },
    { code: 'PHA', nom: 'Pharmacie' },
    { code: 'LAB', nom: 'Laboratoire' },
    { code: 'IMA', nom: 'Imagerie médicale' },
    { code: 'HOS', nom: 'Hospitalisation' },
    { code: 'SOI', nom: 'Soins' },
    { code: 'BLO', nom: 'Bloc opératoire' },
    { code: 'CON', nom: 'Constante' },
  ];
  for (const s of servicesData) {
    await prisma.service.upsert({
      where: { cliniqueId_code: { cliniqueId: clinique.id, code: s.code } },
      update: { nom: s.nom },
      create: { ...s, cliniqueId: clinique.id },
    });
  }
  const services = await prisma.service.findMany({ where: { cliniqueId: clinique.id } });
  const serviceByCode = Object.fromEntries(services.map((s) => [s.code, s]));

  // Types de chambres par défaut (§13) : référentiel paramétrable
  const typesChambresData = ['Simple', 'Double', 'Suite'];
  for (const t of typesChambresData) {
    await prisma.typeChambre.upsert({
      where: { cliniqueId_libelle: { cliniqueId: clinique.id, libelle: t } },
      update: {},
      create: { cliniqueId: clinique.id, libelle: t },
    });
  }

  // ---------- 4. Rôles ----------
  const roleAdmin = await prisma.role.upsert({
    where: { code: 'ADMINISTRATEUR' },
    update: {},
    create: { code: 'ADMINISTRATEUR', nom: 'Administrateur', description: 'Paramétrage général et gestion des habilitations' },
  });
  // L'administrateur a accès à tous les modules
  await prisma.roleModule.deleteMany({ where: { roleId: roleAdmin.id } });
  for (const m of modules) {
    await prisma.roleModule.create({
      data: { roleId: roleAdmin.id, moduleId: m.id, lecture: true, ecriture: true, validation: true },
    });
  }

  const roleAccueil = await prisma.role.upsert({
    where: { code: 'ACCUEIL' },
    update: {},
    create: { code: 'ACCUEIL', nom: 'Agent d\'accueil', description: 'Gestion des patients et passages' },
  });
  await prisma.roleModule.deleteMany({ where: { roleId: roleAccueil.id } });
  for (const m of modules.filter((x) => x.code === 'ACCUEIL')) {
    await prisma.roleModule.create({
      data: { roleId: roleAccueil.id, moduleId: m.id, lecture: true, ecriture: true, validation: false },
    });
  }

  const roleCaisse = await prisma.role.upsert({
    where: { code: 'CAISSE' },
    update: {},
    create: { code: 'CAISSE', nom: 'Caissier', description: 'Gestion des paiements et reçus' },
  });
  await prisma.roleModule.deleteMany({ where: { roleId: roleCaisse.id } });
  for (const m of modules.filter((x) => ['ACCUEIL', 'CAISSE'].includes(x.code))) {
    await prisma.roleModule.create({
      data: { roleId: roleCaisse.id, moduleId: m.id, lecture: true, ecriture: true, validation: false },
    });
  }

  const roleMedecin = await prisma.role.upsert({
    where: { code: 'MEDECIN' },
    update: {},
    create: { code: 'MEDECIN', nom: 'Médecin', description: 'Consultation, prescriptions et modules autorisés' },
  });
  await prisma.roleModule.deleteMany({ where: { roleId: roleMedecin.id } });
  for (const m of modules.filter((x) => ['CONSULTATION', 'MATERNITE', 'STATISTIQUES'].includes(x.code))) {
    await prisma.roleModule.create({
      data: { roleId: roleMedecin.id, moduleId: m.id, lecture: true, ecriture: true, validation: true },
    });
  }

  const roleLaboratoire = await prisma.role.upsert({
    where: { code: 'LABORATOIRE' },
    update: {},
    create: { code: 'LABORATOIRE', nom: 'Technicien de laboratoire', description: 'Prélèvements, résultats et comptes rendus' },
  });
  await prisma.roleModule.deleteMany({ where: { roleId: roleLaboratoire.id } });
  for (const m of modules.filter((x) => x.code === 'LABORATOIRE')) {
    await prisma.roleModule.create({
      data: { roleId: roleLaboratoire.id, moduleId: m.id, lecture: true, ecriture: true, validation: true },
    });
  }

  const roleImagerie = await prisma.role.upsert({
    where: { code: 'IMAGERIE' },
    update: {},
    create: { code: 'IMAGERIE', nom: 'Technicien d\'imagerie', description: 'Échographies, comptes rendus et historique' },
  });
  await prisma.roleModule.deleteMany({ where: { roleId: roleImagerie.id } });
  for (const m of modules.filter((x) => x.code === 'IMAGERIE')) {
    await prisma.roleModule.create({
      data: { roleId: roleImagerie.id, moduleId: m.id, lecture: true, ecriture: true, validation: true },
    });
  }

  const roleHospitalisation = await prisma.role.upsert({
    where: { code: 'HOSPITALISATION' },
    update: {},
    create: { code: 'HOSPITALISATION', nom: 'Agent d\'hospitalisation', description: 'Admissions, chambres, lits et sorties' },
  });
  await prisma.roleModule.deleteMany({ where: { roleId: roleHospitalisation.id } });
  for (const m of modules.filter((x) => x.code === 'HOSPITALISATION')) {
    await prisma.roleModule.create({
      data: { roleId: roleHospitalisation.id, moduleId: m.id, lecture: true, ecriture: true, validation: true },
    });
  }

  // ---------- 5. Personnel administrateur + compte ----------
  const adminPersonnel = await prisma.personnel.upsert({
    where: { cliniqueId_matricule: { cliniqueId: clinique.id, matricule: 'ADM001' } },
    update: {},
    create: {
      cliniqueId: clinique.id,
      matricule: 'ADM001',
      nom: 'Administrateur',
      prenom: 'Principal',
      sexe: 'M',
      fonction: 'Administrateur',
      serviceId: serviceByCode['ACCUEIL']?.id ?? null,
      statut: 'ACTIF',
    },
  });

  const adminCompte = await prisma.utilisateur.findUnique({ where: { matricule: 'admin' } });
  if (!adminCompte) {
    const motDePasse = await bcrypt.hash('admin123', 10);
    await prisma.utilisateur.create({
      data: {
        personnelId: adminPersonnel.id,
        matricule: 'admin',
        motDePasse,
        roleId: roleAdmin.id,
        statut: 'ACTIF',
      },
    });
    console.log('Compte admin créé : admin / admin123');
  } else {
    console.log('Compte admin déjà présent.');
  }

  // ---------- 6. Prestations d'exemple ----------
  const prestationsData = [
    { code: 'CONS-GEN', libelle: 'Consultation générale', type: 'CONSULTATION', montant: 5000, service: 'MED' },
    { code: 'CONS-SPEC', libelle: 'Consultation spécialisée', type: 'CONSULTATION', montant: 10000, service: 'MED' },
    { code: 'CPN', libelle: 'Consultation prénatale (CPN)', type: 'MATERNITE', montant: 3000, service: 'MAT' },
    { code: 'ACCOUCHEMENT', libelle: 'Accouchement simple', type: 'MATERNITE', montant: 50000, service: 'MAT' },
    { code: 'ECHO-OBST', libelle: 'Échographie obstétricale', type: 'IMAGERIE', montant: 10000, service: 'IMA' },
    { code: 'ECHO-ABDO', libelle: 'Échographie abdominale', type: 'IMAGERIE', montant: 10000, service: 'IMA' },
    { code: 'NFS', libelle: 'Numération formule sanguine (NFS)', type: 'EXAMEN_LABO', montant: 4000, service: 'LAB' },
    { code: 'GLYCEMIE', libelle: 'Glycémie à jeun', type: 'EXAMEN_LABO', montant: 2000, service: 'LAB' },
    { code: 'HOSP-JOUR', libelle: 'Hospitalisation — journée', type: 'HOSPITALISATION', montant: 15000, service: 'HOS' },
  ];
  for (const p of prestationsData) {
    await prisma.prestation.upsert({
      where: { cliniqueId_code: { cliniqueId: clinique.id, code: p.code } },
      update: { libelle: p.libelle, montant: p.montant },
      create: {
        cliniqueId: clinique.id,
        serviceId: serviceByCode[p.service].id,
        code: p.code,
        libelle: p.libelle,
        type: p.type,
        montant: p.montant,
      },
    });
  }

  // ---------- 7. Catalogue de médicaments ----------
  const medicamentsData = [
    { nom: 'Paracétamol', forme: 'Comprimé', dosage: '500 mg', stock: 50, prixVente: 1000, seuilAlerte: 10, uniteVente: 'PLAQUE' },
    { nom: 'Amoxicilline', forme: 'Gélule', dosage: '500 mg', stock: 30, prixVente: 2500, seuilAlerte: 10, uniteVente: 'BOITE' },
    { nom: 'Ibuprofène', forme: 'Comprimé', dosage: '400 mg', stock: 25, prixVente: 1500, seuilAlerte: 5, uniteVente: 'PLAQUE' },
    { nom: 'Amoxicilline + Acide clavulanique', forme: 'Comprimé', dosage: '1 g', stock: 15, prixVente: 4000, seuilAlerte: 5, uniteVente: 'BOITE' },
    { nom: 'Métronidazole', forme: 'Comprimé', dosage: '500 mg', stock: 20, prixVente: 1200, seuilAlerte: 5, uniteVente: 'PLAQUE' },
    { nom: 'Artéméther + Luméfantrine', forme: 'Comprimé', dosage: '80/480 mg', stock: 40, prixVente: 3500, seuilAlerte: 10, uniteVente: 'BOITE' },
    { nom: 'Sérum de réhydratation orale (SRO)', forme: 'Sachet', dosage: '20,5 g', stock: 60, prixVente: 500, seuilAlerte: 10, uniteVente: 'BOITE' },
    { nom: 'Diazépam', forme: 'Comprimé', dosage: '10 mg', stock: 0, prixVente: 800, seuilAlerte: 5, uniteVente: 'PLAQUE' },
    { nom: 'Salbutamol', forme: 'Aérosol', dosage: '100 µg/dose', stock: 12, prixVente: 3000, seuilAlerte: 3, uniteVente: 'BOITE' },
  ];
  for (const m of medicamentsData) {
    await prisma.medicament.upsert({
      where: { cliniqueId_nom: { cliniqueId: clinique.id, nom: m.nom } },
      update: {
        forme: m.forme,
        dosage: m.dosage,
        prixVente: m.prixVente,
        seuilAlerte: m.seuilAlerte,
        uniteVente: m.uniteVente,
      },
      create: { cliniqueId: clinique.id, ...m },
    });
    // Lot initial correspondant au stock de départ
    const med = await prisma.medicament.findUnique({
      where: { cliniqueId_nom: { cliniqueId: clinique.id, nom: m.nom } },
    });
    const nbLots = await prisma.lot.count({ where: { medicamentId: med.id } });
    if (nbLots === 0 && med.stock > 0) {
      await prisma.lot.create({
        data: {
          medicamentId: med.id,
          numeroLot: `LOT-INIT-${med.id}`,
          quantiteInitiale: med.stock,
          quantiteRestante: med.stock,
          datePeremption: new Date('2027-12-31'),
        },
      });
    }
  }

  console.log('Seed terminé avec succès.');
  console.log('Connexion admin : matricule "admin" / mot de passe "admin123"');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
