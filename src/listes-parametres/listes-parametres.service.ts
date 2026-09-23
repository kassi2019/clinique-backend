import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Paramétrage des listes : UNE TABLE DÉDIÉE PAR TYPE.
 * (nationalites, residences, diagnostics, pathologies, fournisseurs,
 *  fonctions, posologies — même structure : cliniqueId + libelle + actif)
 * L'API reste générique (paramètre `code`) : chaque code est routé vers
 * sa table via le registre `delegate`.
 */
@Injectable()
export class ListesParametresService {
  constructor(private prisma: PrismaService) {}

  /** Table Prisma correspondant au code (lève une erreur si code inconnu). */
  private delegate(code: string): any {
    switch (code) {
      case 'NATIONALITE': return this.prisma.nationalite;
      case 'RESIDENCE': return this.prisma.residence;
      case 'DIAGNOSTIC': return this.prisma.diagnostic;
      case 'PATHOLOGIE': return this.prisma.pathologie;
      case 'FOURNISSEUR': return this.prisma.fournisseur;
      case 'FONCTION': return this.prisma.fonction;
      case 'POSOLOGIE': return this.prisma.posologie;
      default: throw new BadRequestException(`Code de liste inconnu : ${code}`);
    }
  }

  /**
   * Liste (actives par défaut ; `tous` = avec les inactives pour l'admin).
   * Sans `page` : tableau simple (listes déroulantes des formulaires).
   * Avec `page`/`perPage` : objet paginé (écrans d'administration).
   */
  async findAll(
    cliniqueId: number,
    code?: string,
    tous = false,
    page?: number,
    perPage?: number,
  ) {
    const d = this.delegate(code ?? 'NATIONALITE');
    const where = {
      cliniqueId,
      ...(tous ? {} : { actif: true }),
    };
    if (page && perPage) {
      const [data, total] = await Promise.all([
        d.findMany({
          where,
          orderBy: [{ actif: 'desc' }, { libelle: 'asc' }],
          skip: (page - 1) * perPage,
          take: perPage,
        }),
        d.count({ where }),
      ]);
      return {
        data,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      };
    }
    return d.findMany({
      where,
      orderBy: [{ actif: 'desc' }, { libelle: 'asc' }],
    });
  }

  async creer(cliniqueId: number, code: string, libelle: string) {
    const l = libelle.trim();
    if (!l) throw new BadRequestException('Libellé obligatoire.');
    const d = this.delegate(code);
    return d.upsert({
      where: { cliniqueId_libelle: { cliniqueId, libelle: l } },
      update: { actif: true },
      create: { cliniqueId, libelle: l },
    });
  }

  /** Import en masse (Excel côté frontend → tableau de libellés). */
  async importer(cliniqueId: number, code: string, libelles: string[]) {
    if (!Array.isArray(libelles) || libelles.length === 0) {
      throw new BadRequestException('Aucune ligne à importer.');
    }
    const d = this.delegate(code);
    const propres = [...new Set(libelles.map((l) => String(l).trim()).filter(Boolean))];
    let ajoutes = 0;
    for (const libelle of propres) {
      const existe = await d.findUnique({
        where: { cliniqueId_libelle: { cliniqueId, libelle } },
      });
      if (!existe) {
        await d.create({ data: { cliniqueId, libelle } });
        ajoutes++;
      }
    }
    return { ajoutes, total: propres.length };
  }

  /** Renomme une entrée de liste. */
  async modifier(id: number, code: string, libelle: string) {
    const l = libelle.trim();
    if (!l) throw new BadRequestException('Libellé obligatoire.');
    const d = this.delegate(code);
    const entree = await d.findUnique({ where: { id } });
    if (!entree) throw new NotFoundException('Entrée introuvable.');
    return d.update({ where: { id }, data: { libelle: l } });
  }

  /** Désactive/réactive une entrée (les valeurs déjà utilisées restent en base). */
  async desactiver(id: number, code: string) {
    const d = this.delegate(code);
    const entree = await d.findUnique({ where: { id } });
    if (!entree) throw new NotFoundException('Entrée introuvable.');
    return d.update({ where: { id }, data: { actif: !entree.actif } });
  }
}
