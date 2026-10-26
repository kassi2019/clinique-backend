import { SignatureCachetDto, SignatureService } from './signature.service';
export declare class MaSignatureController {
    private signatureService;
    constructor(signatureService: SignatureService);
    lire(req: any): Promise<{
        id: number;
        nom: string;
        prenom: string;
        signature: string;
        cachet: string;
    }>;
    enregistrer(req: any, dto: SignatureCachetDto): Promise<{
        id: number;
        nom: string;
        prenom: string;
        signature: string;
        cachet: string;
    }>;
}
