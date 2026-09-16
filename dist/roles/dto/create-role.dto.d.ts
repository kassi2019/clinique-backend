export declare class HabilitationDto {
    moduleId: number;
    lecture?: boolean;
    ecriture?: boolean;
    validation?: boolean;
}
export declare class CreateRoleDto {
    code: string;
    nom: string;
    description?: string;
    habilitations?: HabilitationDto[];
}
