import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/** Champs de la fiche de référence / contre-référence (même modèle que la fiche officielle HGF). */
export interface ReferenceDto {
  transfertUrgent?: boolean;
  nomPrenoms?: string;
  age?: string;
  sexe?: string;
  numeroSecu?: string;
  adresseTel?: string;
  numeroRegistreSig?: string;
  districtSanitaire?: string;
  dateAdmission?: string;
  heureAdmission?: string;
  agentNom?: string;
  agentPrenom?: string;
  agentContact?: string;
  institutionReference?: string;
  serviceReference?: string;
  dateHeureDecision?: string;
  diagnostic?: string;
  examensCliniques?: string;
  antecedentsMedicaux?: string;
  antecedentsChirurgicaux?: string;
  antecedentsGyneco?: string;
  allergie?: string;
  groupeSanguin?: string;
  motifReference?: string;
  traitementRecu?: string;
  depuisQuand?: string;
  modeEvacuation?: string;
  modeEvacuationAutre?: string;
  dateHeureDepart?: string;
  // Contre-référence
  contreNomPrenoms?: string;
  contreNumeroDossier?: string;
  contreDateArrivee?: string;
  contreDiagnostic?: string;
  contreHospitalise?: boolean;
  contreTraitement?: string;
  contreMedecin?: string;
  contreDateSignature?: string;
}

@Injectable()
export class ReferencesService {
  constructor(private prisma: PrismaService) {}

  private async prochainNumero(cliniqueId: number) {
    const nb = await this.prisma.ficheReference.count({ where: { cliniqueId } });
    return `REF-${String(nb + 1).padStart(4, '0')}`;
  }

  /** Crée une fiche de référence pour un passage (patient non externe). */
  async creer(passageId: number, dto: ReferenceDto, utilisateurId: number) {
    const passage = await this.prisma.passage.findUnique({
      where: { id: passageId },
      include: { patient: true, service: { select: { nom: true } } },
    });
    if (!passage) throw new NotFoundException('Passage introuvable.');
    if (passage.typePatient === 'EXTERNE') {
      throw new BadRequestException(
        'La fiche de référence ne concerne pas les patients externes.',
      );
    }

    // Préremplissage depuis le dossier du patient
    const p = passage.patient;
    const data: any = {
      cliniqueId: passage.cliniqueId,
      passageId,
      patientId: passage.patientId,
      numero: await this.prochainNumero(passage.cliniqueId),
      etabliParId: utilisateurId,
      nomPrenoms: dto.nomPrenoms ?? `${p.nom ?? ''} ${p.prenom ?? ''}`.trim(),
      age: dto.age ?? p.age ?? null,
      sexe: dto.sexe ?? p.sexe ?? null,
      numeroSecu: dto.numeroSecu ?? p.numeroCmu ?? null,
      adresseTel:
        dto.adresseTel ??
        ([p.ville, p.quartier, p.telephone].filter(Boolean).join(' / ') || null),
      numeroRegistreSig: dto.numeroRegistreSig ?? p.numeroDossier ?? null,
      districtSanitaire: dto.districtSanitaire ?? null,
      dateAdmission: dto.dateAdmission ? new Date(dto.dateAdmission) : null,
      serviceReference: dto.serviceReference ?? passage.service?.nom ?? null,
      ...this.champs(dto),
    };
    return this.prisma.ficheReference.create({ data });
  }

  private champs(dto: ReferenceDto) {
    const clefs: (keyof ReferenceDto)[] = [
      'transfertUrgent', 'heureAdmission', 'agentNom', 'agentPrenom', 'agentContact',
      'institutionReference', 'dateHeureDecision', 'diagnostic', 'examensCliniques',
      'antecedentsMedicaux', 'antecedentsChirurgicaux', 'antecedentsGyneco',
      'allergie', 'groupeSanguin', 'motifReference', 'traitementRecu', 'depuisQuand',
      'modeEvacuation', 'modeEvacuationAutre', 'dateHeureDepart',
      'contreNomPrenoms', 'contreNumeroDossier', 'contreDateArrivee', 'contreDiagnostic',
      'contreHospitalise', 'contreTraitement', 'contreMedecin', 'contreDateSignature',
    ];
    const out: any = {};
    for (const c of clefs) {
      if (dto[c] !== undefined) out[c] = dto[c] === '' ? null : dto[c];
    }
    return out;
  }

