export declare const ONGLETS: {
    module: string;
    code: string;
    nom: string;
}[];
export declare const CODES_ONGLETS: Set<string>;
export declare const moduleDeLOnglet: (code: string) => string;
export declare function ongletAutorise(autorises: string[], code: string): boolean;
