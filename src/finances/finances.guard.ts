import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Accès au module Finances : administrateur, ou rôle habilité au module FINANCES
 * (Paramétrage → Rôles & habilitations).
 */
@Injectable()
export class FinancesGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;
    if (user.role === 'ADMINISTRATEUR') return true;
    const habilite = await this.prisma.roleModule.count({
      where: { role: { code: user.role }, module: { code: 'FINANCES' } },
    });
    if (!habilite) throw new ForbiddenException('Accès réservé au module Finances.');
    return true;
  }
}
