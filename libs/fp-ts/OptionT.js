import { ap as ap_ } from './Apply.js';
import { constant, flow, pipe } from './function.js';
import { map as map_ } from './Functor.js';
import * as O from './Option.js';
export function some(F) {
    return flow(O.some, F.of);
}
export function zero(F) {
    return constant(F.of(O.none));
}
export function fromF(F) {
    return (ma) => F.map(ma, O.some);
}
export function fromNullable(F) {
    return flow(O.fromNullable, F.of);
}
export function fromNullableK(F) {
    const fromNullableF = fromNullable(F);
    return (f) => flow(f, fromNullableF);
}
export function chainNullableK(M) {
    const chainM = chain(M);
    const fromNullableKM = fromNullableK(M);
    return (f) => chainM(fromNullableKM(f));
}
export function fromOptionK(F) {
    return (f) => flow(f, F.of);
}
export function chainOptionK(M) {
    const chainM = chain(M);
    const fromOptionKM = fromOptionK(M);
    return (f) => chainM(fromOptionKM(f));
}
export function fromPredicate(F) {
    return (predicate) => (a) => F.of(O.fromPredicate(predicate)(a));
}
export function fromEither(F) {
    return flow(O.fromEither, F.of);
}
export function match(F) {
    return (onNone, onSome) => (ma) => F.map(ma, O.match(onNone, onSome));
}
export function matchE(M) {
    return (onNone, onSome) => (ma) => M.chain(ma, O.match(onNone, onSome));
}
export function getOrElse(M) {
    return (onNone) => (fa) => M.chain(fa, O.match(onNone, M.of));
}
export function map(F) {
    return map_(F, O.Functor);
}
export function ap(F) {
    return ap_(F, O.Apply);
}
export function chain(M) {
    const flatMapM = flatMap(M);
    return (f) => (ma) => flatMapM(ma, f);
}
/** @internal */
export function flatMap(M) {
    const zeroM = zero(M);
    return (ma, f) => M.chain(ma, O.match(() => zeroM(), f));
}
export function alt(M) {
    const _some = some(M);
    return (second) => (first) => M.chain(first, O.match(second, _some));
}
/** @deprecated */
export function getOptionM(M) {
    const apM = ap(M);
    const mapM = map(M);
    const chainM = chain(M);
    const altM = alt(M);
    const foldM = matchE(M);
    const getOrElseM = getOrElse(M);
    const zeroM = zero(M);
    return {
        map: (fa, f) => pipe(fa, mapM(f)),
        ap: (fab, fa) => pipe(fab, apM(fa)),
        of: some(M),
        chain: (ma, f) => pipe(ma, chainM(f)),
        alt: (fa, that) => pipe(fa, altM(that)),
        fold: (fa, onNone, onSome) => pipe(fa, foldM(onNone, onSome)),
        getOrElse: (fa, onNone) => pipe(fa, getOrElseM(onNone)),
        fromM: fromF(M),
        none: () => zeroM()
    };
}
//# sourceMappingURL=OptionT.js.map