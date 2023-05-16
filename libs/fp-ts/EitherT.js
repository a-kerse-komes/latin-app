import { ap as ap_ } from './Apply.js';
import * as E from './Either.js';
import { flow, pipe } from './function.js';
import { map as map_ } from './Functor.js';
export function right(F) {
    return flow(E.right, F.of);
}
export function left(F) {
    return flow(E.left, F.of);
}
export function rightF(F) {
    return (fa) => F.map(fa, E.right);
}
export function leftF(F) {
    return (fe) => F.map(fe, E.left);
}
export function fromNullable(F) {
    return (e) => flow(E.fromNullable(e), F.of);
}
export function fromNullableK(F) {
    const fromNullableF = fromNullable(F);
    return (e) => {
        const fromNullableFE = fromNullableF(e);
        return (f) => flow(f, fromNullableFE);
    };
}
export function chainNullableK(M) {
    const chainM = chain(M);
    const fromNullableKM = fromNullableK(M);
    return (e) => {
        const fromNullableKMe = fromNullableKM(e);
        return (f) => chainM(fromNullableKMe(f));
    };
}
export function map(F) {
    return map_(F, E.Functor);
}
export function ap(F) {
    return ap_(F, E.Apply);
}
export function chain(M) {
    const flatMapM = flatMap(M);
    return (f) => (ma) => flatMapM(ma, f);
}
/** @internal */
export function flatMap(M) {
    return (ma, f) => M.chain(ma, (e) => (E.isLeft(e) ? M.of(e) : f(e.right)));
}
export function alt(M) {
    return (second) => (first) => M.chain(first, (e) => (E.isLeft(e) ? second() : M.of(e)));
}
export function bimap(F) {
    return (f, g) => (fea) => F.map(fea, E.bimap(f, g));
}
export function mapLeft(F) {
    return (f) => (fea) => F.map(fea, E.mapLeft(f));
}
export function altValidation(M, S) {
    return (second) => (first) => M.chain(first, E.match((e1) => M.map(second(), E.mapLeft((e2) => S.concat(e1, e2))), right(M)));
}
export function match(F) {
    return (onLeft, onRight) => (ma) => F.map(ma, E.match(onLeft, onRight));
}
export function matchE(M) {
    return (onLeft, onRight) => (ma) => M.chain(ma, E.match(onLeft, onRight));
}
export function getOrElse(M) {
    return (onLeft) => (ma) => M.chain(ma, E.match(onLeft, M.of));
}
export function orElse(M) {
    return (onLeft) => (ma) => M.chain(ma, (e) => (E.isLeft(e) ? onLeft(e.left) : M.of(e)));
}
export function orElseFirst(M) {
    const tapErrorM = tapError(M);
    return (onLeft) => (ma) => tapErrorM(ma, onLeft);
}
/** @internal */
export function tapError(M) {
    const orElseM = orElse(M);
    return (ma, onLeft) => pipe(ma, orElseM((e) => M.map(onLeft(e), (eb) => (E.isLeft(eb) ? eb : E.left(e)))));
}
export function orLeft(M) {
    return (onLeft) => (ma) => M.chain(ma, E.match((e) => M.map(onLeft(e), E.left), (a) => M.of(E.right(a))));
}
export function swap(F) {
    return (ma) => F.map(ma, E.swap);
}
export function toUnion(F) {
    return (fa) => F.map(fa, E.toUnion);
}
/** @deprecated  */
/* istanbul ignore next */
export function getEitherM(M) {
    const _ap = ap(M);
    const _map = map(M);
    const _chain = chain(M);
    const _alt = alt(M);
    const _bimap = bimap(M);
    const _mapLeft = mapLeft(M);
    const _fold = matchE(M);
    const _getOrElse = getOrElse(M);
    const _orElse = orElse(M);
    return {
        map: (fa, f) => pipe(fa, _map(f)),
        ap: (fab, fa) => pipe(fab, _ap(fa)),
        of: right(M),
        chain: (ma, f) => pipe(ma, _chain(f)),
        alt: (fa, that) => pipe(fa, _alt(that)),
        bimap: (fea, f, g) => pipe(fea, _bimap(f, g)),
        mapLeft: (fea, f) => pipe(fea, _mapLeft(f)),
        fold: (fa, onLeft, onRight) => pipe(fa, _fold(onLeft, onRight)),
        getOrElse: (fa, onLeft) => pipe(fa, _getOrElse(onLeft)),
        orElse: (fa, f) => pipe(fa, _orElse(f)),
        swap: swap(M),
        rightM: rightF(M),
        leftM: leftF(M),
        left: left(M)
    };
}
//# sourceMappingURL=EitherT.js.map