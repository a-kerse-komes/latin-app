import { identity, pipe, unsafeCoerce } from './function.js';
import { flap as flap_ } from './Functor.js';
/**
 * @category constructors
 * @since 2.0.0
 */
export const make = unsafeCoerce;
/**
 * @category instances
 * @since 2.0.0
 */
export function getShow(S) {
    return {
        show: (c) => `make(${S.show(c)})`
    };
}
/**
 * @category instances
 * @since 2.0.0
 */
export const getEq = identity;
/**
 * @category instances
 * @since 2.6.0
 */
export const getOrd = identity;
/**
 * @category instances
 * @since 2.6.0
 */
export const getBounded = identity;
/**
 * @category instances
 * @since 2.6.0
 */
export const getSemigroup = identity;
/**
 * @category instances
 * @since 2.6.0
 */
export const getMonoid = identity;
/**
 * @category instances
 * @since 2.6.0
 */
export const getSemiring = identity;
/**
 * @category instances
 * @since 2.6.0
 */
export const getRing = identity;
/**
 * @category instances
 * @since 2.6.0
 */
export const getHeytingAlgebra = identity;
/**
 * @category instances
 * @since 2.6.0
 */
export const getBooleanAlgebra = identity;
/**
 * @category instances
 * @since 2.0.0
 */
export function getApply(S) {
    return {
        URI,
        _E: undefined,
        map: _map,
        ap: (fab, fa) => make(S.concat(fab, fa))
    };
}
/**
 * @category instances
 * @since 2.0.0
 */
export function getApplicative(M) {
    const A = getApply(M);
    return {
        URI,
        _E: undefined,
        map: A.map,
        ap: A.ap,
        of: () => make(M.empty)
    };
}
const _contramap = (fa, f) => pipe(fa, contramap(f));
/* istanbul ignore next */
const _map = (fa, f) => pipe(fa, map(f));
/* istanbul ignore next */
const _bimap = (fa, f, g) => pipe(fa, bimap(f, g));
/* istanbul ignore next */
const _mapLeft = (fa, f) => pipe(fa, mapLeft(f));
/**
 * @since 2.0.0
 */
export const contramap = () => unsafeCoerce;
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export const map = () => unsafeCoerce;
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.6.2
 */
export const bimap = (f) => (fa) => make(f(fa));
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.6.2
 */
export const mapLeft = (f) => (fa) => make(f(fa));
/**
 * @category type lambdas
 * @since 2.0.0
 */
export const URI = 'Const';
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
export const Contravariant = {
    URI,
    contramap: _contramap
};
/**
 * @category instances
 * @since 2.7.0
 */
export const Bifunctor = {
    URI,
    bimap: _bimap,
    mapLeft: _mapLeft
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `C.Functor` instead of `C.const_`
 * (where `C` is from `import C from 'fp-ts/Const'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const const_ = {
    URI,
    map: _map,
    contramap: _contramap,
    bimap: _bimap,
    mapLeft: _mapLeft
};
//# sourceMappingURL=Const.js.map