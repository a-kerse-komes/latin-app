import { constant, pipe } from './function.js';
export function reduce(F, G) {
    return (b, f) => (fga) => F.reduce(fga, b, (b, ga) => G.reduce(ga, b, f));
}
export function foldMap(F, G) {
    return (M) => {
        const foldMapF = F.foldMap(M);
        const foldMapG = G.foldMap(M);
        return (f) => (fga) => foldMapF(fga, (ga) => foldMapG(ga, f));
    };
}
export function reduceRight(F, G) {
    return (b, f) => (fga) => F.reduceRight(fga, b, (ga, b) => G.reduceRight(ga, b, f));
}
export function reduceM(M, F) {
    return (b, f) => (fa) => F.reduce(fa, M.of(b), (mb, a) => M.chain(mb, (b) => f(b, a)));
}
export function intercalate(M, F) {
    return (middle, fm) => {
        const go = ({ init, acc }, x) => init ? { init: false, acc: x } : { init: false, acc: M.concat(M.concat(acc, middle), x) };
        return F.reduce(fm, { init: true, acc: M.empty }, go).acc;
    };
}
export function toReadonlyArray(F) {
    return (fa) => F.reduce(fa, [], (acc, a) => {
        acc.push(a);
        return acc;
    });
}
export function traverse_(M, F) {
    const applyFirst = (mu, mb) => M.ap(M.map(mu, constant), mb);
    const mu = M.of(undefined);
    return (fa, f) => F.reduce(fa, mu, (mu, a) => applyFirst(mu, f(a)));
}
export function foldM(M, F) {
    return (fa, b, f) => F.reduce(fa, M.of(b), (mb, a) => M.chain(mb, (b) => f(b, a)));
}
/**
 * Use [`toReadonlyArray`](#toreadonlyarray) instead
 *
 * @category zone of death
 * @since 2.8.0
 * @deprecated
 */
export const toArray = toReadonlyArray;
/** @deprecated */
export function getFoldableComposition(F, G) {
    const _reduce = reduce(F, G);
    const _foldMap = foldMap(F, G);
    const _reduceRight = reduceRight(F, G);
    return {
        reduce: (fga, b, f) => pipe(fga, _reduce(b, f)),
        foldMap: (M) => {
            const foldMapM = _foldMap(M);
            return (fga, f) => pipe(fga, foldMapM(f));
        },
        reduceRight: (fga, b, f) => pipe(fga, _reduceRight(b, f))
    };
}
//# sourceMappingURL=Foldable.js.map