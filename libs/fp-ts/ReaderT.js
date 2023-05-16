import { flow, pipe } from './function.js';
export function of(F) {
    return (a) => () => F.of(a);
}
export function map(F) {
    return (f) => (fa) => (r) => F.map(fa(r), f);
}
export function ap(F) {
    return (fa) => (fab) => (r) => F.ap(fab(r), fa(r));
}
export function chain(M) {
    const flatMapM = flatMap(M);
    return (f) => (ma) => flatMapM(ma, f);
}
/** @internal */
export function flatMap(M) {
    return (ma, f) => (r) => M.chain(ma(r), (a) => f(a)(r));
}
export function fromReader(F) {
    return (ma) => flow(ma, F.of);
}
export function fromNaturalTransformation(nt) {
    return (f) => flow(f, nt);
}
/** @deprecated */
/* istanbul ignore next */
export function getReaderM(M) {
    const _ap = ap(M);
    const _map = map(M);
    const _chain = chain(M);
    return {
        map: (fa, f) => pipe(fa, _map(f)),
        ap: (fab, fa) => pipe(fab, _ap(fa)),
        of: of(M),
        chain: (ma, f) => pipe(ma, _chain(f)),
        ask: () => M.of,
        asks: (f) => flow(f, M.of),
        local: (ma, f) => (q) => ma(f(q)),
        fromReader: fromReader(M),
        fromM: (ma) => () => ma
    };
}
//# sourceMappingURL=ReaderT.js.map