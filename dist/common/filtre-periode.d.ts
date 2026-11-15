export declare const DATE_RE: RegExp;
export declare const HEURE_RE: RegExp;
export declare function jourLocal(): string;
export declare function heureValide(h?: string): string;
export declare function utilisateurFiltre(v?: string | number | null): number;
export declare function aDesHeures(heureDebut?: string, heureFin?: string): boolean;
export declare function bornesPeriode(jourDebut: string, jourFin?: string, heureDebut?: string, heureFin?: string): {
    gte: Date;
    lte: Date;
};
export declare function bornesJourOptionnel(jour?: string, heureDebut?: string, heureFin?: string): {
    gte: Date;
    lte: Date;
};
