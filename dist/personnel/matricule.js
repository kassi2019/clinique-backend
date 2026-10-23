"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PREFIXE_ADMINISTRATIF = void 0;
exports.prefixeMatricule = prefixeMatricule;
exports.prochainMatricule = prochainMatricule;
const REGLES = [
    [['SAGE'], 'SFDE'],
    [['MEDECIN', 'PEDIATRE', 'GYNECO', 'DOCTEUR', 'CHIRURGIEN'], 'MED'],
    [['INFIRM'], 'INF'],
    [['AIDE'], 'AID'],
    [['IMAGER', 'MANIPULATEUR', 'RADIO', 'ECHOGRAPH'], 'IMA'],
    [['LABO', 'BIOLOG'], 'LAB'],
    [['PHARMA'], 'PHA'],
    [['CAISS'], 'CAI'],
    [['ACCUEIL', 'ACCEUIL'], 'ACC'],
];
const PREFIXES_SERVICE = ['MED', 'INF', 'IMA', 'LAB', 'PHA', 'CAI', 'ACC'];
exports.PREFIXE_ADMINISTRATIF = 'PERA';
function normaliser(texte) {
    return (texte ?? '')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toUpperCase();
}
function prefixeMatricule(fonction, codeService) {
    const f = normaliser(fonction);
    for (const [motsCles, prefixe] of REGLES) {
        if (motsCles.some((m) => f.includes(m)))
            return prefixe;
    }
    const s = normaliser(codeService).trim().slice(0, 3);
    if (PREFIXES_SERVICE.includes(s))
        return s;
    return exports.PREFIXE_ADMINISTRATIF;
}
function prochainMatricule(prefixe, existants) {
    const motif = new RegExp(`^${prefixe}(\\d+)$`);
    let max = 0;
    for (const m of existants) {
        const n = Number(motif.exec(m)?.[1]);
        if (n > max)
            max = n;
    }
    return `${prefixe}${String(max + 1).padStart(3, '0')}`;
}
//# sourceMappingURL=matricule.js.map