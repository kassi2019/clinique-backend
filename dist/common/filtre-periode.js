"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HEURE_RE = exports.DATE_RE = void 0;
exports.jourLocal = jourLocal;
exports.heureValide = heureValide;
exports.utilisateurFiltre = utilisateurFiltre;
exports.aDesHeures = aDesHeures;
exports.bornesPeriode = bornesPeriode;
exports.bornesJourOptionnel = bornesJourOptionnel;
exports.DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
exports.HEURE_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
function jourLocal() {
    const n = new Date();
    const p = (x) => String(x).padStart(2, '0');
    return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`;
}
function heureValide(h) {
    return h && exports.HEURE_RE.test(h) ? h : undefined;
}
function utilisateurFiltre(v) {
    const n = Number(v);
    return Number.isInteger(n) && n > 0 ? n : undefined;
}
function aDesHeures(heureDebut, heureFin) {
    return !!(heureValide(heureDebut) || heureValide(heureFin));
}
function bornesPeriode(jourDebut, jourFin, heureDebut, heureFin) {
    const d = exports.DATE_RE.test(jourDebut) ? jourDebut : jourLocal();
    const f = jourFin && exports.DATE_RE.test(jourFin) ? jourFin : d;
    const hd = heureValide(heureDebut);
    const hf = heureValide(heureFin);
    return {
        gte: new Date(`${d}T${hd ?? '00:00'}:00`),
        lte: hf ? new Date(`${f}T${hf}:59.999`) : new Date(`${f}T23:59:59.999`),
    };
}
function bornesJourOptionnel(jour, heureDebut, heureFin) {
    const j = jour && exports.DATE_RE.test(jour) ? jour : undefined;
    if (!j && !aDesHeures(heureDebut, heureFin))
        return undefined;
    return bornesPeriode(j ?? jourLocal(), j ?? jourLocal(), heureDebut, heureFin);
}
//# sourceMappingURL=filtre-periode.js.map