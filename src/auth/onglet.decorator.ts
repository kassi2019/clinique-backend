import { SetMetadata } from '@nestjs/common';

export const ONGLET_KEY = 'onglets';
/** Route réservée aux utilisateurs ayant accès à l'un des onglets indiqués (cf. OngletGuard). */
export const Onglet = (...codes: string[]) => SetMetadata(ONGLET_KEY, codes);
