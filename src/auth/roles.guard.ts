import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

/**
 * Restreint l'accès aux rôles listés via @Roles(...).
 * Le rôle provient du payload JWT validé par JwtStrategy.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRequis = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!rolesRequis || rolesRequis.length === 0) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return !!user && rolesRequis.includes(user.role);
  }
}