  /** Fiches d'un passage. */
  async parPassage(passageId: number) {
    return this.prisma.ficheReference.findMany({
      where: { passageId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Toutes les fiches d'un patient (dossier du malade). */
  async parPatient(patientId: number) {
    return this.prisma.ficheReference.findMany({
      where: { patientId },
      include: {
        passage: { select: { numeroOrdre: true, createdAt: true } },
        etabliPar: {
          select: { matricule: true, personnel: { select: { nom: true, prenom: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Complète / corrige une fiche (notamment la partie contre-référence). */
  async modifier(id: number, dto: ReferenceDto) {
    const f = await this.prisma.ficheReference.findUnique({ where: { id } });
    if (!f) throw new NotFoundException('Fiche introuvable.');
    return this.prisma.ficheReference.update({
      where: { id },
      data: {
        ...this.champs(dto),
        dateAdmission: dto.dateAdmission ? new Date(dto.dateAdmission) : undefined,
      },
    });
  }

  /** Impression A4 : même présentation que la fiche officielle HGF. */
  async imprimer(id: number) {
    const fiche = await this.prisma.ficheReference.findUnique({
      where: { id },
      include: {
        patient: true,
        passage: { select: { numeroOrdre: true } },
        clinique: { select: { nom: true, adresse: true, telephone: true } },
        etabliPar: {
          select: { matricule: true, personnel: { select: { nom: true, prenom: true } } },
        },
      },
    });
    if (!fiche) throw new NotFoundException('Fiche introuvable.');

    const fmt = (d?: Date | null) =>
      d ? new Date(d).toLocaleDateString('fr-FR') : '............................';
    const ligne = (libelle: string, valeur: string) =>
      `<div class="ligne"><span class="lib">${libelle} :</span><span class="val">${valeur || '....................'}</span></div>`;

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11.5px; color: #000; margin: 10mm; }
  .entete { text-align: center; margin-bottom: 2mm; }
  .rep { font-weight: 800; font-size: 12px; }
  .min { font-size: 10.5px; }
  .titre { text-align: center; font-weight: 800; font-size: 13px; text-decoration: underline; margin: 3mm 0; }
  .regle { border-bottom: 1px solid #000; margin: 2mm 0; }
  .ligne { display: flex; gap: 6px; margin-bottom: 1.2mm; }
  .ligne .lib { font-weight: 700; min-width: 62mm; }
  .ligne .val { border-bottom: 0.4px dotted #000; flex: 1; }
  .section { font-weight: 800; margin: 4mm 0 2mm; }
  .case { display: inline-block; border: 1px solid #000; width: 5mm; height: 4mm; vertical-align: middle; }
  .sign { margin-top: 8mm; display: flex; justify-content: space-between; }
</style></head><body>
  <div class="entete">
    <div class="rep">RÉPUBLIQUE DE CÔTE D'IVOIRE</div>
    <div class="min">Union - Discipline - Travail</div>
    <div class="min">MINISTÈRE DE LA SANTÉ, DE L'HYGIÈNE PUBLIQUE ET DE LA COUVERTURE MALADIE UNIVERSELLE</div>
  </div>
  <div class="titre">FORMULAIRE DE RÉFÉRENCE ET CONTRE-RÉFÉRENCE</div>
  <div class="ligne"><span class="lib">Direction régionale de :</span><span class="val"></span>
    <span class="lib">District sanitaire de :</span><span class="val">${fiche.districtSanitaire || ''}</span></div>
  <div class="regle"></div>

  <div class="section">1- INFORMATIONS DE RÉFÉRENCE</div>
  ${ligne('Transfert urgent', fiche.transfertUrgent == null ? 'OUI [ ] NON [ ]' : fiche.transfertUrgent ? 'OUI [X] NON [ ]' : 'OUI [ ] NON [X]')}
  ${ligne('Nom et Prénoms', fiche.nomPrenoms ?? '')}
  ${ligne('Âge', fiche.age ?? '')}
  ${ligne('Sexe', fiche.sexe ?? '')}
  ${ligne('N° de Sécurité sociale', fiche.numeroSecu ?? '')}
  ${ligne('Adresse / Tél', fiche.adresseTel ?? '')}
  ${ligne('N° Registre SIG', fiche.numeroRegistreSig ?? '')}
  ${ligne('Date d\'admission', fmt(fiche.dateAdmission))}
  ${ligne('Heure d\'admission', fiche.heureAdmission ?? '')}
  ${ligne('Agent qui réfère', `${fiche.agentNom ?? ''} ${fiche.agentPrenom ?? ''}`.trim())}
  ${ligne('Contact', fiche.agentContact ?? '')}
  ${ligne('Institution de référence', fiche.institutionReference ?? fiche.clinique?.nom ?? '')}
  ${ligne('Service', fiche.serviceReference ?? '')}
  ${ligne('Date/heure de décision d\'évacuation', fiche.dateHeureDecision ?? '')}
  ${ligne('Diagnostic', fiche.diagnostic ?? '')}
  ${ligne('Examens cliniques', fiche.examensCliniques ?? '')}
  ${ligne('Antécédents médicaux / chirurgicaux / gynéco-obstétricaux', `${fiche.antecedentsMedicaux ?? ''} / ${fiche.antecedentsChirurgicaux ?? ''} / ${fiche.antecedentsGyneco ?? ''}`)}
  ${ligne('Allergie', fiche.allergie ?? '')}
  ${ligne('Groupe sanguin et Rhésus', fiche.groupeSanguin ?? '')}
  ${ligne('Motif de référence', fiche.motifReference ?? '')}
  ${ligne('Traitement reçu au centre', fiche.traitementRecu ?? '')}
  ${ligne('Depuis quand', fiche.depuisQuand ?? '')}
  ${ligne('Mode d\'évacuation', fiche.modeEvacuation === 'AMBULANCE' ? '[X] Ambulance  [ ] Taxi/véhicule personnel  [ ] Autre' : fiche.modeEvacuation === 'VEHICULE_PERSONNEL' ? '[ ] Ambulance  [X] Taxi/véhicule personnel  [ ] Autre' : fiche.modeEvacuation === 'AUTRE' ? `[ ] Ambulance  [ ] Taxi/véhicule personnel  [X] Autre : ${fiche.modeEvacuationAutre ?? ''}` : '[ ] Ambulance  [ ] Taxi/véhicule personnel  [ ] Autre')}
  ${ligne('Date, heure de départ effectif', fiche.dateHeureDepart ?? '')}

  <div class="section">2- INFORMATIONS DE CONTRE-RÉFÉRENCE (à recevoir par l'agent qui a référé)</div>
  ${ligne('Nom et Prénoms du malade', fiche.contreNomPrenoms ?? fiche.nomPrenoms ?? '')}
  ${ligne('Numéro du dossier', fiche.contreNumeroDossier ?? fiche.passage?.numeroOrdre ?? '')}
  ${ligne('Date/heure d\'arrivée', fiche.contreDateArrivee ?? '')}
  ${ligne('Diagnostic retenu à la sortie du malade', fiche.contreDiagnostic ?? '')}
  ${ligne('Le patient a été hospitalisé', fiche.contreHospitalise == null ? 'OUI [ ] NON [ ]' : fiche.contreHospitalise ? 'OUI [X] NON [ ]' : 'OUI [ ] NON [X]')}
  ${ligne('Traitement à suivre', fiche.contreTraitement ?? '')}
  ${ligne('Nom et fonction du médecin responsable', fiche.contreMedecin ?? '')}
  ${ligne('Date et signature', fiche.contreDateSignature ?? '')}

  <div class="sign">
    <div>Fiche établie par : ${fiche.etabliPar?.personnel ? `${fiche.etabliPar.personnel.nom} ${fiche.etabliPar.personnel.prenom}` : ''}</div>
    <div>${fiche.numero}</div>
  </div>
</body></html>`;

    const config = await this.prisma.imprimante.findFirst({
      where: { cliniqueId: fiche.cliniqueId, poste: 'A4', actif: true },
    });
    await this.prisma.impressionFile.create({
      data: {
        cliniqueId: fiche.cliniqueId,
        poste: 'A4',
        libelle: `Fiche référence ${fiche.numero} — ${fiche.patient.nom} ${fiche.patient.prenom}`,
        contenu: html,
        format: 'A4',
        partage: config?.nom ?? null,
        nom: config?.nom ?? null,
        statut: 'EN_ATTENTE',
      },
    });
    return { ok: true, message: 'Fiche envoyée à l’imprimante A4 du poste.' };
  }
}
