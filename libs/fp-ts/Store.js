import { identity, pipe } from './function.js';
import { flap as flap_ } from './Functor.js';
/**
 * Reposition the focus at the specified position
 *
 * @since 2.0.0
 */
export function seek(s) {
    return (wa) => ({ peek: wa.peek, pos: s });
}
/**
 * Reposition the focus at the specified position, which depends on the current position
 *
 * @since 2.0.0
 */
export function seeks(f) {
    return (wa) => ({ peek: wa.peek, pos: f(wa.pos) });
}
/**
 * Extract a value from a position which depends on the current position
 *
 * @since 2.0.0
 */
export function peeks(f) {
    return (wa) => wa.peek(f(wa.pos));
}
export function experiment(F) {
    return (f) => (wa) => F.map(f(wa.pos), (s) => wa.peek(s));
}
/* istanbul ignore next */
const _map = (fa, f) => pipe(fa, map(f));
/* istanbul ignore next */
const _extend = (wa, f) => pipe(wa, extend(f));
/**
 * @since 2.0.0
 */
export const extend = (f) => (wa) => ({
    peek: (s) => f({ peek: wa.peek, pos: s }),
    pos: wa.pos
});
/**
 * @category Extract
 * @since 2.6.2
 */
export const extract = (wa) => wa.peek(wa.pos);
/**
 * @since 2.0.0
 */
export const duplicate = /*#__PURE__*/ extend(identity);
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export const map = (f) => (fa) => ({
    peek: (s) => f(fa.peek(s)),
    pos: fa.pos
});
/**
 * @category type lambdas
 * @since 2.0.0
 */
export const URI = 'Store';
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
/**
 * @category instances
 * @since 2.7.0
 */
export const Comonad = {
    URI,
    map: _map,
    extend: _extend,
    extract
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Comonad` instance, pass `S.Comonad` instead of `S.store`
 * (where `S` is from `import S from 'fp-ts/Store'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const store = Comonad;
//# sourceMappingURL=Store.js.map