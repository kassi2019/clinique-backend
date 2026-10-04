import { CaisseService } from './caisse.service';
import { AjouterPrestationDto, AnnulerPaiementDto, EncaisserDto } from './dto/encaisser.dto';
export declare class CaisseController {
    private caisseService;
    constructor(caisseService: CaisseService);
    rechercher(search?: string, cliniqueId?: number): any[] | Promise<{
        id: number;
        numeroOrdre: string;
        statut: string;
        createdAt: Date;
        patient: {
            nationalite: string | null;
            profession: string | null;
            quartier: string | null;
            createdAt: Date;
            id: number;
            cliniqueId: number;
            updatedAt: Date;
            nom: string;
            prenom: string;
            sexe: string | null;
            telephone: string | null;
            code: string;
            numeroDossier: string;
            creeParId: number | null;
            age: string | null;
            dateNaissance: Date | null;
            numeroCni: string | null;
            numeroCmu: string | null;
            ville: string | null;
            scolarisation: string | null;
            statutConjugal: string | null;
            typePopulation: string | null;
            populationsRisque: string | null;
            protectionSociale: string | null;
            residenceHabituelle: string | null;
            residenceActuelle: string | null;
        };
        service: {
            id: number;
            nom: string;
            code: string;
        };
    }[]>;
    fileAttente(cliniqueId: number, jour?: string, page?: string, perPage?: string): Promise<{
        data: {
            id: number;
            numeroOrdre: string;
            patient: {
                nom: string;
                prenom: string;
                code: string;
            };
            service: {
                nom: string;
            };
            totalAPayer: number;
            nbLignes: number;
        }[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    }>;
    payesDuJour(cliniqueId: number, page?: string, perPage?: string): Promise<{
        data: {
            id: number;
            numeroRecu: string;
            modePaiement: string;
            montant: number;
            createdAt: Date;
            numeroOrdre: string;
            patient: {
                nom: string;
                prenom: string;
            };
        }[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    }>;
    detail(id: number): Promise<{
        assurancePatient: {
            assurance: {
                code: string;
                libelle: string;
            };
            formule: {
                code: string;
                libelle: string;
            };
            numeroAssure: string;
            typeBeneficiaire: string;
        };
        prestations: {
            montant: number;
            couverture: any;
            service: {
                nom: string;
            };
            createdAt: Date;
            id: number;
            statut: string;
            updatedAt: Date;
            serviceId: number | null;
            libelle: string;
            passageId: number;
            agentId: number | null;
            prestationId: number | null;
            source: string;
            gratuit: boolean;
            paiementId: number | null;
            creditId: number | null;
        }[];
        paiements: {
            montantTotal: number;
            partAssurance: number;
            partPatient: number;
            lignes: {
                montant: number;
                createdAt: Date;
                id: number;
                statut: string;
                updatedAt: Date;
                serviceId: number | null;
                libelle: string;
                passageId: number;
                agentId: number | null;
                prestationId: number | null;
                source: string;
                gratuit: boolean;
                paiementId: number | null;
                creditId: number | null;
            }[];
            caissier: {
                personnel: {
                    nom: string;
                    prenom: string;
                };
                matricule: string;
            };
            createdAt: Date;
            id: number;
            cliniqueId: number;
            statut: string;
            updatedAt: Date;
            passageId: number;
            caissierId: number;
            numeroRecu: string;
            modePaiement: string;
            motifAnnulation: string | null;
            dateAnnulation: Date | null;
            assuranceId: number | null;
            formuleLibelle: string | null;
            tauxParametre: number | null;
            tauxApplique: number | null;
            motifTaux: string | null;
        }[];
        patient: {
            nationalite: string | null;
            profession: string | null;
            quartier: string | null;
            createdAt: Date;
            id: number;
            cliniqueId: number;
            updatedAt: Date;
            nom: string;
            prenom: string;
            sexe: string | null;
            telephone: string | null;
            code: string;
            numeroDossier: string;
            creeParId: number | null;
            age: string | null;
            dateNaissance: Date | null;
            numeroCni: string | null;
            numeroCmu: string | null;
            ville: string | null;
            scolarisation: string | null;
            statutConjugal: string | null;
            typePopulation: string | null;
            populationsRisque: string | null;
            protectionSociale: string | null;
            residenceHabituelle: string | null;
            residenceActuelle: string | null;
        };
        service: {
            id: number;
            nom: string;
            code: string;
        };
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        updatedAt: Date;
        serviceId: number;
        patientId: number;
        numeroOrdre: string;
        typePatient: string;
        motif: string | null;
        referent: string | null;
        prestationDemandee: string | null;
        agentId: number | null;
        taille: string | null;
        temperature: import("@prisma/client/runtime/library").Decimal | null;
        pouls: number | null;
        tensionGauche: string | null;
        tensionDroite: string | null;
        poids: import("@prisma/client/runtime/library").Decimal | null;
        perimetreBrachial: string | null;
        perimetreCranien: string | null;
        materniteTraiteLe: Date | null;
        expireLe: Date;
    }>;
    detailPaiement(id: number): Promise<{
        montantTotal: number;
        partAssurance: number;
        partPatient: number;
        lignes: {
            montant: number;
            createdAt: Date;
            id: number;
            statut: string;
            updatedAt: Date;
            serviceId: number | null;
            libelle: string;
            passageId: number;
            agentId: number | null;
            prestationId: number | null;
            source: string;
            gratuit: boolean;
            paiementId: number | null;
            creditId: number | null;
        }[];
        clinique: {
            createdAt: Date;
            id: number;
            statut: string;
            updatedAt: Date;
            nom: string;
            telephone: string | null;
            code: string;
            adresse: string | null;
            immatriculation: string | null;
            districtNom: string | null;
            districtCode: string | null;
            regionNom: string | null;
            regionCode: string | null;
            populationDesservie: number | null;
            responsableRapportNom: string | null;
            responsableRapportFonction: string | null;
            responsableRapportContact: string | null;
        };
        passage: {
            patient: {
                nationalite: string | null;
                profession: string | null;
                quartier: string | null;
                createdAt: Date;
                id: number;
                cliniqueId: number;
                updatedAt: Date;
                nom: string;
                prenom: string;
                sexe: string | null;
                telephone: string | null;
                code: string;
                numeroDossier: string;
                creeParId: number | null;
                age: string | null;
                dateNaissance: Date | null;
                numeroCni: string | null;
                numeroCmu: string | null;
                ville: string | null;
                scolarisation: string | null;
                statutConjugal: string | null;
                typePopulation: string | null;
                populationsRisque: string | null;
                protectionSociale: string | null;
                residenceHabituelle: string | null;
                residenceActuelle: string | null;
            };
        } & {
            createdAt: Date;
            id: number;
            cliniqueId: number;
            statut: string;
            updatedAt: Date;
            serviceId: number;
            patientId: number;
            numeroOrdre: string;
            typePatient: string;
            motif: string | null;
            referent: string | null;
            prestationDemandee: string | null;
            agentId: number | null;
            taille: string | null;
            temperature: import("@prisma/client/runtime/library").Decimal | null;
            pouls: number | null;
            tensionGauche: string | null;
            tensionDroite: string | null;
            poids: import("@prisma/client/runtime/library").Decimal | null;
            perimetreBrachial: string | null;
            perimetreCranien: string | null;
            materniteTraiteLe: Date | null;
            expireLe: Date;
        };
        caissier: {
            personnel: {
                nom: string;
                prenom: string;
            };
            matricule: string;
        };
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        updatedAt: Date;
        passageId: number;
        caissierId: number;
        numeroRecu: string;
        modePaiement: string;
        motifAnnulation: string | null;
        dateAnnulation: Date | null;
        assuranceId: number | null;
        formuleLibelle: string | null;
        tauxParametre: number | null;
        tauxApplique: number | null;
        motifTaux: string | null;
    }>;
    ajouterPrestation(id: number, dto: AjouterPrestationDto, req: any): Promise<{
        montant: number;
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
        serviceId: number | null;
        libelle: string;
        passageId: number;
        agentId: number | null;
        prestationId: number | null;
        source: string;
        gratuit: boolean;
        paiementId: number | null;
        creditId: number | null;
    }>;
    retirerPrestation(id: number): Promise<{
        createdAt: Date;
        id: number;
        statut: string;
        updatedAt: Date;
        serviceId: number | null;
        libelle: string;
        passageId: number;
        agentId: number | null;
        prestationId: number | null;
        montant: import("@prisma/client/runtime/library").Decimal;
        source: string;
        gratuit: boolean;
        paiementId: number | null;
        creditId: number | null;
    }>;
    encaisser(id: number, dto: EncaisserDto, req: any): Promise<{
        paiement: {
            montantTotal: number;
            createdAt: Date;
            id: number;
            cliniqueId: number;
            statut: string;
            updatedAt: Date;
            passageId: number;
            caissierId: number;
            numeroRecu: string;
            modePaiement: string;
            motifAnnulation: string | null;
            dateAnnulation: Date | null;
            assuranceId: number | null;
            formuleLibelle: string | null;
            tauxParametre: number | null;
            tauxApplique: number | null;
            partAssurance: import("@prisma/client/runtime/library").Decimal | null;
            partPatient: import("@prisma/client/runtime/library").Decimal | null;
            motifTaux: string | null;
        };
        lignes: {
            id: number;
            libelle: string;
            montant: number;
        }[];
        passage: {
            id: number;
            statut: string;
            numeroOrdre: string;
        };
        patient: {
            nom: string;
            prenom: string;
            code: string;
        };
        impression: any;
    }>;
    annuler(id: number, dto: AnnulerPaiementDto): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        updatedAt: Date;
        passageId: number;
        caissierId: number;
        numeroRecu: string;
        montantTotal: import("@prisma/client/runtime/library").Decimal;
        modePaiement: string;
        motifAnnulation: string | null;
        dateAnnulation: Date | null;
        assuranceId: number | null;
        formuleLibelle: string | null;
        tauxParametre: number | null;
        tauxApplique: number | null;
        partAssurance: import("@prisma/client/runtime/library").Decimal | null;
        partPatient: import("@prisma/client/runtime/library").Decimal | null;
        motifTaux: string | null;
    }>;
    creerCredit(id: number, dto: {
        lignesIds: number[];
        type: 'CREDIT' | 'CAS_SOCIAL';
        motif?: string;
    }, req: any): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        updatedAt: Date;
        type: string;
        passageId: number;
        montantTotal: import("@prisma/client/runtime/library").Decimal;
        motif: string | null;
        agentId: number | null;
        numero: string;
    }>;
    credits(cliniqueId: number, page?: string, perPage?: string): Promise<{
        data: ({
            passage: {
                patient: {
                    nom: string;
                    prenom: string;
                    code: string;
                };
                numeroOrdre: string;
            };
            lignes: {
                statut: string;
                libelle: string;
                montant: import("@prisma/client/runtime/library").Decimal;
            }[];
            agent: {
                personnel: {
                    nom: string;
                    prenom: string;
                };
                matricule: string;
            };
        } & {
            createdAt: Date;
            id: number;
            cliniqueId: number;
            statut: string;
            updatedAt: Date;
            type: string;
            passageId: number;
            montantTotal: import("@prisma/client/runtime/library").Decimal;
            motif: string | null;
            agentId: number | null;
            numero: string;
        })[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    }>;
    annulerCredit(id: number): Promise<{
        createdAt: Date;
        id: number;
        cliniqueId: number;
        statut: string;
        updatedAt: Date;
        type: string;
        passageId: number;
        montantTotal: import("@prisma/client/runtime/library").Decimal;
        motif: string | null;
        agentId: number | null;
        numero: string;
    }>;
}
