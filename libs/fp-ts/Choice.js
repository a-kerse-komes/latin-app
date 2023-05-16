import { identity } from './function.js';
export function split(P, C) {
    return (pab, pcd) => C.compose(P.right(pcd), P.left(pab));
}
export function fanIn(P, C) {
    const splitPC = split(P, C);
    return (pac, pbc) => C.compose(P.promap(C.id(), (cc) => (cc._tag === 'Left' ? cc.left : cc.right), identity), splitPC(pac, pbc));
}
export function splitChoice(F) {
    return split(F, F);
}
export function fanin(F) {
    return fanIn(F, F);
}
//# sourceMappingURL=Choice.js.map