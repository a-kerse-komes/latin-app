import { flow } from './function.js';
import * as S from './State.js';
export function get(F) {
    return () => F.fromState(S.get());
}
export function put(F) {
    return (s) => F.fromState(S.put(s));
}
export function modify(F) {
    return flow(S.modify, F.fromState);
}
export function gets(F) {
    return flow(S.gets, F.fromState);
}
export function fromStateK(F) {
    return (f) => flow(f, F.fromState);
}
export function chainStateK(F, M) {
    const fromStateKF = fromStateK(F);
    return (f) => (ma) => M.chain(ma, fromStateKF(f));
}
//# sourceMappingURL=FromState.js.map