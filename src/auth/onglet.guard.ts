import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { ONGLET_KEY } from './onglet.decorator';
import { ongletAutorise } from './onglets';

/**
 * Restreint une route aux onglets indiqués via @Onglet(...) (l'un d'eux suffit).
 * L'administrateur passe toujours ; sinon les onglets cochés sur la fiche utilisateur
 * font foi (aucun onglet coché pour le module = tous ses onglets).
 */
@Injectable()
export class OngletGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const onglets = this.reflector.getAllAndOverride<string[]>(ONGLET_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!onglets?.length) return true;
    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;
    if (user.role === 'ADMINISTRATEUR') return true;
    const lignes = await this.prisma.utilisateurOnglet.findMany({
      where: { utilisateurId: user.id },
      select: { onglet: true },
    });
    const autorises = lignes.map((l) => l.onglet);
    if (!onglets.some((o) => ongletAutorise(autorises, o))) {
      throw new ForbiddenException("Vous n'avez pas accès à cet onglet.");
    }
    return true;
  }
}
