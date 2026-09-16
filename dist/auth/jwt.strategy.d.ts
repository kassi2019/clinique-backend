import { Strategy } from 'passport-jwt';
export interface JwtPayload {
    sub: number;
    matricule: string;
    role: string;
}
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: JwtPayload): Promise<{
        id: number;
        matricule: string;
        role: string;
    }>;
}
export {};
