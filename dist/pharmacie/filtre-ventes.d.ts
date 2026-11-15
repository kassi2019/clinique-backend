import { PrismaService } from '../prisma/prisma.service';
import { utilisateurFiltre } from '../common/filtre-periode';
export interface FiltreVentes {
    debut?: string;
    fin?: string;
    heureDebut?: string;
    heureFin?: string;
    utilisateurId?: number;
}
export declare function bornesVentes(f: FiltreVentes): {
    debut: Date;
    fin: Date;
    libelle: string;
};
export { utilisateurFiltre };
export declare function vendeursPharmacie(prisma: PrismaService, cliniqueId: number): Promise<{
    id: number;
    nom: string;
}[]>;
