import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as net from 'net';
import * as os from 'os';
import * as path from 'path';
import { promisify } from 'util';
import { PrismaService } from '../prisma/prisma.service';

const execAsync = promisify(exec);

// ─── Commandes ESC/POS ─────────────────────────────────────────────
const ESC = '\x1b';
const GS = '\x1d';

const CMDS = {
  INIT: ESC + '@',
  CP1252: ESC + 't' + '\x10', // Code page Windows-1252 (accents français)
  ALIGN_CENTER: ESC + 'a' + '\x01',
  ALIGN_LEFT: ESC + 'a' + '\x00',
  BOLD_ON: ESC + 'E' + '\x01',
  BOLD_OFF: ESC + 'E' + '\x00',
  DOUBLE_ON: GS + '!' + '\x11', // double largeur + hauteur (imprimantes compatibles Epson)
  DOUBLE_OFF: GS + '!' + '\x00',
  FEED_LINE: ESC + 'd' + '\x01',
  CUT_PARTIAL: GS + 'V' + '\x01',
  CUT_FULL: GS + 'V' + '\x00',
};

export interface ConfigImprimante {
  type: 'WINDOWS' | 'NETWORK' | 'BLUETOOTH' | 'NONE';
  ip: string;
  port: number;
  nom: string;
  partage: string;
  largeur: number;
  autoPrint: boolean;
  bluetooth?: string;
}

export interface ResultatImpression {
  ok: boolean;
  message: string;
  contenu?: string;
  bluetooth?: boolean;
}

/** Remplace les caractères accentués pour les imprimantes thermiques. */
export function normalizeText(texte: string): string {
  const MAP: Record<string, string> = {
    À: 'A', Á: 'A', Â: 'A', Ã: 'A', Ä: 'A', Å: 'A',
    à: 'a', á: 'a', â: 'a', ã: 'a', ä: 'a', å: 'a',
    Ç: 'C', ç: 'c',
    È: 'E', É: 'E', Ê: 'E', Ë: 'E',
    è: 'e', é: 'e', ê: 'e', ë: 'e',
    Ì: 'I', Í: 'I', Î: 'I', Ï: 'I',
    ì: 'i', í: 'i', î: 'i', ï: 'i',
    Ò: 'O', Ó: 'O', Ô: 'O', Õ: 'O', Ö: 'O',
    ò: 'o', ó: 'o', ô: 'o', õ: 'o', ö: 'o',
    Ù: 'U', Ú: 'U', Û: 'U', Ü: 'U',
    ù: 'u', ú: 'u', û: 'u', ü: 'u',
    Ñ: 'N', ñ: 'n',
    Œ: 'OE', œ: 'oe', ß: 'ss', ÿ: 'y', Ÿ: 'Y',
  };
  return texte
    .split('')
    .map((c) => MAP[c] || c)
    .join('');
}

@Injectable()
export class ImpressionService {
  private readonly logger = new Logger(ImpressionService.name);

  constructor(private prisma: PrismaService) {}

  // ─── Configuration (.env = valeurs par défaut, base = imprimantes par poste) ───

  /** Postes d'impression gérés (une imprimante paramétrable par poste). */
  static POSTES = ['TICKET', 'RECU', 'PHARMACIE', 'ORDONNANCE', 'IMAGERIE'] as const;

  static LIBELLES_POSTES: Record<string, string> = {
    TICKET: 'Imprimante de tickets (accueil)',
    RECU: 'Imprimante des reçus (caisse)',
    PHARMACIE: 'Imprimante des reçus (pharmacie)',
    ORDONNANCE: 'Imprimante des ordonnances (consultation)',
    IMAGERIE: 'Imprimante du service imagerie',
  };

  /** Valeurs par défaut issues du fichier .env. */
  getConfigEnv(): ConfigImprimante {
    return {
      type: (process.env.PRINTER_TYPE as ConfigImprimante['type']) || 'WINDOWS',
      ip: process.env.PRINTER_IP || '192.168.1.100',
      port: parseInt(process.env.PRINTER_PORT || '9100', 10),
      nom: process.env.PRINTER_NAME || 'POS-80C',
      partage: process.env.PRINTER_SHARE || 'RECU',
      largeur: parseInt(process.env.PRINTER_CHAR_WIDTH || '42', 10),
      autoPrint: process.env.PRINTER_AUTO_PRINT !== 'false',
      bluetooth: process.env.PRINTER_BLUETOOTH_DEVICE || '',
    };
  }

