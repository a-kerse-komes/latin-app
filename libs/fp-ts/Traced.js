import { pipe } from './function.js';
import { flap as flap_ } from './Functor.js';
// TODO: curry in v3
/**
 * Extracts a value at a relative position which depends on the current value.
 *
 * @since 2.0.0
 */
export function tracks(M, f) {
    return (wa) => wa(f(wa(M.empty)));
}
/**
 * Get the current position
 *
 * @since 2.0.0
 */
export function listen(wa) {
    return (e) => [wa(e), e];
}
/**
 * Get a value which depends on the current position
 *
 * @since 2.0.0
 */
export function listens(f) {
    return (wa) => (e) => [wa(e), f(e)];
}
/**
 * Apply a function to the current position
 *
 * @since 2.0.0
 */
export function censor(f) {
    return (wa) => (e) => wa(f(e));
}
/**
 * @category instances
 * @since 2.0.0
 */
export function getComonad(monoid) {
    function extend(wa, f) {
        return (p1) => f((p2) => wa(monoid.concat(p1, p2)));
    }
    function extract(wa) {
        return wa(monoid.empty);
    }
    return {
        URI,
        _E: undefined,
        map: _map,
        extend,
        extract
    };
}
/* istanbul ignore next */
const _map = (fa, f) => pipe(fa, map(f));
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export const map = (f) => (fa) => (p) => f(fa(p));
/**
 * @category type lambdas
 * @since 2.0.0
 */
export const URI = 'Traced';
/**
 * @category instances
 * @since 2.7.0
 */
export const Functor = {
    URI,
    map: _map
};
/**
 * @category mapping
 * @since 2.10.0
 */
export const flap = /*#__PURE__*/ flap_(Functor);
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`Functor`](#functor) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const traced = Functor;
//# sourceMappingURL=Traced.js.map