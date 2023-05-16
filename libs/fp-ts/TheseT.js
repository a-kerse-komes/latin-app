/**
 * @since 2.4.0
 */
import { ap as ap_ } from './Apply.js';
import { flow, pipe } from './function.js';
import { map as map_ } from './Functor.js';
import * as T from './These.js';
export function right(F) {
    return flow(T.right, F.of);
}
export function left(F) {
    return flow(T.left, F.of);
}
export function both(F) {
    return flow(T.both, F.of);
}
export function rightF(F) {
    return (fa) => F.map(fa, T.right);
}
export function leftF(F) {
    return (fe) => F.map(fe, T.left);
}
export function map(F) {
    return map_(F, T.Functor);
}
export function ap(F, S) {
    return ap_(F, T.getApply(S));
}
export function chain(M, S) {
    const _left = left(M);
    return (f) => (ma) => M.chain(ma, T.match(_left, f, (e1, a) => M.map(f(a), T.match((e2) => T.left(S.concat(e1, e2)), (b) => T.both(e1, b), (e2, b) => T.both(S.concat(e1, e2), b)))));
}
export function bimap(F) {
    return (f, g) => (fea) => F.map(fea, T.bimap(f, g));
}
export function mapLeft(F) {
    return (f) => (fea) => F.map(fea, T.mapLeft(f));
}
export function match(F) {
    return (onLeft, onRight, onBoth) => (ma) => F.map(ma, T.match(onLeft, onRight, onBoth));
}
export function matchE(M) {
    return (onLeft, onRight, onBoth) => (ma) => M.chain(ma, T.match(onLeft, onRight, onBoth));
}
export function swap(F) {
    return (ma) => F.map(ma, T.swap);
}
export function toTuple2(F) {
    return (e, a) => (fa) => F.map(fa, T.toTuple2(e, a));
}
/** @deprecated */
/* istanbul ignore next */
export function getTheseM(M) {
    const _map = map(M);
    const _bimap = bimap(M);
    const _mapLeft = mapLeft(M);
    const _fold = matchE(M);
    const _toTuple2 = toTuple2(M);
    const of = right(M);
    const mapT = (fa, f) => pipe(fa, _map(f));
    return {
        map: mapT,
        bimap: (fea, f, g) => pipe(fea, _bimap(f, g)),
        mapLeft: (fea, f) => pipe(fea, _mapLeft(f)),
        fold: (fa, onLeft, onRight, onBoth) => pipe(fa, _fold(onLeft, onRight, onBoth)),
        swap: swap(M),
        rightM: rightF(M),
        leftM: leftF(M),
        left: left(M),
        right: right(M),
        both: both(M),
        toTuple: (fa, e, a) => pipe(fa, _toTuple2(() => e, () => a)),
        getMonad: (S) => {
            const _ap = ap(M, S);
            const _chain = chain(M, S);
            return {
                _E: undefined,
                map: mapT,
                of,
                ap: (fab, fa) => pipe(fab, _ap(fa)),
                chain: (ma, f) => pipe(ma, _chain(f))
            };
        }
    };
}
//# sourceMappingURL=TheseT.js.map