  /** Configuration d'un poste : base de données, sinon valeurs .env. */
  async getConfigPoste(cliniqueId: number, poste: string): Promise<ConfigImprimante> {
    const defaut = this.getConfigEnv();
    const row = await this.prisma.imprimante.findUnique({
      where: { cliniqueId_poste: { cliniqueId, poste } },
    });
    if (!row) return defaut;
    return {
      type: (row.type as ConfigImprimante['type']) || defaut.type,
      ip: row.ip || defaut.ip,
      port: row.port || defaut.port,
      nom: row.nom || defaut.nom,
      partage: row.partage || defaut.partage,
      largeur: row.largeur || defaut.largeur,
      autoPrint: row.autoPrint,
      bluetooth: defaut.bluetooth,
    };
  }

  /** Toutes les configurations des postes (pour l'écran Paramètres). */
  async getConfigs(cliniqueId: number) {
    const lignes = await this.prisma.imprimante.findMany({
      where: { cliniqueId },
    });
    return ImpressionService.POSTES.map((poste) => {
      const row = lignes.find((l) => l.poste === poste);
      return {
        poste,
        libelle: ImpressionService.LIBELLES_POSTES[poste],
        config: {
          type: row?.type ?? 'WINDOWS',
          nom: row?.nom ?? '',
          partage: row?.partage ?? '',
          ip: row?.ip ?? '',
          port: row?.port ?? 9100,
          largeur: row?.largeur ?? 42,
          autoPrint: row?.autoPrint ?? true,
        },
      };
    });
  }

  /** Enregistre la configuration d'un poste en base (appliquée immédiatement). */
  async updateConfig(
    cliniqueId: number,
    poste: string,
    updates: {
      type?: string;
      nom?: string;
      partage?: string;
      ip?: string;
      port?: number;
      largeur?: number;
      autoPrint?: boolean;
    },
  ) {
    return this.prisma.imprimante.upsert({
      where: { cliniqueId_poste: { cliniqueId, poste } },
      update: {
        type: updates.type,
        nom: updates.nom,
        partage: updates.partage,
        ip: updates.ip,
        port: updates.port,
        largeur: updates.largeur,
        autoPrint: updates.autoPrint,
      },
      create: {
        cliniqueId,
        poste,
        libelle: ImpressionService.LIBELLES_POSTES[poste] ?? poste,
        type: updates.type ?? 'WINDOWS',
        nom: updates.nom,
        partage: updates.partage,
        ip: updates.ip,
        port: updates.port ?? 9100,
        largeur: updates.largeur ?? 42,
        autoPrint: updates.autoPrint ?? true,
      },
    });
  }

  /** Liste les imprimantes installées sur ce poste Windows. */
  async listWindowsPrinters(): Promise<string[]> {
    try {
      const { stdout } = await execAsync(
        `powershell -NoProfile -Command "Get-Printer | Select-Object -ExpandProperty Name"`,
        { timeout: 8000 },
      );
      return stdout
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
    } catch (err: any) {
      this.logger.warn(`Impossible de lister les imprimantes: ${err.message}`);
      return [];
    }
  }

  /** Teste la connexion à l'imprimante d'un poste. */
  async testPrinter(
    cliniqueId: number,
    poste: string,
  ): Promise<{ ok: boolean; message: string; debug?: string }> {
    const config = await this.getConfigPoste(cliniqueId, poste);

    if (config.type === 'NONE') {
      return {
        ok: false,
        message: 'Aucune imprimante configurée (PRINTER_TYPE=NONE)',
      };
    }

    if (config.type === 'NETWORK') {
      try {
        await this.sendRawToNetwork(
          config,
          CMDS.INIT + CMDS.FEED_LINE + CMDS.FEED_LINE,
        );
        return {
          ok: true,
          message: `Imprimante réseau OK — ${config.ip}:${config.port}`,
        };
      } catch (err: any) {
        return {
          ok: false,
          message: `Échec connexion ${config.ip}:${config.port} — ${err.message}`,
        };
      }
    }

    if (config.type === 'BLUETOOTH') {
      return {
        ok: true,
        message: `Imprimante Bluetooth "${config.bluetooth || 'Non spécifiée'}" — le test doit être fait depuis le navigateur (Web Bluetooth)`,
      };
    }

    return this.testWindowsPrinter(config);
  }

