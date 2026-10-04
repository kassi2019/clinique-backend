import { ImpressionService } from '../impression/impression.service';
import { PrismaService } from '../prisma/prisma.service';
import { AffectationService } from '../affectation/affectation.service';
import { AssurancesService } from '../assurances/assurances.service';
import { EncaisserDto } from './dto/encaisser.dto';
export declare class CaisseService {
    private prisma;
    private impressionService;
    private affectationService;
    private assurancesService;
    private readonly logger;
    constructor(prisma: PrismaService, impressionService: ImpressionService, affectationService: AffectationService, assurancesService: AssurancesService);
    rechercher(search: string, cliniqueId: number): Promise<{
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
    detailPassage(passageId: number): Promise<{
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
    ajouterPrestation(passageId: number, prestationId: number, utilisateurId?: number): Promise<{
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
        paiementId: number | null;
        creditId: number | null;
    }>;
    retirerPrestation(ligneId: number): Promise<{
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
        paiementId: number | null;
        creditId: number | null;
    }>;
    detailPaiement(paiementId: number): Promise<{
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
    encaisser(passageId: number, dto: EncaisserDto, utilisateurId: number): Promise<{
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
    fileAttente(cliniqueId: number, page?: number, perPage?: number, jour?: string): Promise<{
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
    payesDuJour(cliniqueId: number, page?: number, perPage?: number): Promise<{
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
    annulerPaiement(paiementId: number, motif: string): Promise<{
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
    creerCredit(passageId: number, dto: {
        lignesIds: number[];
        type: 'CREDIT' | 'CAS_SOCIAL';
        motif?: string;
    }, utilisateurId: number): Promise<{
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
    credits(cliniqueId: number, page?: number, perPage?: number): Promise<{
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
