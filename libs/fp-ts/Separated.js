/**
 * ```ts
 * interface Separated<E, A> {
 *    readonly left: E
 *    readonly right: A
 * }
 * ```
 *
 * Represents a result of separating a whole into two parts.
 *
 * @since 2.10.0
 */
import { pipe } from './function.js';
import { flap as flap_ } from './Functor.js';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.10.0
 */
export const separated = (left, right) => ({ left, right });
const _map = (fa, f) => pipe(fa, map(f));
const _mapLeft = (fa, f) => pipe(fa, mapLeft(f));
const _bimap = (fa, g, f) => pipe(fa, bimap(g, f));
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.10.0
 */
export const map = (f) => (fa) => separated(left(fa), f(right(fa)));
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.10.0
 */
export const mapLeft = (f) => (fa) => separated(f(left(fa)), right(fa));
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.10.0
 */
export const bimap = (f, g) => (fa) => separated(f(left(fa)), g(right(fa)));
/**
 * @category type lambdas
 * @since 2.10.0
 */
export const URI = 'Separated';
/**
 * @category instances
 * @since 2.10.0
 */
export const Bifunctor = {
    URI,
    mapLeft: _mapLeft,
    bimap: _bimap
};
/**
 * @category instances
 * @since 2.10.0
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
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.10.0
 */
export const left = (s) => s.left;
/**
 * @since 2.10.0
 */
export const right = (s) => s.right;
//# sourceMappingURL=Separated.js.map