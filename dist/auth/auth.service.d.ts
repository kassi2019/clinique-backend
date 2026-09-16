import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    private buildUser;
    login(matricule: string, motDePasse: string): Promise<{
        access_token: string;
        user: {
            id: number;
            matricule: string;
            role: {
                code: string;
                nom: string;
                modules: {
                    code: string;
                    nom: string;
                    lecture: boolean;
                    ecriture: boolean;
                    validation: boolean;
                }[];
            };
            personnel: {
                id: number;
                matricule: string;
                nom: string;
                prenom: string;
                photo: string;
                fonction: string;
                service: {
                    nom: string;
                    code: string;
                };
            };
            clinique: {
                id: number;
                code: string;
                nom: string;
            };
        };
    }>;
    me(userId: number): Promise<{
        id: number;
        matricule: string;
        role: {
            code: string;
            nom: string;
            modules: {
                code: string;
                nom: string;
                lecture: boolean;
                ecriture: boolean;
                validation: boolean;
            }[];
        };
        personnel: {
            id: number;
            matricule: string;
            nom: string;
            prenom: string;
            photo: string;
            fonction: string;
            service: {
                nom: string;
                code: string;
            };
        };
        clinique: {
            id: number;
            code: string;
            nom: string;
        };
    }>;
}
