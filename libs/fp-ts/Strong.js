import { identity } from './function.js';
export function split(S, C) {
    return (pab, pcd) => C.compose(S.second(pcd), S.first(pab));
}
export function fanOut(S, C) {
    const splitSC = split(S, C);
    return (pab, pac) => C.compose(splitSC(pab, pac), S.promap(C.id(), identity, (a) => [a, a]));
}
export function splitStrong(F) {
    return split(F, F);
}
export function fanout(F) {
    return fanOut(F, F);
}
//# sourceMappingURL=Strong.js.map