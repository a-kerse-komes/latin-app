import { pipe } from './function.js';
import { snd } from './ReadonlyTuple.js';
export function of(F) {
    return (a) => (s) => F.of([a, s]);
}
export function map(F) {
    return (f) => (fa) => (s) => F.map(fa(s), ([a, s1]) => [f(a), s1]);
}
export function ap(M) {
    return (fa) => (fab) => (s) => M.chain(fab(s), ([f, s]) => M.map(fa(s), ([a, s]) => [f(a), s]));
}
export function chain(M) {
    const flatMapM = flatMap(M);
    return (f) => (ma) => flatMapM(ma, f);
}
/** @internal */
export function flatMap(M) {
    return (ma, f) => (s) => M.chain(ma(s), ([a, s1]) => f(a)(s1));
}
export function fromState(F) {
    return (sa) => (s) => F.of(sa(s));
}
export function fromF(F) {
    return (ma) => (s) => F.map(ma, (a) => [a, s]);
}
export function evaluate(F) {
    return (s) => (ma) => F.map(ma(s), ([a]) => a);
}
export function execute(F) {
    return (s) => (ma) => F.map(ma(s), snd);
}
/** @deprecated */
/* istanbul ignore next */
export function getStateM(M) {
    const _ap = ap(M);
    const _map = map(M);
    const _chain = chain(M);
    const _evaluate = evaluate(M);
    const _execute = execute(M);
    return {
        map: (fa, f) => pipe(fa, _map(f)),
        ap: (fab, fa) => pipe(fab, _ap(fa)),
        of: of(M),
        chain: (ma, f) => pipe(ma, _chain(f)),
        get: () => (s) => M.of([s, s]),
        put: (s) => () => M.of([undefined, s]),
        modify: (f) => (s) => M.of([undefined, f(s)]),
        gets: (f) => (s) => M.of([f(s), s]),
        fromState: fromState(M),
        fromM: fromF(M),
        evalState: (fa, s) => pipe(fa, _evaluate(s)),
        execState: (fa, s) => pipe(fa, _execute(s))
    };
}
//# sourceMappingURL=StateT.js.map