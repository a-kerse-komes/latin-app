/**
 * The `FromEither` type class represents those data types which support errors.
 *
 * @since 2.10.0
 */
import { chainFirst } from './Chain.js';
import { flow } from './function.js';
import * as _ from './internal.js';
export function fromOption(F) {
    return (onNone) => (ma) => F.fromEither(_.isNone(ma) ? _.left(onNone()) : _.right(ma.value));
}
export function fromPredicate(F) {
    return (predicate, onFalse) => (a) => F.fromEither(predicate(a) ? _.right(a) : _.left(onFalse(a)));
}
export function fromOptionK(F) {
    const fromOptionF = fromOption(F);
    return (onNone) => {
        const from = fromOptionF(onNone);
        return (f) => flow(f, from);
    };
}
export function chainOptionK(F, M) {
    const fromOptionKF = fromOptionK(F);
    return (onNone) => {
        const from = fromOptionKF(onNone);
        return (f) => (ma) => M.chain(ma, from(f));
    };
}
export function fromEitherK(F) {
    return (f) => flow(f, F.fromEither);
}
export function chainEitherK(F, M) {
    const fromEitherKF = fromEitherK(F);
    return (f) => (ma) => M.chain(ma, fromEitherKF(f));
}
export function chainFirstEitherK(F, M) {
    return flow(fromEitherK(F), chainFirst(M));
}
export function filterOrElse(F, M) {
    return (predicate, onFalse) => (ma) => M.chain(ma, (a) => F.fromEither(predicate(a) ? _.right(a) : _.left(onFalse(a))));
}
//# sourceMappingURL=FromEither.js.map