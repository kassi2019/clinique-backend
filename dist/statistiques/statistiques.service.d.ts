import { PrismaService } from '../prisma/prisma.service';
export declare class StatistiquesService {
    private prisma;
    constructor(prisma: PrismaService);
    private bornes;
    private parJour;
    tableauBord(cliniqueId: number, jour?: string): Promise<{
        periode: string;
        passages: number;
        consultations: number;
        externes: number;
        paiements: {
            nombre: number;
            montant: number;
        };
        examensLabo: number;
        examensImagerie: number;
        hospitalisationsEnCours: number;
        lits: {
            total: number;
            occupes: number;
        };
    }>;
    frequentation(cliniqueId: number, debut?: string, fin?: string, page?: number, perPage?: number): Promise<{
        periode: string;
        passages: number;
        internes: number;
        externes: number;
        consultations: number;
        parJour: {
            jour: string;
            nombre: number;
        }[];
        parService: {
            service: string;
            nombre: number;
        }[];
        parcours: {
            data: {
                id: number;
                numeroOrdre: string;
                patient: {
                    nom: string;
                    code: string;
                    prenom: string;
                    sexe: string;
                    age: string;
                };
                service: string;
                typePatient: string;
                statut: string;
                createdAt: Date;
            }[];
            total: number;
            page: number;
            perPage: number;
            totalPages: number;
        };
    }>;
    recettes(cliniqueId: number, debut?: string, fin?: string): Promise<{
        periode: string;
        nombre: number;
        total: number;
        parJour: {
            jour: string;
            nombre: number;
        }[];
        parMode: {
            nombre: number;
            montant: number;
            mode: string;
        }[];
        parService: {
            service: string;
            montant: number;
        }[];
        parType: {
            type: string;
            montant: number;
        }[];
    }>;
    laboratoire(cliniqueId: number, debut?: string, fin?: string): Promise<{
        periode: string;
        total: number;
        parJour: {
            jour: string;
            nombre: number;
        }[];
        parLibelle: {
            libelle: string;
            nombre: number;
        }[];
        parStatut: {
            statut: string;
            nombre: number;
        }[];
    }>;
    imagerie(cliniqueId: number, debut?: string, fin?: string): Promise<{
        periode: string;
        total: number;
        parJour: {
            jour: string;
            nombre: number;
        }[];
        parLibelle: {
            libelle: string;
            nombre: number;
        }[];
        parStatut: {
            statut: string;
            nombre: number;
        }[];
    }>;
    hospitalisation(cliniqueId: number, debut?: string, fin?: string): Promise<{
        periode: string;
        entrees: number;
        sorties: number;
        enCours: number;
        joursFactures: number;
        montantFacture: number;
        parJour: {
            jour: string;
            nombre: number;
        }[];
    }>;
    pharmacie(cliniqueId: number, debut?: string, fin?: string): Promise<{
        periode: string;
        totalVentes: number;
        quantitesVendues: number;
        topMedicaments: {
            montant: number;
            quantite: number;
            medicament: string;
        }[];
        stocksFaibles: {
            medicament: string;
            stock: number;
            seuilAlerte: number;
        }[];
        peremptions: {
            medicament: string;
            lot: string;
            quantite: number;
            peremption: string;
        }[];
    }>;
    maternite(cliniqueId: number, debut?: string, fin?: string): Promise<{
        periode: string;
        total: number;
        montant: number;
        parActe: {
            nombre: number;
            montant: number;
            acte: string;
        }[];
    }>;
}