  private async testWindowsPrinter(
    config: ConfigImprimante,
  ): Promise<{ ok: boolean; message: string; debug?: string }> {
    const results: string[] = [];
    const testText = [
      '',
      '===== TEST IMPRESSION =====',
      '',
      'Si vous voyez ce ticket,',
      `l'imprimante "${config.nom}"`,
      'est bien configuree !',
      '',
      new Date().toLocaleString('fr-FR'),
      '',
      '',
    ].join('\r\n');

    const tmpFile = path.join(os.tmpdir(), `test_ticket_${Date.now()}.txt`);

    // Méthode 1 : partage (copy /b) avec commande de coupe ESC/POS
    if (config.partage) {
      try {
        const cutCmd = '\x1d\x56\x01'; // GS V 1 = coupe partielle
        fs.writeFileSync(tmpFile, testText + cutCmd, 'latin1');
        const sharePath = `\\\\localhost\\${config.partage}`;
        await execAsync(`cmd /c "copy /b \"${tmpFile}\" \"${sharePath}\""`, {
          timeout: 10000,
        });
        results.push(`✅ Méthode 1 (copy /b \\\\localhost\\${config.partage}) OK`);
        try { fs.unlinkSync(tmpFile); } catch {}
        return {
          ok: true,
          message: `Imprimante OK via partage \\\\localhost\\${config.partage}`,
          debug: results.join(' | '),
        };
      } catch (err: any) {
        results.push(`❌ copy /b: ${err.message}`);
      }
    }

    // Méthode 2 : Out-Printer
    try {
      fs.writeFileSync(tmpFile, testText, 'latin1');
      const psScript = `Get-Content -Path '${tmpFile.replace(/'/g, "''")}' -Encoding Default | Out-Printer -Name '${config.nom.replace(/'/g, "''")}'`;
      await execAsync(`powershell -NoProfile -Command "${psScript}"`, {
        timeout: 10000,
      });
      results.push('✅ Méthode 2 (Out-Printer) OK');
      try { fs.unlinkSync(tmpFile); } catch {}
      return {
        ok: true,
        message: `Imprimante OK via Out-Printer "${config.nom}"`,
        debug: results.join(' | '),
      };
    } catch (err: any) {
      results.push(`❌ Out-Printer: ${err.message}`);
    }

    // Méthode 3 : print /d
    try {
      fs.writeFileSync(tmpFile, testText, 'latin1');
      await execAsync(`print /d:"${config.nom}" "${tmpFile}"`, {
        timeout: 10000,
      });
      results.push('✅ Méthode 3 (print /d) OK');
      try { fs.unlinkSync(tmpFile); } catch {}
      return {
        ok: true,
        message: `Imprimante OK via print /d "${config.nom}"`,
        debug: results.join(' | '),
      };
    } catch (err: any) {
      results.push(`❌ print /d: ${err.message}`);
    }

    const printers = await this.listWindowsPrinters();
    results.push(`Imprimantes disponibles: ${printers.join(', ') || 'aucune'}`);

    return {
      ok: false,
      message:
        `Aucune méthode n'a fonctionné pour "${config.nom}". ` +
        `Vérifiez que l'imprimante est allumée et partagée (nom de partage: "${config.partage}"). ` +
        `Imprimantes trouvées: ${printers.slice(0, 5).join(', ') || 'aucune'}`,
      debug: results.join(' | '),
    };
  }

  // ─── Ticket de passage ───────────────────────────────────────────

