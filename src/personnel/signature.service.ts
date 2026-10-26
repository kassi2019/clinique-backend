import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/** Image acceptée : data URL PNG / JPEG / WebP (le navigateur la prépare : fond transparent, recadrée). */
const FORMAT_IMAGE = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/;
const TAILLE_MAX = 2_000_000; // ~1,5 Mo d'image

export interface SignatureCachetDto {
  signature?: string | null; // null = supprimer
  cachet?: string | null;
}

/**
 * Signature et cachet d'un prescripteur, apposés au choix sur les documents imprimés.
 * Gérés par l'administrateur (fiche du personnel) ou par le prescripteur lui-même.
 */
@Injectable()
export class SignatureService {
  constructor(private prisma: PrismaService) {}

  async lire(personnelId: number) {
    const p = await this.prisma.personnel.findUnique({
      where: { id: personnelId },
      select: { id: true, nom: true, prenom: true, signature: true, cachet: true },
    });
    if (!p) throw new NotFoundException('Personnel introuvable.');
    return p;
  }

  async enregistrer(personnelId: number, dto: SignatureCachetDto) {
    await this.lire(personnelId);
    const data: { signature?: string | null; cachet?: string | null } = {};
    for (const champ of ['signature', 'cachet'] as const) {
      const v = dto[champ];
      if (v === undefined) continue;
      if (v !== null && (typeof v !== 'string' || !FORMAT_IMAGE.test(v))) {
        throw new BadRequestException(`Image de ${champ} invalide (PNG ou JPEG attendu).`);
      }
      if (v && v.length > TAILLE_MAX) {
        throw new BadRequestException(`Image de ${champ} trop lourde : réduisez-la ou recadrez-la.`);
      }
      data[champ] = v;
    }
    await this.prisma.personnel.update({ where: { id: personnelId }, data });
    return this.lire(personnelId);
  }

  /**
   * Fiche du personnel liée au compte connecté. Pour enregistrer soi-même sa signature
   * (bouton « ✍️ Ma signature »), le rôle doit être autorisé par l'administrateur
   * (case « ✍️ Signature » de la liste des rôles) ; la lecture reste libre (case « Apposer »).
   */
  async personnelDe(utilisateurId: number, pourModifier = false) {
    const u = await this.prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
      select: { personnelId: true, role: { select: { signatureAutorisee: true } } },
    });
    if (!u) throw new NotFoundException('Compte introuvable.');
    if (pourModifier && !u.role.signatureAutorisee) {
      throw new ForbiddenException("Votre rôle n'est pas autorisé à utiliser une signature : voyez l'administrateur.");
    }
    return u.personnelId;
  }
}
