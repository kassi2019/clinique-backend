import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    private prisma;
    constructor(authService: AuthService, prisma: PrismaService);
    login(dto: LoginDto): Promise<{
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
    me(req: any): Promise<{
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
    configPublic(): Promise<{
        clinique: {
            id: number;
            code: string;
            nom: string;
        };
        loginImage: string;
    }>;
}