  /** Génère le texte brut du ticket (largeur configurée, 80 mm = 42 car.). */
  genererTicketPassage(passage: {
    numeroOrdre: string;
    motif: string | null;
    typePatient: string;
    createdAt: Date;
    patient: {
      nom: string;
      prenom: string;
      age: string | null;
      sexe: string | null;
      code: string;
    };
    service: { nom: string } | null;
    clinique: { nom: string; adresse: string | null };
  }, largeur: number): string {
    const L = largeur;
    const trait = (c = '=') => c.repeat(L);
    const centrer = (t: string) => ' '.repeat(Math.max(0, Math.floor((L - t.length) / 2))) + t;

    const d = passage.createdAt;
    const dateHeure = `${String(d.getDate()).padStart(2, '0')}/${String(
      d.getMonth() + 1,
    ).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(
      2,
      '0',
    )}:${String(d.getMinutes()).padStart(2, '0')}`;

    // Symboles CP437 sûrs pour imprimantes thermiques (aucune fonction de contrôle)
    const COEUR = '\x03'; // ♥
    const PUCE = '\x07'; // •

    const lignes: string[] = [];
    lignes.push(centrer(passage.clinique.nom.toUpperCase()));
    if (passage.clinique.adresse) {
      lignes.push(centrer(passage.clinique.adresse));
    }
    lignes.push(trait('-'));
    lignes.push(centrer('TICKET DE PASSAGE'));
    // N° d'ordre en double taille (largeur+hauteur) + gras : le centrage tient
    // compte du doublement de largeur des caractères (espaces doublés aussi).
    const ordre = passage.numeroOrdre;
    const espaces = Math.max(0, Math.round((L - ordre.length * 2) / 4));
    lignes.push(
      CMDS.DOUBLE_ON +
        CMDS.BOLD_ON +
        ' '.repeat(espaces) +
        ordre +
        CMDS.BOLD_OFF +
        CMDS.DOUBLE_OFF,
    );
    lignes.push(
      centrer(`${PUCE} ${passage.patient.nom} ${passage.patient.prenom}`.toUpperCase()),
    );
    const infos: string[] = [];
    if (passage.patient.age) infos.push(`${passage.patient.age} ans`);
    if (passage.patient.sexe) {
      infos.push(passage.patient.sexe === 'M' ? 'Masculin' : 'Feminin');
    }
    if (infos.length) lignes.push(centrer(infos.join(' | ')));
    lignes.push(centrer(passage.service?.nom ?? '-'));
    lignes.push('');
    lignes.push(centrer('Date de passage'));
    lignes.push(CMDS.BOLD_ON + centrer(dateHeure) + CMDS.BOLD_OFF);
    lignes.push(trait('-'));
    lignes.push(centrer(`${COEUR} Merci de votre visite ${COEUR}`));
    lignes.push('');
    return lignes.join('\n');
  }

  /** Imprime le reçu d'un paiement (données récupérées en base, §6 caisse). */
  async imprimerRecuPaiement(paiementId: number): Promise<ResultatImpression> {
    const paiement = await this.prisma.paiement.findUnique({
      where: { id: paiementId },
      include: {
        passage: {
          include: {
            patient: true,
            service: { select: { nom: true } },
          },
        },
        clinique: { select: { nom: true, adresse: true } },
        caissier: {
          select: {
            matricule: true,
            personnel: { select: { nom: true, prenom: true } },
          },
        },
        lignes: true,
      },
    });
    if (!paiement) throw new NotFoundException('Paiement introuvable.');

    const config = await this.getConfigPoste(paiement.cliniqueId, 'RECU');
    const L = config.largeur;
    const trait = (c = '-') => c.repeat(L);
    const centrer = (t: string) =>
      ' '.repeat(Math.max(0, Math.floor((L - t.length) / 2))) + t;
    const deuxColonnes = (gauche: string, droite: string) =>
      gauche + ' '.repeat(Math.max(1, L - gauche.length - droite.length)) + droite;

    const COEUR = '\x03'; // ♥
    const d = paiement.createdAt;
    const dateHeure = `${String(d.getDate()).padStart(2, '0')}/${String(
      d.getMonth() + 1,
    ).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(
      2,
      '0',
    )}:${String(d.getMinutes()).padStart(2, '0')}`;

    const lignes: string[] = [];
    lignes.push(centrer(paiement.clinique.nom.toUpperCase()));
    if (paiement.clinique.adresse) {
      lignes.push(centrer(paiement.clinique.adresse));
    }
    lignes.push(trait());
    lignes.push(centrer('RECU DE PAIEMENT'));
    lignes.push(CMDS.BOLD_ON + centrer(paiement.numeroRecu) + CMDS.BOLD_OFF);
    lignes.push(trait());
    lignes.push(
      deuxColonnes(
        'Patient',
        `${paiement.passage.patient.nom} ${paiement.passage.patient.prenom}`.toUpperCase(),
      ),
    );
    lignes.push(deuxColonnes('Code', paiement.passage.patient.code));
    lignes.push(deuxColonnes('N ordre', paiement.passage.numeroOrdre));
    lignes.push(trait());
    for (const l of paiement.lignes) {
      lignes.push(deuxColonnes(l.libelle, `${Number(l.montant)} F`));
    }
    lignes.push(trait());
    lignes.push(
      CMDS.BOLD_ON +
        deuxColonnes('TOTAL', `${Number(paiement.montantTotal)} FCFA`) +
        CMDS.BOLD_OFF,
    );
    lignes.push(deuxColonnes('Mode', paiement.modePaiement));
    lignes.push(
      deuxColonnes(
        'Caissier',
        `${paiement.caissier.personnel?.prenom ?? ''} ${paiement.caissier.personnel?.nom ?? ''}`.trim() ||
          paiement.caissier.matricule,
      ),
    );
    lignes.push(trait());
    lignes.push(centrer(`${COEUR} Merci de votre visite ${COEUR}`));
    lignes.push('');

    const texte = normalizeText(lignes.join('\n'));
    return this.imprimer(texte, config);
  }

