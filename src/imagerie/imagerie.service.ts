import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EnregistrerCrDto } from './dto/imagerie.dto';
import { critereNomPrenoms } from '../common/recherche-patient';

const N = (x: any) => Number(x);

const includeExamen = {
  validePar: {
    select: {
      matricule: true,
      personnel: { select: { nom: true, prenom: true } },
    },
  },
} satisfies Prisma.ExamenImagerieInclude;

@Injectable()
export class ImagerieService {
  constructor(private prisma: PrismaService) {}

  /** Service IMA de la clinique : les examens d'imagerie lui sont rattachés. */
  private async imaServiceId(cliniqueId: number) {
    const ima = await this.prisma.service.findFirst({
      where: { cliniqueId, code: 'IMA' },
    });
    return ima?.id ?? null;
  }

  /**
   * Recherche des passages dont le code est actif et qui portent des examens IMA payés (§12).
   * Recherche par N° d'ordre (tirets conservés), code patient (sans séparateurs), nom ou prénom.
   */
  async fileAttente(cliniqueId: number) {
    const imaId = await this.imaServiceId(cliniqueId);
    if (!imaId) return [];
    const passages = await this.prisma.passage.findMany({
      where: {
        cliniqueId,
        statut: 'ACTIF',
        prestations: {
          some: {
            statut: { in: ['PAYEE', 'CREDIT', 'CAS_SOCIAL'] },
            OR: [{ serviceId: imaId }, { prestation: { serviceId: imaId } }],
          },
        },
      },
      include: {
        patient: true,
        service: { select: { nom: true } },
        prestations: {
          where: {
            statut: { in: ['PAYEE', 'CREDIT', 'CAS_SOCIAL'] },
            OR: [{ serviceId: imaId }, { prestation: { serviceId: imaId } }],
          },
        },
        examensImagerie: { select: { passagePrestationId: true, statut: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    return passages
      .filter((p) =>
        p.prestations.some((l) => {
          const examen = p.examensImagerie.find((e) => e.passagePrestationId === l.id);
          return !examen || examen.statut !== 'VALIDE';
        }),
      )
      .map((p) => ({
        id: p.id,
        numeroOrdre: p.numeroOrdre,
        patient: p.patient,
        service: p.service,
        createdAt: p.createdAt,
        nbExamens: p.prestations.filter((l) => {
          const examen = p.examensImagerie.find((e) => e.passagePrestationId === l.id);
          return !examen || examen.statut !== 'VALIDE';
        }).length,
      }));
  }

  async rechercher(reference: string, cliniqueId: number) {
    const ref = reference.trim().toUpperCase();
    const refSans = ref.replace(/[\s-]/g, '');
    if (!ref) return [];

    const imaId = await this.imaServiceId(cliniqueId);
    if (!imaId) return [];

    const filtreImaPayes = {
      statut: { in: ['PAYEE', 'CREDIT', 'CAS_SOCIAL'] },
      OR: [{ serviceId: imaId }, { prestation: { serviceId: imaId } }],
    };

    const passages = await this.prisma.passage.findMany({
      where: {
        cliniqueId,
        statut: 'ACTIF',
        OR: [
          { numeroOrdre: { contains: ref } },
          { patient: { is: { code: refSans } } },
          { patient: { is: critereNomPrenoms(ref) } },
        ],
        prestations: { some: filtreImaPayes },
      },
      include: {
        patient: true,
        service: { select: { id: true, code: true, nom: true } },
        prestations: {
          where: filtreImaPayes,
          include: { service: { select: { nom: true } } },
        },
        examensImagerie: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return passages.map((p) => ({
      id: p.id,
      numeroOrdre: p.numeroOrdre,
      statut: p.statut,
      createdAt: p.createdAt,
      patient: p.patient,
      service: p.service,
      examensPayes: p.prestations.map((l) => ({ ...l, montant: N(l.montant) })),
      nbExamensIma: p.prestations.length,
      nbExamensTraites: p.examensImagerie.length,
    }));
  }

  /** Détail d'un passage : fiche patient, prestations, examens et historique du patient. */
  async detailPassage(passageId: number) {
    const passage = await this.prisma.passage.findUnique({
      where: { id: passageId },
      include: {
        patient: true,
        service: { select: { id: true, code: true, nom: true } },
        prestations: {
          include: {
            service: { select: { id: true, code: true, nom: true } },
            prestation: { select: { type: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
        examensImagerie: { include: includeExamen, orderBy: { createdAt: 'asc' } },
      },
    });
    if (!passage) throw new NotFoundException('Passage introuvable.');

    // Historique des examens du patient (tous passages confondus)
    const historique = await this.prisma.examenImagerie.findMany({
      where: { patientId: passage.patientId },
      include: {
        passage: {
          select: {
            numeroOrdre: true,
            createdAt: true,
            service: { select: { nom: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      passage: {
        id: passage.id,
        numeroOrdre: passage.numeroOrdre,
        statut: passage.statut,
        typePatient: passage.typePatient,
        referent: passage.referent,
        prestationDemandee: passage.prestationDemandee,
        createdAt: passage.createdAt,
        patient: passage.patient,
        service: passage.service,
        prestations: passage.prestations.map((l) => ({ ...l, montant: N(l.montant) })),
        examens: passage.examensImagerie,
      },
      historique,
    };
  }

  /**
   * Enregistre le compte rendu d'un examen IMA payé (4 sections).
   * Création paresseuse et idempotente (statut RESULTATS) ; verrouillé après validation.
   */
  async enregistrerCr(passageId: number, dto: EnregistrerCrDto, utilisateurId?: number) {
    const passage = await this.prisma.passage.findUnique({ where: { id: passageId } });
    if (!passage) throw new NotFoundException('Passage introuvable.');
    if (passage.statut !== 'ACTIF') {
      throw new BadRequestException('Code non activé : paiement requis.');
    }

    const imaId = await this.imaServiceId(passage.cliniqueId);
    if (!imaId) throw new BadRequestException('Aucun service d\'imagerie configuré.');

    const ligne = await this.prisma.passagePrestation.findFirst({
      where: { id: dto.passagePrestationId, passageId, statut: { in: ['PAYEE', 'CREDIT', 'CAS_SOCIAL'] } },
      include: { prestation: true },
    });
    if (!ligne) throw new BadRequestException('Examen non payé ou inexistant.');
    if (ligne.serviceId !== imaId && ligne.prestation?.serviceId !== imaId) {
      throw new BadRequestException('Cette prestation ne relève pas de l\'imagerie.');
    }

    const existant = await this.prisma.examenImagerie.findUnique({
      where: { passagePrestationId: ligne.id },
    });
    if (existant && existant.statut === 'VALIDE') {
      throw new BadRequestException('Examen déjà validé : compte rendu verrouillé.');
    }
    if (
      !dto.indication?.trim() &&
      !dto.technique?.trim() &&
      !dto.resultat?.trim() &&
      !dto.conclusion?.trim()
    ) {
      throw new BadRequestException('Renseignez au moins une section du compte rendu.');
    }

    return this.prisma.examenImagerie.upsert({
      where: { passagePrestationId: ligne.id },
      update: {
        indication: dto.indication ?? null,
        technique: dto.technique ?? null,
        resultat: dto.resultat ?? null,
        conclusion: dto.conclusion ?? null,
        saisiParId: utilisateurId ?? undefined,
        // ne touche jamais statut / validation
      },
      create: {
        passageId,
        passagePrestationId: ligne.id,
        cliniqueId: passage.cliniqueId,
        patientId: passage.patientId,
        saisiParId: utilisateurId ?? null,
        libelle: ligne.libelle,
        indication: dto.indication ?? null,
        technique: dto.technique ?? null,
        resultat: dto.resultat ?? null,
        conclusion: dto.conclusion ?? null,
      },
      include: includeExamen,
    });
  }

  /** Validation du compte rendu (§12) : le CR doit avoir été saisi. */
  async valider(examenId: number, utilisateurId: number) {
    const examen = await this.prisma.examenImagerie.findUnique({
      where: { id: examenId },
    });
    if (!examen) throw new NotFoundException('Examen introuvable.');
    if (examen.statut !== 'RESULTATS') {
      throw new BadRequestException('Saisir le compte rendu avant validation.');
    }
    return this.prisma.examenImagerie.update({
      where: { id: examenId },
      data: { statut: 'VALIDE', valideParId: utilisateurId, valideLe: new Date() },
      include: includeExamen,
    });
  }

  /** Historique des examens réalisés, paginé (défaut : jour courant). */
  async historique(params: {
    jour?: string;
    recherche?: string;
    page: number;
    perPage: number;
    cliniqueId: number;
  }) {
    const { jour, recherche, page, perPage, cliniqueId } = params;
    const jourRef =
      jour && /^\d{4}-\d{2}-\d{2}$/.test(jour) ? jour : new Date().toISOString().slice(0, 10);
    const debut = new Date(`${jourRef}T00:00:00`);
    const fin = new Date(`${jourRef}T23:59:59.999`);

    const where: Prisma.ExamenImagerieWhereInput = {
      cliniqueId,
      createdAt: { gte: debut, lte: fin },
    };
    const ref = recherche?.trim().toUpperCase();
    if (ref) {
      where.OR = [
        { passage: { numeroOrdre: { contains: ref } } },
        { patient: { nom: { contains: ref } } },
        { patient: { prenom: { contains: ref } } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.examenImagerie.findMany({
        where,
        include: {
          passage: { select: { numeroOrdre: true, createdAt: true } },
          patient: { select: { nom: true, prenom: true, code: true, sexe: true, age: true } },
          validePar: { select: { personnel: { select: { nom: true, prenom: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.examenImagerie.count({ where }),
    ]);

    return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
  }

  // ─────────────────── Fiches d'échographie ───────────────────

  /** Parse la liste des champs d'un type (colonne JSON, tolérante aux erreurs). */
  private parseChamps(champsJson?: string | null): any[] {
    if (!champsJson) return [];
    try {
      const v = JSON.parse(champsJson);
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  }

  /**
   * Remplace les marqueurs {code} du format par les valeurs saisies.
   * Champ vide → texte par défaut du champ (souvent « ...... » ou la liste
   * des options du papier). Date AAAA-MM-JJ → JJ/MM/AAAA.
   */
  private genererTexte(texte: string, champs: any[], valeurs: Record<string, any>): string {
    return String(texte ?? '').replace(/\{(\w+)\}/g, (tout, code: string) => {
      const champ = (champs ?? []).find((c) => c.code === code);
      const v = valeurs && valeurs[code] != null ? String(valeurs[code]).trim() : '';
      if (v) {
        if (champ?.type === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(v)) {
          const [a, m, j] = v.split('-');
          return `${j}/${m}/${a}`;
        }
        return v;
      }
      return champ?.defaut ?? '......';
    });
  }

  /** Types de fiches actifs (liste déroulante). */
  async fichesTypes(cliniqueId: number) {
    return this.prisma.ficheEchographie.findMany({
      where: { cliniqueId, actif: true },
      orderBy: { libelle: 'asc' },
    });
  }

  async creerFicheType(dto: { cliniqueId: number; libelle: string; titre?: string; texte: string; champs?: string }) {
    return this.prisma.ficheEchographie.create({
      data: {
        cliniqueId: dto.cliniqueId,
        libelle: dto.libelle,
        titre: dto.titre,
        texte: dto.texte,
        champs: dto.champs,
      },
    });
  }

  async modifierFicheType(id: number, dto: { libelle?: string; titre?: string; texte?: string; champs?: string; actif?: boolean }) {
    return this.prisma.ficheEchographie.update({
      where: { id },
      data: {
        libelle: dto.libelle,
        titre: dto.titre,
        texte: dto.texte,
        champs: dto.champs,
        actif: dto.actif,
      },
    });
  }

  async basculerFicheType(id: number) {
    const t = await this.prisma.ficheEchographie.findUnique({ where: { id } });
    if (!t) throw new NotFoundException('Type de fiche introuvable.');
    return this.prisma.ficheEchographie.update({
      where: { id },
      data: { actif: !t.actif },
    });
  }

  /** Fiches enregistrées d'un passage. */
  async fichesPassage(passageId: number) {
    return this.prisma.ficheExamenImagerie.findMany({
      where: { passageId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Enregistre une fiche d'échographie : valeurs saisies (JSON) + texte généré
   * (valeurs fusionnées dans le format), ou texte libre fourni tel quel.
   */
  async creerFiche(
    passageId: number,
    dto: { typeFicheId: number; texte?: string; valeurs?: Record<string, any>; indication?: string; prescripteur?: string },
    medecinId: number,
  ) {
    const passage = await this.prisma.passage.findUnique({ where: { id: passageId } });
    if (!passage) throw new NotFoundException('Passage introuvable.');
    const type = await this.prisma.ficheEchographie.findUnique({ where: { id: dto.typeFicheId } });
    if (!type) throw new NotFoundException('Type de fiche introuvable.');

    const champs = this.parseChamps(type.champs);
    const valeurs = dto.valeurs ?? {};
    const texte = dto.texte?.trim()
      ? dto.texte
      : this.genererTexte(type.texte, champs, valeurs);
    if (!texte.trim()) throw new BadRequestException('Le texte du compte rendu est vide.');

    return this.prisma.ficheExamenImagerie.create({
      data: {
        cliniqueId: passage.cliniqueId,
        passageId,
        patientId: passage.patientId,
        typeFicheId: type.id,
        libelleType: type.libelle,
        texte,
        valeurs: Object.keys(valeurs).length ? JSON.stringify(valeurs) : null,
        indication: dto.indication,
        prescripteur: dto.prescripteur,
        medecinId,
      },
    });
  }

  async modifierFiche(
    id: number,
    dto: { texte?: string; valeurs?: Record<string, any>; indication?: string; prescripteur?: string },
  ) {
    const fiche = await this.prisma.ficheExamenImagerie.findUnique({
      where: { id },
      include: { typeFiche: { select: { texte: true, champs: true } } },
    });
    if (!fiche) throw new NotFoundException('Fiche introuvable.');

    // Valeurs fournies → régénère le texte depuis le format ; texte fourni → prioritaire.
    let texte = dto.texte ?? undefined;
    let valeurs = fiche.valeurs;
    if (dto.valeurs) {
      valeurs = JSON.stringify(dto.valeurs);
      if (!texte?.trim()) {
        texte = this.genererTexte(fiche.typeFiche.texte, this.parseChamps(fiche.typeFiche.champs), dto.valeurs);
      }
    }

    return this.prisma.ficheExamenImagerie.update({
      where: { id },
      data: {
        texte,
        valeurs,
        indication: dto.indication,
        prescripteur: dto.prescripteur,
      },
    });
  }

  /**
   * Encadre les valeurs saisies dans le texte final (HTML) : elles ressortent
   * en gras et dans une police différente à l'impression, comme à la main.
   * Les occurrences « autonomes » seulement (une valeur à 1 chiffre n'est pas
   * marquée quand elle est collée à un autre chiffre/lettre).
   */
  private marquerValeurs(texte: string, valeursJson?: string | null): string {
    const vals: string[] = [];
    if (valeursJson) {
      try {
        const v = JSON.parse(valeursJson);
        if (v && typeof v === 'object') {
          for (const x of Object.values(v)) {
            const s = x != null ? String(x).trim() : '';
            if (s.length >= 1) vals.push(s);
          }
        }
      } catch {
        /* valeurs illisibles : texte brut */
      }
    }
    // Tri par longueur décroissante pour éviter les chevauchements de valeurs
    vals.sort((a, b) => b.length - a.length);
    const CAR = '0-9A-Za-zÀ-ÖØ-öø-ÿ';
    const echapperRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const marqueurs: { token: string; html: string }[] = [];
    let texte2 = texte ?? '';
    vals.forEach((val, i) => {
      if (!texte2.includes(val)) return;
      const token = `\u0000V${i}\u0000`;
      // Garde : la valeur doit être entourée de caractères non alphanumériques
      const regex = new RegExp(`(^|[^${CAR}])(${echapperRegex(val)})(?![${CAR}])`, 'g');
      let trouve = false;
      texte2 = texte2.replace(regex, (tout, avant) => {
        trouve = true;
        return avant + token;
      });
      if (!trouve) return;
      const esc = val.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      marqueurs.push({ token, html: `<b class="val">${esc}</b>` });
    });
    let html = texte2.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    for (const m of marqueurs) html = html.split(m.token).join(m.html);
    return html;
  }

  /** Imprime la fiche en A4 : dépôt dans la file d'impression (agent local). */
  async imprimerFiche(ficheId: number) {
    const fiche = await this.prisma.ficheExamenImagerie.findUnique({
      where: { id: ficheId },
      include: {
        patient: true,
        passage: { select: { numeroOrdre: true } },
        clinique: { select: { nom: true, adresse: true, telephone: true } },
        typeFiche: { select: { titre: true, titre2: true, libelle: true } },
        medecin: { select: { personnel: { select: { nom: true, prenom: true } } } },
      },
    });
    if (!fiche) throw new NotFoundException('Fiche introuvable.');

    // HTML au format des fiches papier (en-tête, titre, champs, texte, signature)
    const nomMedecin = fiche.medecin?.personnel
      ? `Dr ${fiche.medecin.personnel.nom} ${fiche.medecin.personnel.prenom}`
      : '';
    const date = new Date(fiche.createdAt).toLocaleDateString('fr-FR');
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #000; margin: 14mm; }
  .entete { text-align: center; margin-bottom: 6mm; }
  .entete .img { font-size: 15px; font-weight: 800; letter-spacing: 1px; }
  .entete .rep { font-size: 12px; font-weight: 700; margin-top: 2px; }
  .entete .dev { font-style: italic; font-size: 11px; margin-top: 1px; }
  .regle { border-bottom: 1.2px solid #000; margin: 4mm 0; }
  .titre { text-align: center; font-size: 15px; font-weight: 800; text-decoration: underline; letter-spacing: 1px; margin: 4mm 0; }
  .champs { display: flex; flex-wrap: wrap; gap: 3mm 10mm; margin-bottom: 4mm; }
  .champ { font-size: 12px; }
  .champ b { display: inline-block; min-width: 90px; }
  .corps { white-space: pre-wrap; line-height: 1.55; margin-top: 3mm; }
  .corps .val { font-weight: 800; font-family: 'Georgia', 'Times New Roman', serif; }
  .signature { margin-top: 22mm; display: flex; justify-content: space-between; align-items: flex-end; }
  .cachet { border: 1px solid #000; border-radius: 6px; width: 52mm; height: 26mm; text-align: center; font-size: 11px; color: #555; font-style: italic; display: flex; align-items: center; justify-content: center; }
  .medecin { font-weight: 800; text-align: right; }
</style></head><body>
  <div class="entete">
    <div class="img">IMAGERIE MÉDICALE</div>
    <div class="rep">RÉPUBLIQUE DE CÔTE D'IVOIRE</div>
    <div class="dev">Union - Discipline - Travail</div>
  </div>
  <div class="regle"></div>
  <div class="titre">${(fiche.typeFiche?.titre || fiche.typeFiche?.libelle || '').toUpperCase()}</div>
  ${fiche.typeFiche?.titre2 ? `<div class="titre">${fiche.typeFiche.titre2.toUpperCase()}</div>` : ''}
  <div class="champs">
    <span class="champ"><b>Date :</b> ${date}</span>
    <span class="champ"><b>Nom :</b> ${fiche.patient.nom}</span>
    <span class="champ"><b>Prénom(s) :</b> ${fiche.patient.prenom}</span>
    <span class="champ"><b>Âge :</b> ${fiche.patient.age ?? ''}</span>
    <span class="champ"><b>Indication :</b> ${fiche.indication ?? ''}</span>
    <span class="champ"><b>Prescripteur :</b> ${fiche.prescripteur ?? ''}</span>
  </div>
  <div class="regle"></div>
  <div class="corps">${this.marquerValeurs(fiche.texte, fiche.valeurs)}</div>
  <div class="signature">
    <div class="cachet">Signature et cachet</div>
    <div class="medecin">${nomMedecin}<br>Le Médecin</div>
  </div>
</body></html>`;

    // Dépôt dans la file d'impression : poste A4, format A4, imprimante A4 du poste
    const config = await this.prisma.imprimante.findFirst({
      where: { cliniqueId: fiche.cliniqueId, poste: 'A4', actif: true },
    });
    await this.prisma.impressionFile.create({
      data: {
        cliniqueId: fiche.cliniqueId,
        poste: 'A4',
        libelle: `Fiche échographie ${fiche.libelleType} — ${fiche.patient.nom} ${fiche.patient.prenom}`,
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
