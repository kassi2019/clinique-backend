import { StatistiquesService } from './statistiques.service';
export declare class StatistiquesController {
    private statistiquesService;
    constructor(statistiquesService: StatistiquesService);
    tableauBord(jour?: string, cliniqueId?: string): {};
    frequentation(debut?: string, fin?: string, page?: string, perPage?: string, cliniqueId?: string): {};
    recettes(debut?: string, fin?: string, cliniqueId?: string): {};
    laboratoire(debut?: string, fin?: string, cliniqueId?: string): {};
    imagerie(debut?: string, fin?: string, cliniqueId?: string): {};
    hospitalisation(debut?: string, fin?: string, cliniqueId?: string): {};
    pharmacie(debut?: string, fin?: string, cliniqueId?: string): {};
    maternite(debut?: string, fin?: string, cliniqueId?: string): {};
}