  /** Imprime l'ordonnance d'une consultation (§7). */
  async imprimerOrdonnance(consultationId: number): Promise<ResultatImpression> {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: consultationId },
      include: {
        passage: {
          include: {
            patient: true,
            service: { select: { nom: true } },
            clinique: { select: { nom: true, adresse: true } },
            prestations: {
              where: { statut: { in: ['EN_ATTENTE', 'PAYEE'] } },
              include: { service: { select: { nom: true } } },
            },
          },
        },
        medecin: {
          select: {
            matricule: true,
            personnel: { select: { nom: true, prenom: true } },
          },
        },
        medicaments: true,
      },
    });
    if (!consultation) throw new NotFoundException('Consultation introuvable.');

    const config = await this.getConfigPoste(consultation.passage.cliniqueId, 'ORDONNANCE');
    const L = config.largeur;
    const trait = (c = '-') => c.repeat(L);
    const centrer = (t: string) =>
      ' '.repeat(Math.max(0, Math.floor((L - t.length) / 2))) + t;
    const deuxColonnes = (gauche: string, droite: string) =>
      gauche + ' '.repeat(Math.max(1, L - gauche.length - droite.length)) + droite;

    const COEUR = '\x03';
    const d = consultation.createdAt;
    const dateHeure = `${String(d.getDate()).padStart(2, '0')}/${String(
      d.getMonth() + 1,
    ).padStart(2, '0')}/${d.getFullYear()}`;

    const p = consultation.passage.patient;
    const lignes: string[] = [];
    lignes.push(centrer(consultation.passage.clinique.nom.toUpperCase()));
    if (consultation.passage.clinique.adresse) {
      lignes.push(centrer(consultation.passage.clinique.adresse));
    }
    lignes.push(trait());
    lignes.push(centrer('ORDONNANCE'));
    lignes.push(trait());
    lignes.push(
      deuxColonnes('Patient', `${p.nom} ${p.prenom}`.toUpperCase()),
    );
    lignes.push(deuxColonnes('Code', p.code));
    if (p.age) lignes.push(deuxColonnes('Age', `${p.age} ans`));
    if (p.sexe) {
      lignes.push(deuxColonnes('Sexe', p.sexe === 'M' ? 'Masculin' : 'Feminin'));
    }
    lignes.push(
      deuxColonnes(
        'Medecin',
        `Dr ${consultation.medecin.personnel?.nom ?? ''} ${consultation.medecin.personnel?.prenom ?? ''}`.trim(),
      ),
    );
    lignes.push(deuxColonnes('Date', dateHeure));
    lignes.push(trait());

    if (consultation.medicaments.length === 0) {
      lignes.push(centrer('Aucun medicament prescrit.'));
    } else {
      let i = 1;
      for (const m of consultation.medicaments) {
        const nomComplet = `${m.medicamentNom}${m.forme ? ' (' + m.forme + ')' : ''}`;
        lignes.push(`${i}. ${nomComplet}`);
        if (m.posologie) lignes.push(`   Posologie : ${m.posologie}`);
        if (m.quantite) lignes.push(`   Quantite  : ${m.quantite}`);
        if (m.duree) lignes.push(`   Duree     : ${m.duree}`);
        i++;
      }
    }

    const examens = consultation.passage.prestations.filter(
      (x) => x.source !== 'ACCUEIL' || x.statut === 'PAYEE',
    );
    if (examens.length > 0) {
      lignes.push(trait());
      lignes.push(centrer('Examens demandes'));
      for (const e of examens) {
        lignes.push(centrer(`- ${e.libelle}`));
      }
    }

    if (consultation.diagnostic) {
      lignes.push(trait());
      lignes.push(centrer('Diagnostic'));
      lignes.push(deuxColonnes('', consultation.diagnostic));
    }

    lignes.push(trait());
    lignes.push(centrer(`${COEUR} Merci de votre visite ${COEUR}`));
    lignes.push('');

    const texte = normalizeText(lignes.join('\n'));
    return this.imprimer(texte, config);
  }

  /** Imprime le reçu de la caisse pharmacie. */
  async imprimerRecuPharmacie(paiementId: number): Promise<ResultatImpression> {
    const paiement = await this.prisma.pharmaciePaiement.findUnique({
      where: { id: paiementId },
      include: {
        dispensation: {
          include: {
            consultation: {
              include: {
                passage: { include: { patient: true, clinique: { select: { nom: true, adresse: true } } } },
              },
            },
            pharmacien: { select: { matricule: true, personnel: { select: { nom: true, prenom: true } } } },
            lignes: true,
          },
        },
      },
    });
    if (!paiement) throw new NotFoundException('Paiement introuvable.');

    const config = await this.getConfigPoste(
      paiement.dispensation.consultation.passage.cliniqueId,
      'PHARMACIE',
    );
    const L = config.largeur;
    const trait = (c = '-') => c.repeat(L);
    const centrer = (t: string) =>
      ' '.repeat(Math.max(0, Math.floor((L - t.length) / 2))) + t;
    const deuxColonnes = (gauche: string, droite: string) =>
      gauche + ' '.repeat(Math.max(1, L - gauche.length - droite.length)) + droite;

    const COEUR = '\x03';
    const p = paiement.dispensation.consultation.passage.patient;
    const clinique = paiement.dispensation.consultation.passage.clinique;

    const lignes: string[] = [];
    lignes.push(centrer(clinique.nom.toUpperCase()));
    if (clinique.adresse) lignes.push(centrer(clinique.adresse));
    lignes.push(trait());
    lignes.push(centrer('RECU PHARMACIE'));
    lignes.push(CMDS.BOLD_ON + centrer(paiement.numeroRecu) + CMDS.BOLD_OFF);
    lignes.push(trait());
    lignes.push(deuxColonnes('Patient', `${p.nom} ${p.prenom}`.toUpperCase()));
    lignes.push(deuxColonnes('Code', p.code));
    lignes.push(trait());
    for (const l of paiement.dispensation.lignes) {
      // Prix unitaire × quantité = total, sur la même ligne que le médicament
      const detail =
        `${Number(l.prixUnitaire)} F x ${l.quantiteDelivree} = ` +
        `${Number(l.montant)} F`;
      if (l.medicamentNom.length + detail.length + 2 <= L) {
        lignes.push(deuxColonnes(l.medicamentNom, detail));
      } else {
        // Nom trop long : le détail passe à la ligne suivante
        lignes.push(deuxColonnes(l.medicamentNom, ''));
        lignes.push(deuxColonnes(`  ${detail}`, ''));
      }
    }
    lignes.push(trait());
    lignes.push(
      CMDS.BOLD_ON +
        deuxColonnes('TOTAL', `${Number(paiement.montantTotal)} FCFA`) +
        CMDS.BOLD_OFF,
    );
    lignes.push(deuxColonnes('Mode', paiement.modePaiement));
    lignes.push(
      deuxColonnes(
        'Caissière',
        `${paiement.dispensation.pharmacien.personnel?.prenom ?? ''} ${paiement.dispensation.pharmacien.personnel?.nom ?? ''}`.trim(),
      ),
    );
    lignes.push(trait());
    lignes.push(centrer(`${COEUR} Merci de votre visite ${COEUR}`));
    lignes.push('');

    const texte = normalizeText(lignes.join('\n'));
    return this.imprimer(texte, config);
  }

  /** Imprime le ticket d'un passage (données récupérées en base). */
  async imprimerTicketPassage(passageId: number): Promise<ResultatImpression> {
    const passage = await this.prisma.passage.findUnique({
      where: { id: passageId },
      include: {
        patient: true,
        service: { select: { id: true, code: true, nom: true } },
        clinique: { select: { id: true, code: true, nom: true, adresse: true } },
      },
    });
    if (!passage) throw new NotFoundException('Passage introuvable.');

    const config = await this.getConfigPoste(passage.cliniqueId, 'TICKET');
    const texte = normalizeText(this.genererTicketPassage(passage, config.largeur));
    return this.imprimer(texte, config);
  }

  /** Envoie le texte à l'imprimante selon la configuration fournie. */
  async imprimer(texte: string, config: ConfigImprimante): Promise<ResultatImpression> {

    if (config.type === 'NONE') {
      return {
        ok: false,
        message: 'Impression désactivée (PRINTER_TYPE=NONE)',
        contenu: texte,
      };
    }

    if (config.type === 'BLUETOOTH') {
      // Retourne le contenu : le frontend l'envoie via Web Bluetooth
      return {
        ok: true,
        message: 'Ticket prêt pour Bluetooth',
        contenu: texte,
        bluetooth: true,
      };
    }

    try {
      if (config.type === 'NETWORK') {
        // Réseau : flux TCP brut (port 9100)
        await this.sendRawToNetwork(
          config,
          Buffer.from(texte + '\r\n\r\n\r\n' + CMDS.CUT_PARTIAL, 'latin1'),
        );
        return {
          ok: true,
          message: `Ticket envoyé à l'imprimante réseau ${config.ip}:${config.port}`,
        };
      }

      if (config.type === 'WINDOWS') {
        await this.sendTextToWindowsPrinter(config, texte);
        return {
          ok: true,
          message: `Ticket envoyé à "${config.nom}"`,
        };
      }

      return { ok: false, message: "Type d'imprimante inconnu" };
    } catch (err: any) {
      this.logger.error(`Erreur impression: ${err.message}`);
      return { ok: false, message: `Erreur impression: ${err.message}` };
    }
  }

  // ─── Envoi réseau TCP brut ───────────────────────────────────────

  private sendRawToNetwork(
    config: ConfigImprimante,
    data: string | Buffer,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const client = new net.Socket();
      const timeout = setTimeout(() => {
        client.destroy();
        reject(new Error('Timeout connexion imprimante'));
      }, 5000);

      client.connect(config.port, config.ip, () => {
        clearTimeout(timeout);
        client.write(data, (err) => {
          if (err) {
            client.destroy();
            reject(err);
            return;
          }
          setTimeout(() => {
            client.destroy();
            resolve();
          }, 1000);
        });
      });

      client.on('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  }

  // ─── Envoi vers imprimante Windows (3 méthodes de repli) ─────────

  private async sendTextToWindowsPrinter(
    config: ConfigImprimante,
    texte: string,
  ): Promise<void> {
    const tmpFile = path.join(os.tmpdir(), `ticket_${Date.now()}.txt`);
    const errors: string[] = [];

    try {
      // Méthode 1 : partage Windows (copy /b) — envoi brut + coupe ESC/POS
      if (config.partage) {
        try {
          const cutCmd = '\x1d\x56\x01'; // GS V 1 = coupe partielle
          fs.writeFileSync(tmpFile, texte + cutCmd, 'latin1');
          const sharePath = `\\\\localhost\\${config.partage}`;
          await execAsync(`cmd /c "copy /b \"${tmpFile}\" \"${sharePath}\""`, {
            timeout: 15000,
          });
          return;
        } catch (err: any) {
          errors.push(`copy /b: ${err.message}`);
          this.logger.warn(`copy /b échoué: ${err.message}`);
        }
      }

      // Méthode 2 : Out-Printer PowerShell
      try {
        fs.writeFileSync(tmpFile, texte, 'latin1');
        const psScript = `Get-Content -Path '${tmpFile.replace(/'/g, "''")}' -Encoding Default | Out-Printer -Name '${config.nom.replace(/'/g, "''")}'`;
        await execAsync(`powershell -NoProfile -Command "${psScript}"`, {
          timeout: 15000,
        });
        return;
      } catch (err: any) {
        errors.push(`Out-Printer: ${err.message}`);
        this.logger.warn(`Out-Printer échoué: ${err.message}`);
      }

      // Méthode 3 : commande print
      try {
        fs.writeFileSync(tmpFile, texte, 'latin1');
        await execAsync(`print /d:"${config.nom}" "${tmpFile}"`, {
          timeout: 15000,
        });
        return;
      } catch (err: any) {
        errors.push(`print /d: ${err.message}`);
      }

      throw new Error(errors.join(' | '));
    } finally {
      try {
        fs.unlinkSync(tmpFile);
      } catch {}
    }
  }
}
