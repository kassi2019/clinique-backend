export declare class CreateServiceDto {
    cliniqueId: number;
    code: string;
    nom: string;
    description?: string;
    actif?: boolean;
}
export declare class UpdateServiceDto {
    cliniqueId?: number;
    code?: string;
    nom?: string;
    description?: string;
    actif?: boolean;
}
