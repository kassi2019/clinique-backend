import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Journal d'actions global : chaque écriture réussie de l'API (POST / PATCH /
 * PUT / DELETE) est enregistrée avec l'utilisateur connecté, la route, la
 * ressource concernée et le corps de la requête (sans le mot de passe).
 * Écriture « best-effort » : une erreur de journalisation ne bloque jamais
 * la réponse.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const methode = req?.method;
    const user = req?.user;
    const route = (req?.originalUrl ?? '').split('?')[0];

    // Seulement les écritures, avec un utilisateur connecté, hors auth/lectures
    if (
      !user ||
      !['POST', 'PATCH', 'PUT', 'DELETE'].includes(methode) ||
      !route.startsWith('/api/') ||
      route.startsWith('/api/auth') ||
      route.startsWith('/api/journal')
    ) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(async () => {
        try {
          const corps = { ...(req.body ?? {}) };
          delete corps.motDePasse; // jamais le mot de passe dans le journal
          let details: string | null = null;
          try {
            details = JSON.stringify(corps).slice(0, 4000);
          } catch {
            details = null;
          }
          // Ressource concernée : /api/<entite>/<id>… (ou /api/<entite>)
          const segments = route.split('/').filter(Boolean); // ['api', 'entite', 'id', ...]
          const matchId = route.match(/\/([a-z-]+)\/(\d+)/);
          await this.prisma.journalAction.create({
            data: {
              cliniqueId: user?.clinique?.id ?? null,
              utilisateurId: user?.id ?? null,
              methode,
              route: route.slice(0, 300),
              entite: segments[1] ?? null,
              entiteId: matchId ? matchId[2] : corps?.id ? String(corps.id) : null,
              details,
            },
          });
        } catch {
          /* journalisation best-effort */
        }
      }),
    );
  }
}
